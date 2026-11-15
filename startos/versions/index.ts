import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_3_1_6_5079_1 } from './v3.1.6.5079_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_3_1_6_5079_1],
})
