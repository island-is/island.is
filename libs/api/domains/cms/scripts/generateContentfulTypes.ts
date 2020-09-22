import { logger } from '@island.is/logging'
import { codegen } from '@jeremybarbet/contentful-typescript-codegen'
import { createClient } from 'contentful-management'

const { CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env

async function main() {
  if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) {
    logger.error('Missing content management access token')
    process.exit()
  }

  const client = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  })

  try {
    const space = await client.getSpace('8k0h54kbe6bj')
    const environment = await space.getEnvironment('master')

    codegen({
      outputFile: 'libs/api/domains/cms/src/lib/generated/contentfulTypes.d.ts',
      environment,
    })
  } catch (e) {
    logger.error('Cannot generate contentful types', { message: e.message })
  }
}

main()
