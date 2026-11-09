# Updating Lidarr

## Check upstream

This package wraps the unmodified LinuxServer Lidarr image. Watch stable releases at <https://github.com/Lidarr/Lidarr/releases/latest> and corresponding LinuxServer builds at <https://github.com/linuxserver/docker-lidarr/releases>. Do not follow `develop`, `nightly`, or `latest` moving tags.

Confirm the exact release-build tag exists and includes both `linux/amd64` and `linux/arm64`:

```bash
docker manifest inspect lscr.io/linuxserver/lidarr:<release-build-tag>
```

Read upstream's release notes for database migrations, upgrade restrictions, and authentication changes. Lidarr's application release number does not change its `/api/v1` prefix.

## Update the pins

1. Change `images.lidarr.source.dockerTag` in `startos/manifest/index.ts` to the verified LinuxServer release-build tag.
2. Edit `startos/versions/current.ts` in place. Preserve all four upstream components in `<upstream>:0`. For an image-only rebuild or package-only change, keep the upstream part and increment the downstream revision instead. Check the configured reference registry before claiming a revision.
3. Summarize user-visible changes in every release-note locale and link to the upstream or LinuxServer release notes.
4. If the outgoing current version contains a nonempty migration, retain it in its own version file and register it in `startos/versions/index.ts`; never carry its migration into the new current version.

## Verify the update

Update dependencies with `npm install`, then run `npx tsc --noEmit`. Confirm the API still accepts host-config credential updates and the qBittorrent schema still supports API-key authentication. Keep the shared media mount points unchanged. CI builds both supported architectures.

Do not use Lidarr's in-app updater. Git tags use `v<upstream>_<downstream>`.
