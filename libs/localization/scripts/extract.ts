import { readFileSync } from 'fs'
import glob from 'glob'
import spawn from 'cross-spawn'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { DictArray } from '@island.is/shared/types'
import { logger } from '@island.is/logging'

type MessageDict = Record<string, Message>

export interface Message {
  defaultMessage: string
  description: string
}

const DEFAULT_LOCALE = 'is-IS'
const { CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, CONTENTFUL_SPACE } = process.env

if (!CONTENTFUL_SPACE || !CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) {
  throw new Error(
    'Missing Contentful environment variables: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN and/or CONTENTFUL_SPACE',
  )
}

const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN })

spawn.sync('npx', [
  'formatjs',
  'extract',
  '--out-file',
  'libs/localization/messages.json',
  '--format',
  'libs/localization/scripts/formatter.js',
  process.argv[2],
])

const getLocales = () =>
  client
    .getSpace(CONTENTFUL_SPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getLocales())
    .catch((err) => {
      logger.error('Error when running getLocales', { message: err.message })
    })

const getNamespace = (id: string) =>
  client
    .getSpace(CONTENTFUL_SPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getEntry(id))
    .catch((err) => {
      logger.error('Error when running getNamespace', { message: err.message })
    })

const createNamespace = (id: string, messages: MessageDict) =>
  client
    .getSpace(CONTENTFUL_SPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) =>
      environment.createEntryWithId('namespaceJeremyDev', id, {
        // TODO: put namespace back after review
        fields: {
          namespace: {
            [DEFAULT_LOCALE]: id,
          },
          strings: {
            [DEFAULT_LOCALE]: translationsFromLocal(messages),
          },
        },
      }),
    )
    .catch((err) => {
      logger.error('Error when running createNamespace', {
        message: err.message,
      })
    })

// Local array doesn't contain all the locales translation. We just set the is-IS
// translation using the defaultMessage, the rest has to be done through contentful
export const mergeArray = async (
  local: Partial<DictArray>[],
  contentful: DictArray[],
) => {
  const locales = await getLocales()
  const localesArr = (locales as {
    items: Record<string, any>[]
  }).items.map((locale) => ({ id: locale.code }))

  return [
    ...local.map((localObj) => {
      const contentfulValue = contentful.find(
        (contentfulObj) => contentfulObj.id === localObj.id,
      )

      return {
        id: localObj.id,
        defaultMessage: localObj.defaultMessage,
        description: localObj.description,
        ...localesArr.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.id]:
              (contentfulValue as Record<string, any>)?.[cur.id] ??
              (localObj as Record<string, string>)?.[cur.id] ??
              '',
            deprecated: false,
          }),
          {},
        ),
      }
    }),
    ...contentful
      .filter(
        (contentfulObj) =>
          !local.some((localObj) => localObj.id === contentfulObj.id),
      )
      .map((contentfulObj) => ({
        ...contentfulObj,
        deprecated: true,
      })),
  ]
}

export const translationsFromLocal = (messages: MessageDict) =>
  Object.keys(messages).map((item) => ({
    id: item,
    defaultMessage: messages[item].defaultMessage,
    description: messages[item].description,
    [DEFAULT_LOCALE]: messages[item].defaultMessage,
  }))

export const translationsFromContentful = (namespace: Entry) =>
  namespace?.fields?.strings?.[DEFAULT_LOCALE] ?? []

export const updateNamespace = async (
  namespace: Entry,
  messages: MessageDict,
) => {
  const fromLocal = translationsFromLocal(messages)
  const fromContentful = translationsFromContentful(namespace)
  const merged = await mergeArray(fromLocal, fromContentful)

  namespace.fields.strings[DEFAULT_LOCALE] = merged

  return namespace
    .update()
    .then((namespace) =>
      logger.info('Namespace updated', {
        message: JSON.stringify(namespace, null, 2),
      }),
    )
    .catch((err) => {
      logger.error('Error when running updateNamespace', {
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
          createNamespace(namespaceId, namespaceMessages)
        }
      },
    )
  })
