```markdown
# React Feature Flagging Library

This is a high-level feature flagging library for React applications.

> **Warning**
> Feature flagging is a way to soft-launch a "beta ready" feature to a specific group of users. It is not intended to hide a feature from users while it is still a work in progress.

## Usage

### Application Entry Point

First, import the `FeatureFlagProvider`:

```tsx
import { FeatureFlagProvider } from '@island.is/feature-flags'
```

Wrap your application with the `FeatureFlagProvider` component:

```tsx
return (
  <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
    <App />
  </FeatureFlagProvider>
)
```

If the `FeatureFlagProvider` is nested inside the [Authenticator](../auth/react/README.md#authenticate), it will derive a default user object from the authentication context. Alternatively, you may pass a `defaultUser` property to the `FeatureFlagProvider`.

### Feature Flag Consumer

To consume feature flags, use the `useFeatureFlagClient` hook:

```tsx
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

const MyComponent = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [showAwesome, setShowAwesome] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const featureEnabled = await featureFlagClient.getValue(
        'isAwesomeFeatureEnabled',
        false,
      )

      setShowAwesome(featureEnabled as boolean)
    }

    getData()
  }, [])

  return `You are ${showAwesome ? 'awesome' : 'not really that awesome'}.`
}
```

For common feature flag checks, use the `useFeatureFlag` hook:

```tsx
import { useFeatureFlag } from '@island.is/react/feature-flags'

const MyComponent = () => {
  const { value: showAwesome, loading } = useFeatureFlag(
    'isAwesomeFeatureEnabled',
    false,
  )

  return `You are ${showAwesome ? 'awesome' : 'not really that awesome'}.`
}
```

Note: While feature flags are loading (`loading === true`), the value defaults to the `defaultValue` argument.

The third argument (`user`) of `getValue` is optional and defaults to the `defaultUser` prop in `FeatureFlagProvider` or the authenticated user from `Authenticator`.

## Running Unit Tests

Execute `nx test react-feature-flags` to run the unit tests using [Jest](https://jestjs.io).
```