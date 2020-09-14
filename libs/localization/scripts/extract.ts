import { readFileSync } from 'fs'
import glob from 'glob'
import { execFileSync } from 'child_process'
import { createClient } from 'contentful-management'
import { Collection } from 'contentful-management/dist/typings/common-types'
import {
  Locale,
  LocaleProps,
} from 'contentful-management/dist/typings/entities/locale'
import { Entry } from 'contentful-management/dist/typings/entities/entry'

interface Message {
  defaultMessage: string
  description: string
}

interface MessageDict {
  [key: string]: Message
}
interface NamespaceDict {
  [key: string]: MessageDict
}

const client = createClient({
  accessToken: 'CFPAT-BihGg69ZoLSobW76wolYFAFZ8sebTUcdDib1IMAlhn8',
})

execFileSync('npx', [
  'formatjs',
  'extract',
  '--out-file',
  'libs/localization/lang/messages/messages.json',
  '--format',
  'libs/localization/scripts/formatter.js',
  process.argv[2],
])

function createNamespace(id: string, messages: MessageDict, locales: Locale[]) {
  const emptyObjForEachLocale = locales.reduce(
    (arr, curr) => ({
      ...arr,
      [curr.code]: {},
    }),
    {},
  )
  return client
    .getSpace('2nfa4y6hpvvz')
    .then((space) => space.getEnvironment('master'))
    .then((environment) =>
      environment.createEntryWithId('translationStrings', id, {
        fields: {
          namespace: {
            en: id,
          },
          defaults: {
            en: messages,
          },
          fallback: emptyObjForEachLocale,
          strings: emptyObjForEachLocale,
        },
      }),
    )
    .catch((err) => console.log(err))
}

function updateNamespace(namespace: Entry, messages: MessageDict) {
  namespace.fields.defaults['en'] = Object.assign(
    {},
    namespace.fields.defaults['en'],
    messages,
  )

  const newStrings = Object.keys(messages).reduce(
    (arr, cur) => ({ ...arr, [cur]: '' }),
    {},
  )

  namespace.fields.strings = Object.keys(namespace.fields.strings).reduce(
    (arr, cur) => ({
      ...arr,
      [cur]: Object.assign({}, newStrings, namespace.fields.strings[cur]),
    }),
    {},
  )

  return namespace
    .update()
    .then((namespace) => console.log('update namespace', namespace))
    .catch((err) => console.log(err))
}

function getNamespace(id: string) {
  return client
    .getSpace('2nfa4y6hpvvz')
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getEntry(id))
    .catch((err) => null)
}

function getLocales() {
  return client
    .getSpace('2nfa4y6hpvvz')
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.getLocales())
    .catch((err) => [])
}

glob
  .sync('libs/localization/lang/messages/**/*.json')
  .map((filename) => readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .forEach((f) => {
    Object.entries<MessageDict>(f).forEach(
      async ([namespaceId, namespaceMessages]) => {
        const namespace = await getNamespace(namespaceId)
        const locales = (await getLocales()) as Collection<Locale, LocaleProps>

        // If namespace does exist we update it, else we create it
        if (namespace) {
          updateNamespace(namespace, namespaceMessages)
        } else {
          createNamespace(namespaceId, namespaceMessages, locales.items)
        }
      },
    )
  })
