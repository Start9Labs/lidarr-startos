import { rm } from 'fs/promises'
import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_3_1_6_5079_1 = VersionInfo.of({
  version: '3.1.6.5079:1',
  releaseNotes: {
    en_US:
      'Connecting qBittorrent now requires qBittorrent 5.3.0:5 or later. If you use Prowlarr, update it to 2.7.0.5723:4 or later as well.',
    es_ES:
      'Conectar qBittorrent ahora requiere qBittorrent 5.3.0:5 o posterior. Si usas Prowlarr, actualízalo también a 2.7.0.5723:4 o posterior.',
    de_DE:
      'Die Verbindung mit qBittorrent erfordert jetzt qBittorrent 5.3.0:5 oder neuer. Bei Verwendung von Prowlarr dieses ebenfalls auf 2.7.0.5723:4 oder neuer aktualisieren.',
    pl_PL:
      'Połączenie z qBittorrent wymaga teraz qBittorrent 5.3.0:5 lub nowszego. Jeśli używasz Prowlarr, zaktualizuj go również do 2.7.0.5723:4 lub nowszego.',
    fr_FR:
      'La connexion à qBittorrent nécessite désormais qBittorrent 5.3.0:5 ou une version ultérieure. Si vous utilisez Prowlarr, mettez-le également à jour vers 2.7.0.5723:4 ou une version ultérieure.',
  },
  migrations: {
    up: async () => {
      await rm(sdk.volumes.startos.subpath('share'), {
        recursive: true,
        force: true,
      })
    },
    down: IMPOSSIBLE,
  },
})
