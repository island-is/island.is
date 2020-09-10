const { readFileSync } = require('fs')
const glob = require('glob')
const { execFileSync } = require('child_process')
const contentful = require('contentful-management')

const client = contentful.createClient({
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

function createNamespace(id, messages, locales) {
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
          strings: locales.reduce(
            (arr, curr) => ({
              ...arr,
              [curr.code]: {},
            }),
            {},
          ),
        },
      }),
    )
    .catch((err) => console.log(err))
}

function updateNamespace(namespace, messages) {
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

function getNamespace(id) {
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
    Object.entries(f).forEach(async ([namespaceId, namespaceMessages]) => {
      const namespace = await getNamespace(namespaceId)
      const locales = await getLocales()

      // If namespace does exist we update it, else we create it
      if (namespace) {
        updateNamespace(namespace, namespaceMessages, locales.items)
      } else {
        createNamespace(namespaceId, namespaceMessages, locales.items)
      }
    })
  })
