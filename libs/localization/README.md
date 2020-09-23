# Localization

This library provides components to support Internationalization in nextjs and react projects using [Formatjs](https://formatjs.io/).

## Usage in Next.js

### **Wrap your App with the `appWithLocale` HOC**

```js
import { appWithLocale } from '@island.is/localization'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default appWithLocale(MyApp)
```

### **Fetch namespaces by wrapping your Pages with the `withLocale` HOC**

```js
import { withLocale } from '@island.is/localization'

const Home = () => {
  const { formatMessage } = useLocale()
  return (
    <p>
      {formatMessage({
        id: 'global:title', // namespace:messageId
        defaultMessage: 'Default title',
        description: 'This is a default title in the global namespace',
      })}
    </p>
  )
}

export default withLocale(['global', 'yourNamespace'])(Home)
```

## Usage in a React application

### **Wrap your Application with the `<LocaleProvider>`**

```js
import { defaultLanguage, LocaleProvider } from '@island.is/localization'

const App = () => {
  return (
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      // your app
    </LocaleProvider>
  )
}
```

### **Fetch namespaces by wrapping your component with the `withLocale` HOC or use the `useNamespaces` hook**

```js
const Home = () => {
  const { loadingMessages } = useNamespaces(['gloable', 'yourNamespace'])
  const { formatMessage } = useLocale()

  if (loadingMessages) return <p>Loading..</p>

  return (
    <p>
      {formatMessage({
        id: 'global:title',
        defaultMessage: 'Default title',
        description: 'This is a default title in the global namespace',
      })}
    </p>
  )
}

export default Home
```

## **Message Declaration**

To declare a message you have to provide an `id` and a `defaultMessage`, `description` is optional but recommended.
You can declare a message by:

- Using `formatMessage` method from the `useLocale` hook

```js
const { formatMessage } = useLocale();

return (
    <div>
      {formatMessage({
        id: 'global:welcome',
        defaultMessage: 'Hello {name}',
        description: 'A welcome message',
        values={{
            name: userName,
        }}
      })}
    </div>
  )
```

- Using React API `<FormattedMessage />`

```js
import { FormattedMessage } from 'react-intl'
;<FormattedMessage
  id="global:welcome"
  defaultMessage="Hello {name}"
  description="A welcome message"
  values={{
    name: userName,
  }}
/>
```

- Pre-declaring using `defineMessage` or `defineMessages` for later consumption

```js
const message = defineMessage({
  id: 'global:title',
  defaultMessage: 'Default title',
  description: 'This is a default title in the global namespace',
})

const messages = defineMessages([
  {
    id: 'global:title',
    defaultMessage: 'Default title',
    description: 'This is a default title in the global namespace',
  },
  {
    id: 'global:description',
    defaultMessage: 'Default description',
    description: 'This is a default description in the global namespace',
  },
])

const { formatMessage } = useLocale()

return <div>{formatMessage(message)}</div>
```

## **Message Extraction**

Add the `extract-strings` script to `workspace.json`. Running this script will extract messages from the project and create or update a Namespace entry in Contentful, if the namespace did not exist it will need to be published in Contentful before the client can query the entry.

```js
{
    "your-project": {
        "architect": {
            "lint": {...}
            "test": {...}
            "extract-strings": {
                "builder": "@nrwl/workspace:run-commands",
                "options": {
                    "parallel": false,
                    "commands": [
                    {
                        "command": "yarn ts-node libs/localization/scripts/extract '{pathToComponents}/*.{js,ts,tsx}'"
                    }
                    ]
                }
            }
        }
    }
}
```
