import { readFileSync } from 'fs'
import { globSync } from 'glob'
import spawn from 'cross-spawn'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { logger } from '@island.is/logging'

import {
  createStringsObject,
  updateDefaultsObject,
  DEFAULT_LOCALE,
  Locales,
  updateStringsObject,
  MessageDict,
  createDefaultsObject,
} from './utils'

const {
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CONTENTFUL_SPACE,
  CONTENTFUL_ENVIRONMENT,
} = process.env
const spaceId = CONTENTFUL_SPACE ?? '8k0h54kbe6bj'
const environmentId = CONTENTFUL_ENVIRONMENT ?? 'master'

if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) {
  logger.error('Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN')
  process.exit()
}

const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN })

const format = spawn.sync('npx', [
  'formatjs',
  'extract',
  '--out-file',
  'libs/localization/messages.json',
  '--format',
  'libs/localization/scripts/formatter.js',
  process.argv[2],
])

if (format.stderr.toString() !== '') {
  logger.error(format.stderr.toString())
  logger.error('Did not extract or upload messages!')
  process.exit()
}

const getLocales = () =>
  client
    .getSpace(spaceId)
    .then((space) => space.getEnvironment(environmentId))
    .then((environment) => environment.getLocales())
    .catch((err) => {
      logger.error('Error getting locales', { message: err.message })
    })

const getNamespace = (id: string) =>
  client
    .getSpace(spaceId)
    .then((space) => space.getEnvironment(environmentId))
    .then((environment) => environment.getEntry(id))
    .catch(() => null)

const createNamespace = (id: string, messages: MessageDict, locales: Locales) =>
  client
    .getSpace(spaceId)
    .then((space) => space.getEnvironment(environmentId))
    .then(async (environment) => {
      const namespace = { [DEFAULT_LOCALE]: id }
      const defaults = { [DEFAULT_LOCALE]: createDefaultsObject(messages) }
      const strings = createStringsObject(locales, messages)

      const entry = await environment.createEntryWithId('namespace', id, {
        fields: {
          namespace,
          defaults,
          strings,
        },
      })

      logger.info(`New namespace created`, { message: entry.sys.id })
    })
    .catch((err) => {
      logger.error('Error creating new namespace', {
        message: err.message,
      })
    })

export const updateNamespace = async (
  namespace: Entry,
  messages: MessageDict,
  locales: Locales,
) => {
  namespace.fields.defaults[DEFAULT_LOCALE] = updateDefaultsObject(
    namespace,
    messages,
  )

  namespace.fields.strings = updateStringsObject(namespace, messages, locales)

  return namespace
    .update()
    .then((namespace) =>
      logger.info('Namespace updated', {
        message: namespace.sys.id,
      }),
    )
    .catch((err) => {
      logger.error('Error updating namespace', {
        message: err.message,
      })
    })
}

globSync('libs/localization/messages.json')
  .map((filename) => readFileSync(filename, { encoding: 'utf-8' }))
  .map((file) => JSON.parse(file))
  .forEach((f) => {
    Object.entries<MessageDict>(f).forEach(
      async ([namespaceId, namespaceMessages]) => {
        const namespace = await getNamespace(namespaceId)
        const locales = (
          (await getLocales()) as {
            items: Record<string, any>[]
          }
        ).items.map((locale) => ({ id: locale.code }))

        // If namespace does exist we update it, else we create it
        if (namespace) {
          updateNamespace(namespace, namespaceMessages, locales)
        } else {
          logger.info(
            `${namespaceId} doesn't exist, we are going to create it for you now. You will need to publish the changes in Contentful to get the data from the GraphQL API.`,
          )

          createNamespace(namespaceId, namespaceMessages, locales)
        }
      },
    )
  })
