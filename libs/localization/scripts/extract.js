const { readFileSync } = require('fs')
const glob = require('glob')
const { execFileSync } = require('child_process')
const contentful = require('contentful-management')

const client = contentful.createClient({
  accessToken: 'CFPAT-BihGg69ZoLSobW76wolYFAFZ8sebTUcdDib1IMAlhn8',
})

// formatjs cli doesn't currently support globbing, so we perform it ourselves
// as a workaround. see https://github.com/formatjs/formatjs/issues/383
const sourceFiles = glob.sync(process.argv[2])

execFileSync('npx', [
  'formatjs',
  'extract',
  '--out-file',
  'libs/localization/lang/messages/messages.json',
  '--format',
  'libs/localization/scripts/formatter.js',
  ...sourceFiles,
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
          strings: locales.reduce((arr, curr) => {
            return {
              ...arr,
              [curr.code]: {},
            }
          }, {}),
        },
      }),
    )
    .catch((err) => console.log(err))
}

function updateNamespace(namespace, messages) {
  namespace.fields.defaults['en'] = messages

  console.log('fields strings', namespace.fields.strings)

  namespace.fields.strings = Object.keys(namespace.fields.strings).reduce(
    (arr, curr) => {
      return {
        ...arr,
        [curr]: Object.keys(messages).reduce(
          (arr, id) => {
            if (arr.hasOwnProperty(id)) {
              return arr
            }
            return {
              ...arr,
              [id]: '',
            }
          },
          { ...namespace.fields.strings[curr] },
        ),
      }
    },
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
