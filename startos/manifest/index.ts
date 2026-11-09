import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'lidarr',
  title: 'Lidarr',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/lidarr-startos',
  upstreamRepo: 'https://github.com/Lidarr/Lidarr',
  marketingUrl: 'https://lidarr.audio/',
  donationUrl: 'https://opencollective.com/lidarr',
  description: { short, long },
  volumes: ['startos', 'main'],
  images: {
    lidarr: {
      source: { dockerTag: 'linuxserver/lidarr:3.1.6.5079-ls47' },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
