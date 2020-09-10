import { codegen } from '@jeremybarbet/contentful-typescript-codegen'
import { createClient } from 'contentful-management'

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
})

async function main() {
  try {
    const space = await client.getSpace('8k0h54kbe6bj')
    const environment = await space.getEnvironment('master')

    codegen({
      outputFile: 'libs/api/domains/cms/src/lib/generated/contentfulTypes.d.ts',
      environment,
    })
  } catch (e) {
    console.error(`Cannot generate contentful types ${e.message}`)
  }
}

main()
