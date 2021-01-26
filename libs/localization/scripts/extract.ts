import { readFileSync } from 'fs'
import glob from 'glob'
import spawn from 'cross-spawn'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import isEmpty from 'lodash/isEmpty'

type MessageDict = Record<string, Message>

interface DictArray {
  id: string
  defaultMessage: string
  'is-IS': string
  en: string
}

export interface Message {
  defaultMessage: string
  description: string
}

const accessToken = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
const contentfulSpace = process.env.CONTENTFUL_SPACE

if (!contentfulSpace || !accessToken) {
  throw new Error(
    'Missing Contentful environment variables: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN or CONTENTFUL_SPACE',
  )
}

const client = createClient({ accessToken })

spawn.sync('npx', [
  'formatjs',
  'extract',
  '--out-file',
  'libs/localization/messages.json',
  '--format',
  'libs/localization/scripts/formatter.js',
  process.argv[2],
])

const getNamespace = (id: string, space: string) =>
  client
    .getSpace(space)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getEntry(id))
    .catch(() => null)

const createNamespace = (id: string, messages: MessageDict, space: string) =>
  client
    .getSpace(space)
    .then((space) => space.getEnvironment('master'))
    .then((environment) =>
      environment.createEntryWithId('namespaceJeremyDev', id, {
        // TODO: put namespace back after review
        fields: {
          namespace: {
            'is-IS': id,
          },
          strings: {
            'is-IS': translationsFromLocal(messages),
          },
        },
      }),
    )
    .catch((err) => console.log(err))

export const mergeArray = (local: DictArray[], distant: DictArray[]) =>
  local.map((localObj) => {
    const contentfulValue = distant.find(
      (contentfulObj) => contentfulObj.id === localObj.id,
    )
    const hasIs = !isEmpty(contentfulValue?.['is-IS'])
    const hasEn = !isEmpty(contentfulValue?.en)

    return {
      ...localObj,
      'is-IS': hasIs ? contentfulValue!['is-IS'] : localObj['is-IS'],
      en: hasEn ? contentfulValue!.en : localObj.en,
    }
  })

export const translationsFromLocal = (messages: MessageDict) =>
  Object.keys(messages).map((item) => ({
    id: item,
    defaultMessage: messages[item].defaultMessage,
    'is-IS': messages[item].defaultMessage,
    en: messages[item].description,
  }))

export const translationsFromContentful = (namespace: Entry) =>
  (namespace?.fields?.strings?.['is-IS'] ?? []).map((item: DictArray) => ({
    id: item.id,
    defaultMessage: item.defaultMessage,
    'is-IS': item['is-IS'],
    en: item.en,
  }))

export const updateNamespace = (namespace: Entry, messages: MessageDict) => {
  const fromLocal = translationsFromLocal(messages)
  const fromContentful = translationsFromContentful(namespace)
  const merged = mergeArray(fromLocal, fromContentful)

  namespace.fields.strings['is-IS'] = merged

  return namespace
    .update()
    .then((namespace) => console.log('Update namespace', namespace))
    .catch((err) => console.log(err))
}

glob
  // .sync('libs/localization/messages.json')
  .sync('libs/localization/temp-dev.json') // TODO: put messages.json back after review
  .map((filename) => readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .forEach((f) => {
    Object.entries<MessageDict>(f).forEach(
      async ([namespaceId, namespaceMessages]) => {
        const namespace = await getNamespace(namespaceId, contentfulSpace)

        // If namespace does exist we update it, else we create it
        if (namespace) {
          updateNamespace(namespace, namespaceMessages)
        } else {
          createNamespace(namespaceId, namespaceMessages, contentfulSpace)
        }
      },
    )
  })
