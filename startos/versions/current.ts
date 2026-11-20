import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.1.6.5079:3',
  releaseNotes: {
    en_US:
      'Added Connect Prowlarr: Lidarr now connects itself to Prowlarr on this server, which syncs its indexers to Lidarr. If Prowlarr already syncs to Lidarr, the connection is kept automatically.',
    es_ES:
      'Se añadió Conectar Prowlarr: Lidarr ahora se conecta por sí mismo a Prowlarr en este servidor, que sincroniza sus indexadores con Lidarr. Si Prowlarr ya sincroniza con Lidarr, la conexión se mantiene automáticamente.',
    de_DE:
      'Prowlarr verbinden hinzugefügt: Lidarr verbindet sich jetzt selbst mit Prowlarr auf diesem Server, das seine Indexer mit Lidarr synchronisiert. Synchronisiert Prowlarr bereits mit Lidarr, bleibt die Verbindung automatisch bestehen.',
    pl_PL:
      'Dodano Połącz Prowlarr: Lidarr sam łączy się teraz z Prowlarr na tym serwerze, który synchronizuje do niego swoje indeksatory. Jeśli Prowlarr już synchronizuje się z Lidarr, połączenie zostaje zachowane automatycznie.',
    fr_FR:
      'Ajout de Connecter Prowlarr : Lidarr se connecte désormais lui-même à Prowlarr sur ce serveur, qui synchronise ses indexeurs avec Lidarr. Si Prowlarr synchronise déjà Lidarr, la connexion est conservée automatiquement.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
