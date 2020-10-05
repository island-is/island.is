import 'isomorphic-fetch'

import { writeFileSync } from 'fs'
import { format, resolveConfig } from 'prettier'
import { logger } from '@island.is/logging'

const targetFileName =
  'libs/api/domains/cms/src/lib/generated/contentfulTypes.d.ts'
const apiUrl = 'https://contentful-type-generator.shared.devland.is/'

export async function codegenContentful() {
  try {
    const prettierOptions = await resolveConfig(targetFileName)
    if (!prettierOptions) {
      console.error(`Could not find prettier options for ${targetFileName}`)
      process.exit(1)
    }
    const res = await fetch(apiUrl)

    writeFileSync(
      targetFileName,
      format(await res.text(), { ...prettierOptions, parser: 'typescript' }),
    )
  } catch (e) {
    logger.error('Cannot fetch and write contentful types', {
      message: e.message,
    })
  }
}
