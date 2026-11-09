import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.1.6.5079:0',
  releaseNotes: {
    en_US:
      'Initial StartOS release of Lidarr with managed admin credentials, shared music storage in FileBrowser Quantum or NextExplorer, and an optional qBittorrent connection. Full upstream notes: https://github.com/Lidarr/Lidarr/releases/tag/v3.1.6.5079',
    es_ES:
      'Primera versión de Lidarr para StartOS con credenciales de administrador gestionadas, almacenamiento musical compartido en FileBrowser Quantum o NextExplorer y conexión opcional a qBittorrent. Notas completas: https://github.com/Lidarr/Lidarr/releases/tag/v3.1.6.5079',
    de_DE:
      'Erste StartOS-Veröffentlichung von Lidarr mit verwalteten Administrator-Zugangsdaten, gemeinsamem Musikspeicher in FileBrowser Quantum oder NextExplorer und optionaler qBittorrent-Verbindung. Vollständige Hinweise: https://github.com/Lidarr/Lidarr/releases/tag/v3.1.6.5079',
    pl_PL:
      'Pierwsze wydanie Lidarr dla StartOS z zarządzanymi danymi administratora, współdzielonym magazynem muzyki w FileBrowser Quantum lub NextExplorer i opcjonalnym połączeniem z qBittorrent. Pełne informacje: https://github.com/Lidarr/Lidarr/releases/tag/v3.1.6.5079',
    fr_FR:
      'Première version de Lidarr pour StartOS avec identifiants administrateur gérés, stockage musical partagé dans FileBrowser Quantum ou NextExplorer et connexion facultative à qBittorrent. Notes complètes : https://github.com/Lidarr/Lidarr/releases/tag/v3.1.6.5079',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
