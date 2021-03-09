# Localization

This library provides components to support Internationalization in nextjs and react projects using [Formatjs](https://formatjs.io/).

{% hint style="warning" %}
You will need a `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` environnement variable to run the extract script. You can create it [here in contentful](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types).
{% endhint %}

## Usage in Next.js

### Wrap your App with the `appWithLocale` HOC

```typescript
import { appWithLocale } from '@island.is/localization'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default appWithLocale(MyApp)
```

### Fetch namespaces by wrapping your Pages with the `withLocale` HOC

```typescript
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

### Wrap your Application with the `<LocaleProvider>`

```typescript
import { defaultLanguage, LocaleProvider } from '@island.is/localization'

const App = () => {
  return (
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      // your app
    </LocaleProvider>
  )
}
```

### Fetch namespaces by wrapping your component with the `withLocale` HOC or use the `useNamespaces` hook

```typescript
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

## Message Declaration

To declare a message you have to provide an `id` and a `defaultMessage`, `description` is optional but recommended.
You can declare a message by:

- Using `formatMessage` method from the `useLocale` hook

```typescript
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

```typescript
import { FormattedMessage } from 'react-intl'

return (
  <FormattedMessage
    id="global:welcome"
    defaultMessage="Hello {name}"
    description="A welcome message"
    values={{
      name: userName,
    }}
  />
)
```

- Pre-declaring using `defineMessage` or `defineMessages` for later consumption

```typescript
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

## Markdown support

We are supporting both TextField and Markdown for the translations. If you want to define markdown messages, you will need to add a `#markdown` to the end of the string's id. That will show the Markdown editor within Contentful.

{% hint style="warning" %}
We only allow headings from H2 to H4. The rest will be converted as paragraph in Contentful.
{% endhint %}

{% hint style="warning" %}
There is only one way to do line breaks for the markdown messages. It has to be an escape line break character defined two times `\\n\\n`. This only required when doing `defineMessage` -> Contentful. After running the `extract-strings` script and publishing the changes on Contentful, you will get normal line breaks `\n` back from the GraphQL API and will be able to pass it down to `markdown-to-jsx`.
{% endhint %}

```typescript
const message = defineMessage({
  id: 'global:title#markdown',
  defaultMessage: 'Some copy with **markdown** in it.',
  description:
    '## Heading followed by a new line.\\n\\nIt will be rendered as _markdown_ in the Contentful UI extension as well',
})
```

## Message Extraction

Add the `extract-strings` script to `workspace.json`. Running this script will extract messages from the project and create or update a Namespace entry in Contentful, if the namespace did not exist it will need to be published in Contentful before the client can query the entry.

```json
{
  "your-project": {
    "architect": {
      "lint": {...},
      "test": {...},
      "extract-strings": {
        "builder": "@nrwl/workspace:run-commands",
        "options": {
          "command": "yarn ts-node -P libs/localization/tsconfig.lib.json libs/localization/scripts/extract '{pathToComponents}/*.{js,ts,tsx}'"
        }
      }
    }
  }
}
```
