# Lidarr

## Documentation

- [Lidarr Quick Start Guide](https://github.com/Servarr/Wiki/blob/master/lidarr/quick-start-guide.md) — first setup and adding artists
- [Lidarr Settings](https://github.com/Servarr/Wiki/blob/master/lidarr/settings.md) — configuring quality, imports, indexers, and download clients
- [Importing an Existing Library](https://github.com/Servarr/Wiki/blob/master/lidarr/importing-existing-library.md) — bringing your own music into Lidarr
- [Lidarr Troubleshooting](https://github.com/Servarr/Wiki/blob/master/lidarr/troubleshooting.md) — diagnosing search and import problems

## What you get on StartOS

You get an authenticated Web UI, a generated admin login, shared music storage in FileBrowser Quantum or NextExplorer, and optional connections to qBittorrent and NZBGet on this server. You can play the resulting music through a separate music or media server that reads the same folder.

## Getting set up

1. Install FileBrowser Quantum or NextExplorer if you have neither.
2. Run **Set Admin Password** and save the credentials it shows.
3. Run **Media Storage** and select your file manager, or both.
4. In qBittorrent or NZBGet, run **Set Download Location** and select the same file manager. Then run Lidarr's **Connect qBittorrent**, **Connect NZBGet**, or both. Configure your news server in NZBGet when using Usenet.
5. Start Lidarr, open its **Web UI**, and sign in.
6. Create a music folder in your file manager, separate from your download folder. In Lidarr, open **Settings → Media Management → Root Folders** and add it:
   - FileBrowser Quantum: `/mnt/filebrowser/music`
   - NextExplorer: `/mnt/nextexplorer/<location>/music`, where `<location>` is a location such as `Files`.
7. Add indexers in Lidarr's **Settings → Indexers**. If you use Prowlarr on this server, select Lidarr in Prowlarr's **Connect Apps** action. Indexers configured in Prowlarr then sync to Lidarr without copying API keys.
8. Choose your quality and metadata profiles, then add an artist with **Library → Add New**. Follow the upstream quick-start guide for monitoring and searching.

Keep downloads and the music library in different directories on the same selected file manager for hardlinks and fast moves. Lidarr cannot import downloads saved only inside qBittorrent's local storage.

For existing music, follow **Importing an Existing Library** before adding its root folder; scanning, renaming, and tag-writing settings can change your files.

## Using Lidarr

- **Reset Admin Password** generates a replacement password and restarts Lidarr. Use this action rather than changing the login in Lidarr's settings.
- **Media Storage** changes the file managers Lidarr can access and restarts it. Existing files stay where they are; removing a file manager makes its folders unavailable to Lidarr.
- **Connect qBittorrent** / **Disconnect qBittorrent** adds or removes the `qBittorrent (StartOS)` download client. Its address and API key follow qBittorrent automatically; you do not need to reconnect after changing qBittorrent's password.
- **Connect NZBGet** / **Disconnect NZBGet** manages only `NZBGet (StartOS)` and restarts Lidarr. It uses category `lidarr` initially; keep that category in NZBGet, or change it consistently in both applications. The restricted connection credentials follow NZBGet automatically and remain valid when its admin password is reset. Existing qBittorrent and manually named clients remain untouched.
- You can configure another download client manually in Lidarr. Its completed files must be accessible through one of your selected file managers.

Back up your selected file manager as well as Lidarr: Lidarr's backup covers its settings and library database, not your music files.

## Important limitations

Artist and album lookups require Lidarr's hosted metadata service. If searches or imports cannot retrieve metadata, check upstream's metadata-service status before changing your package settings. This package does not include a private metadata server.

If you publish the Web UI through a tunnel to keep your home IP private, send Lidarr's outbound traffic through that tunnel too; metadata providers and indexers otherwise see your normal outbound address. A tunnel used only to reach an otherwise inaccessible port needs no such change.
