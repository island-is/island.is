import { ContentType, FieldValidation } from 'contentful'
import { createClient } from 'contentful-management'
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import { codegen } from '@jeremybarbet/contentful-typescript-codegen'
import { flattenDeep } from 'lodash'

import { execShellCommand } from './execShellCommand'
import { generateFile } from './generateFile'

interface LinkContentType {
  id: string
  contentType: ContentType
}

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
})

async function codegenContentful(environment: Environment) {
  try {
    codegen({
      outputFile: 'libs/api/domains/cms/src/lib/generated/contentfulTypes.d.ts',
      environment,
    })
  } catch (e) {
    console.error(`Cannot generate contentful types ${e.message}`)
  }
}

async function getContentType(
  id: string,
  environment: Environment,
): Promise<ContentType> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await environment.getContentType(id)) as any
  } catch (e) {
    console.error(`Error getContentType ${e.message}`)
    process.exit()
  }
}

export const getLinkContentTypes = (contentType: ContentType): string[] =>
  flattenDeep(
    contentType.fields.map((field) =>
      (field?.items?.validations ?? field?.validations ?? [])
        .map((validation) => validation.linkContentType ?? [])
        .filter(Boolean),
    ),
  )

export const getFirstLevelContentType = (
  validations: FieldValidation[],
): string[] =>
  validations.map((v) => v.linkContentType).filter(Boolean)[0] ?? []

async function getContentTypes(
  contentType: ContentType,
  environment: Environment,
  array: LinkContentType[],
) {
  // We don't generate twice the same model if the type has itself as linkContentType
  const linkTypes = getLinkContentTypes(contentType).filter(
    (type) => type !== contentType.sys.id,
  )

  return await Promise.all(
    linkTypes.map(async (type) => {
      // We don't get twice the same contentType
      if (array.some((t) => t.id === type)) {
        return
      }

      const subType = await getContentType(type, environment)

      array.push({ id: type, contentType: subType })

      while (getLinkContentTypes(subType).length > 0) {
        return await getContentTypes(subType, environment, array)
      }

      return subType
    }),
  )
}

async function main() {
  const id = process.argv?.[2]

  if (id === 'undefined' || !id) {
    console.error('No id defined for the contentType.')
    process.exit()
  }

  const linkContentTypes: LinkContentType[] = []

  // 1. Create contentful management client
  const space = await client.getSpace('8k0h54kbe6bj') // prod: 8k0h54kbe6bj, jeremy's dev: 49dl8o4zlggm
  const environment = await space.getEnvironment('master')

  // 2. We generate new contentful types
  await codegenContentful(environment)

  // 3. Get main contentType
  const contentType = await getContentType(id, environment)

  // 4. We get all linkContentTypes if any
  await getContentTypes(contentType, environment, linkContentTypes)

  // 5. Create model/mapper and linkContentTypes models/mappers
  const items = [{ id: contentType.sys.id, contentType }, ...linkContentTypes]
  items.map(async (item) => generateFile(item.contentType))

  // 6. Re-generate the api codegen
  await execShellCommand(`yarn nx run api:codegen`)

  // 7. We run prettier on all new files so it looks good
  await execShellCommand(
    'prettier --write ./libs/api/domains/cms/src/lib/models/**.ts',
  )

  console.log(
    `\n
    • We created the model libs/api/domains/cms/src/lib/models/${
      contentType.sys.id
    }.models.ts for your contentType.

    ${
      linkContentTypes.length > 0
        ? `• We also had to create ${
            linkContentTypes.length
          } linkContentTypes. Make sure to check ${linkContentTypes
            .map((v) => `"${v.id}"`)
            .join(', ')} to see if it's correct.\n`
        : ''
    }`,
  )
}

main()
