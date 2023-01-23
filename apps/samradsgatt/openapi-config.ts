import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: './openapi.json',
  apiFile: './lib/baseApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './lib/samradsgattApi-generated.ts',
  exportName: 'samradsgattApi',
  hooks: true,
}

export default config
