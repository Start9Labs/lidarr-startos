export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Lidarr!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The Lidarr web interface and API': 5,

  // actions/setAdminPassword.ts
  'Set Admin Password': 6,
  'Reset Admin Password': 7,
  'Generate a new random password for the Lidarr admin account.': 8,
  'Replaces the current admin password. The old password stops working, and Lidarr restarts.': 9,
  'Login Credentials': 10,
  'Use these credentials to sign in to Lidarr.': 11,
  Username: 12,
  Password: 13,

  // actions/mediaStorage.ts
  'Media Storage': 14,
  '- FileBrowser Quantum: mounted at /mnt/filebrowser\n- NextExplorer: mounted at /mnt/nextexplorer, one folder per location, such as /mnt/nextexplorer/Files': 15,
  'FileBrowser Quantum': 16,
  NextExplorer: 17,
  'Choose which file managers Lidarr stores your music library in and reads finished downloads from. Each one is mounted read-write, and changing the selection restarts Lidarr.': 18,

  // init/tasks.ts
  'Set the admin password before signing in': 19,
  'Choose where Lidarr stores your music library': 20,

  // actions/connectQbittorrent.ts
  'Disconnect qBittorrent': 21,
  'Removes the qBittorrent (StartOS) download client from Lidarr.': 22,
  'Connect qBittorrent': 23,
  'Add qBittorrent on this server as a download client in Lidarr. Changing it restarts Lidarr.': 24,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
