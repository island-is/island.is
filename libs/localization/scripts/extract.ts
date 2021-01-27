import { readFileSync } from 'fs'
import glob from 'glob'
import spawn from 'cross-spawn'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { MessageDict } from '@island.is/shared/types'
import { logger } from '@island.is/logging'

import {
  DEFAULT_LOCALE,
  translationsFromContentful,
} from './translationsFromContentful'
import { translationsFromLocal } from './translationsFromLocal'
import { mergeArray } from './mergeArray'

const { CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, CONTENTFUL_SPACE } = process.env

if (!CONTENTFUL_SPACE || !CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) {
  throw new Error(
    'Missing Contentful environment variables: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN and/or CONTENTFUL_SPACE',
  )
}

const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN })

try {
  spawn.sync('npx', [
    'formatjs',
    'extract',
    '--out-file',
    'libs/localization/messages.json',
    '--format',
    'libs/localization/scripts/formatter.js',
    process.argv[2],
  ])
} catch (e) {
  console.error(`Error while trying to extract strings ${e}`)
  process.exit(1)
}

const getLocales = () =>
  client
    .getSpace(CONTENTFUL_SPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getLocales())
    .catch((err) => {
      logger.error('Error getting locales', { message: err.message })
    })

const getNamespace = (id: string) =>
  client
    .getSpace(CONTENTFUL_SPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getEntry(id))
    .catch(() => null)

const createNamespace = (id: string, messages: MessageDict) =>
  client
    .getSpace(CONTENTFUL_SPACE)
    .then((space) => space.getEnvironment('master'))
    .then(async (environment) => {
      const entry = await environment.createEntryWithId(
        'namespaceJeremyDev',
        id,
        {
          // TODO: put namespace back after review
          fields: {
            namespace: {
              [DEFAULT_LOCALE]: id,
            },
            strings: {
              [DEFAULT_LOCALE]: translationsFromLocal(messages),
            },
          },
        },
      )

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
) => {
  const locales = ((await getLocales()) as {
    items: Record<string, any>[]
  }).items.map((locale) => ({ id: locale.code }))
  const fromLocal = translationsFromLocal(messages)
  const fromContentful = translationsFromContentful(namespace)
  const merged = mergeArray(fromLocal, fromContentful, locales)

  namespace.fields.strings[DEFAULT_LOCALE] = merged

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

glob
  // .sync('libs/localization/messages.json')
  .sync('libs/localization/temp-dev.json') // TODO: put messages.json back after review
  .map((filename) => readFileSync(filename, { encoding: 'utf-8' }))
  .map((file) => JSON.parse(file))
  .forEach((f) => {
    Object.entries<MessageDict>(f).forEach(
      async ([namespaceId, namespaceMessages]) => {
        const namespace = await getNamespace(namespaceId)

        // If namespace does exist we update it, else we create it
        if (namespace) {
          updateNamespace(namespace, namespaceMessages)
        } else {
          logger.warn(
            `${namespaceId} doesn't exist, we are going to create it for you now`,
          )
          createNamespace(namespaceId, namespaceMessages)
        }
      },
    )
  })
