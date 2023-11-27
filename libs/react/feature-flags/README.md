# React Feature Flagging Library

This is a high-level feature flagging library for our React apps.

{% hint style="warning" %}
Feature flagging is a way to soft launch a "beta ready" feature to a specific
group of users.

Feature flagging is not a way to hide a feature from the users that is still a
work in progress.
{% endhint %}

## Usage

### Application entrypoint

```tsx
import { FeatureFlagProvider } from '@island.is/feature-flags'
```

then wrap your application using

```tsx
return (
  <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
    <App />
  </FeatureFlagProvider>
)
```

If the FeatureFlagProvider is nested inside [Authenticator](../auth/react/README.md#authenticate), it will derive a default user object from that authentication.

Alternatively, you can pass in a `defaultUser` property to `FeatureFlagProvider`.

### Feature flag consumer

```tsx
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

render() {
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

For the common use case of checking on a feature flag, there is `useFeatureFlag` hook:

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

While loading feature flags (`loading === true`), the value is set to the `defaultValue` argument.

The third argument (`user`) of `getValue` is optional and defaults to the `defaultUser` prop in `FeatureFlagProvider` or the authenticated user from `Authenticator`.

## Running unit tests

Run `nx test react-feature-flags` to execute the unit tests via [Jest](https://jestjs.io).
