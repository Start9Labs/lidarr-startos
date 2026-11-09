<p align="center">
  <img src="icon.png" alt="Lidarr Logo" width="21%">
</p>

# Lidarr on StartOS

> Everything not listed in this document should behave the same as upstream
> Lidarr. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section
> of `instructions.md` for links.

[Lidarr](https://github.com/Lidarr/Lidarr) manages a music collection by monitoring artists, acquiring releases through download clients, and importing tracks. This package follows Sonarr's shared-storage and managed-login integration.

- **Wrapper repo:** <https://github.com/Start9Labs/lidarr-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The unmodified `linuxserver/lidarr` image runs its `/init` entrypoint as PID 1 (`runAsInit`), with `PUID=1000`, `PGID=1000`, and `TZ=Etc/UTC`. It supports x86_64 and aarch64. The primary daemon's subcontainer is `lidarr-sub`.

The image's init owns `/config` as uid 1000. Its Docker update mechanism disables in-app updates. The `reconcile` oneshot runs after daemon readiness on every start, calling the local API to apply the stored admin login and reconcile the optional qBittorrent client.

## Volume and Data Layout

Lidarr owns two volumes. Media files live on selected file-manager volumes, mounted read-write.

| Volume | Mount point | Contents |
| --- | --- | --- |
| `main` | `/config` | `config.xml`, `lidarr.db`, `logs.db`, `MediaCover/`, logs, application backups, and other upstream app data |
| `startos` | Not mounted | `store.json` and `share/api-key` |
| FileBrowser Quantum `data` | `/mnt/filebrowser` | Shared media and completed downloads, while selected and installed |
| NextExplorer `data` | `/mnt/nextexplorer` | Shared media and completed downloads, one folder per location, while selected and installed |
| qBittorrent `main/share` | `/mnt/qbittorrent` (read-only) | Its Web API key, while connected and installed |

The media mount points match qBittorrent and Jellyfin. Download paths reported by qBittorrent therefore need no remote path mapping. A download and library directory on the same mount can share hardlinks; different file managers cannot.

## File Models

Three models separate package state, upstream configuration, and the API-key sharing contract.

| File | Format | Ownership |
| --- | --- | --- |
| `startos/store.json` | JSON | Install seeds `apiKey`; actions set `adminPassword`, `mediaSources`, and `qbittorrentConnected`; reconciliation records `qbittorrentClientId` |
| `main/config.xml` | XML | Install disables analytics; every start merges the managed keys below, preserving other keys |
| `startos/share/api-key` | Text | Init publishes the stored API key, without a newline |

The stored admin password is plaintext on the unmounted `startos` volume because Lidarr's API requires the original value to reconcile its hashed credential. It is never placed in `config.xml` or written directly into the database.

On every start, the package enforces `ApiKey`, Forms authentication, authentication required for every address, an empty `AllowedHosts` list (accept any host), disabled in-container SSL, bind address `*`, HTTP port 8686, empty `UrlBase`, and `TrustedNetworks` set to the OS bridge address. Trusting that proxy allows HTTPS redirects to retain their scheme. Authentication cannot exempt local addresses because proxied clients arrive from the local bridge.

`AnalyticsEnabled=False` is seeded only on installation; subsequent changes belong to the user. Other upstream configuration survives package merges. An API key regenerated in the UI is restored from the store at the next start.

## Dependencies

All three dependencies are optional integrations, activated by the stored selection.

| Dependency | Requirement while selected | Purpose |
| --- | --- | --- |
| `filebrowser` | Installed (`exists`) | Read-write `data` mount for media |
| `nextexplorer` | Installed (`exists`) | Read-write `data` mount for media |
| `qbittorrent` | Running, health check `primary` | Download API and read-only key share |

Both file managers use uid 1000, matching Lidarr. Selection remains stored when a dependency is uninstalled, but the missing volume is not mounted. Lidarr can still start; its missing root folders cannot be scanned or imported into. Reinstalling the dependency re-evaluates the mounts.

qBittorrent's bridge address comes from its exported host id and internal port, imported from its package. The address and shared API key are watched reactively; changes restart Lidarr and update the managed client. While qBittorrent is absent, its existing client record is left untouched.

## Network Access and Interfaces

One interface serves the browser UI and authenticated API over the same HTTP listener.

| Id | Host id | Type | Internal port | Purpose |
| --- | --- | --- | --- | --- |
| `ui` | `ui-multi` | `ui` | 8686 | Web UI and API |

`uiHostId` and `uiPort` are exported from `startos/utils.ts`. `share/api-key` on the `startos` volume is the read-only sharing surface for future dependents; no dependent should mount the rest of the store. Manual Prowlarr setup uses the UI's API-key setting.

## Installation and First-Run Flow

Install generates the API key, seeds analytics off, and raises critical prompts for an admin password and media storage. Both must be completed before Lidarr starts.

Before the first daemon launch, Forms authentication is enforced without an existing user. This closes upstream's claim-the-instance first-run screen: the UI requires login until `reconcile` creates the admin through the authenticated API. Restore retains the generated credentials and selections.

## Actions

Three actions write package state; changes read by `main` restart the service and apply on the next start if it was stopped.

### Set Admin Password / Reset Admin Password

Run for initial access or credential recovery. It replaces `adminPassword` with a generated password, returned masked and copyable alongside username `admin`. Repeated runs intentionally rotate the credential. Reconciliation verifies the stored login and applies it through the host-config API when necessary; login changes made in Lidarr's UI are reverted on the next start. Applying the change takes seconds plus a restart.

### Media Storage

Run when selecting or changing file-manager storage. It changes `mediaSources` and the read-write mounts; files are never moved or deleted. Repeating the same selection is safe. Removing a source makes its existing root folders unavailable until selected again. A changed selection costs a restart.

### Connect qBittorrent / Disconnect qBittorrent

Run to toggle the local download-client integration. It changes `qbittorrentConnected`; reconciliation creates, updates, or deletes the client named `qBittorrent (StartOS)`. The client is tracked by id, with its case-insensitive unique name recovering an interrupted initial create.

The package owns that client's name, enabled state, host, port, SSL flag, API key, username, and password. Other fields, including its music category, remain user-controlled. Other manually added clients are untouched unless they use the reserved name. Creating the client disabled and then enabling it with `forceSave` avoids testing a dependency that may still be starting. Repeated reconciliation reuses the record rather than duplicating it. Toggling costs a restart.

## Tasks

Two critical prompts block startup while essential setup is incomplete.

| Action | Raised when | Cleared by |
| --- | --- | --- |
| Set Admin Password | `adminPassword` is unset | Generating the password |
| Media Storage | `mediaSources` is empty | Selecting at least one file manager |

Init rechecks these conditions reactively, so clearing the stored values can raise the prompts again.

## Health Checks

The `primary` daemon's Web Interface check requests `/ping` on local port 8686 using the SDK's default grace period. It establishes web-listener availability, not metadata-provider or download-client availability.

A prolonged failure means startup, a database migration, or a crash needs investigation in the service log. The `reconcile` oneshot has no separate health check; API errors appear in the log as reconciliation failures. A ready listener alone does not establish successful reconciliation.

## Backups and Restore

StartOS stops Lidarr and copies both own volumes. The SQLite database is quiescent; no separate database daemon or dump is needed.

Excluded paths are `MediaCover/` (downloadable artwork), `logs/`, `logs.db*`, and `Backups/` (redundant application database backups). All remaining app data, package settings, credentials, and the API key are captured. Restore reuses them and reconciles the download client's live address and key at the next start.

Mounted dependency volumes are outside this backup. Their data must be restored separately; otherwise the restored database references unavailable music.

## Limitations and Differences

The package deliberately owns access control and networking while leaving music-management choices in Lidarr.

1. The admin username, password, authentication method, listener settings, allowed hosts, proxy trust, and API key are package-managed; conflicting UI edits are reverted on restart.
2. There is no package-local music library or access to qBittorrent-local downloads. Media must be on selected file-manager volumes.
3. Prowlarr integration is manual; its Connect Apps action does not include Lidarr.
4. No downloader, player, or private metadata server is bundled. Metadata availability remains an external requirement.
5. Upstream handles database upgrades on startup; downgrades are not declared safe. Restore an older backup instead.
6. No riscv64 image is available.

---

## Quick Reference for AI Consumers

This summary lists the package's operating surface without duplicating version pins.

```yaml
package_id: lidarr
image: linuxserver/lidarr
architectures: [x86_64, aarch64]
subcontainers: [lidarr-sub]
volumes:
  main: /config
  startos: store.json and share/api-key (not mounted)
file_models:
  - startos/store.json
  - main/config.xml
  - startos/share/api-key
startos_managed_env_vars: [PUID, PGID, TZ]
dependencies: [filebrowser, nextexplorer, qbittorrent]
interfaces:
  ui: {host_id: ui-multi, type: ui, port: 8686, protocol: http}
actions: [set-admin-password, media-storage, connect-qbittorrent]
tasks:
  - {action: set-admin-password, severity: critical}
  - {action: media-storage, severity: critical}
health_checks: [primary]
oneshots: [reconcile]
```
