import { ContentType, FieldValidation } from 'contentful'
import { createClient } from 'contentful-management'
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import flattenDeep from 'lodash/flatMapDeep'
import { logger } from '@island.is/logging'

import { execShellCommand } from './execShellCommand'
import { generateFile } from './generateFile'
import { codegenContentful } from './codegenContentful'

export interface LinkContentType {
  id: string
  contentType: ContentType
}

export interface Args {
  sys: string[]
  overwrite: boolean
}

const { CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env

async function getContentType(
  id: string,
  environment: Environment,
): Promise<ContentType> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await environment.getContentType(id)) as any
  } catch (e) {
    logger.error('Error getContentType', { message: e.message })
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
): Promise<any> {
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
  const sysRaw = process.argv?.[3]
  const sys = sysRaw
    ?.replace(/\s/g, '')
    ?.split(',')
    .filter((v) => v !== 'undefined')
  const overwriteRaw = process.argv?.[4]

  if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) {
    logger.error('Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN')
    process.exit()
  }

  if (id === 'undefined' || !id) {
    logger.error('No id defined for the contentType.')
    process.exit()
  }

  if (
    sysRaw !== 'undefined' &&
    sys.find(
      (value) =>
        value !== 'id' && value !== 'createdAt' && value !== 'updatedAt',
    )
  ) {
    logger.error(
      'You can only use "id", "createdAt" or "updatedAt" as the value of the `sys` argument.',
    )
    process.exit()
  }

  if (
    overwriteRaw !== 'undefined' &&
    overwriteRaw !== 'true' &&
    overwriteRaw !== 'false'
  ) {
    logger.error(
      'You can only use "true" or "false" as value of the `overwrite` argument.',
    )
    process.exit()
  }

  const linkContentTypes: LinkContentType[] = []
  const generatedFiles: string[] = []
  const overwrite = Boolean(overwriteRaw === 'true')
  const args: Args = { sys, overwrite }

  const client = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  })

  // 1. Create contentful management client
  const space = await client.getSpace(
    process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
  )
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT || 'master',
  )

  // 2. We generate new contentful types
  await codegenContentful()

  // 3. Get main contentType
  const contentType = await getContentType(id, environment)

  // 4. We get all linkContentTypes if any
  await getContentTypes(contentType, environment, linkContentTypes)

  // 5. Create model/mapper and linkContentTypes models/mappers
  generateFile(contentType, args, generatedFiles)

  // We only pass the sys argument to the root contentType
  linkContentTypes.map(async (item) =>
    generateFile(item.contentType, { ...args, sys: [] }, generatedFiles),
  )

  // 6. Re-generate the api codegen
  try {
    await execShellCommand(`yarn nx run api-schema:codegen/frontend-client`)
  } catch (e) {
    logger.error(
      `'yarn nx run api-schema:codegen/frontend-client' has an error`,
      {
        message: e.message,
      },
    )
  }

  // 7. Re-generate the web codegen
  try {
    await execShellCommand(`yarn nx run web:codegen/frontend-client`)
  } catch (e) {
    logger.error(`'yarn nx run web:codegen/frontend-client' has an error`, {
      message: e.message,
    })
  }

  // 8. We run prettier on all new files so it looks good
  try {
    await execShellCommand('prettier --write ./libs/cms/src/lib/models/**.ts')
  } catch (e) {
    logger.error('prettier has an error', { message: e.message })
  }

  // We don't want the main contentType to appear in the logs for the linkContentType
  const linkTypes = generatedFiles.filter((type) => type !== contentType.sys.id)

  logger.info(`
    ${
      generatedFiles.length <= 0
        ? `• We couldn't generate any contentTypes. All files already existed and you are using --overwrite=false. Try again using --overwrite=true to re-generate existing models.`
        : ''
    }
    ${
      generatedFiles.find((type) => type === contentType.sys.id)
        ? `• We created/updated the model libs/cms/src/lib/models/${contentType.sys.id}.models.ts for your contentType.`
        : ''
    }
    ${
      linkTypes.length > 0
        ? `• We also had to create/update ${
            linkTypes.length
          } linkContentTypes. Make sure to check ${linkTypes
            .map((type) => `"${type}"`)
            .join(', ')} to see if it's correct.\n`
        : ''
    }`)
}

main()
