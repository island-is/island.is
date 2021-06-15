# Feature Flags

## About

This library is a wrapper for whatever feature flag service Island.is is using

## How (not) to use

Feature flagging is a way to soft launch a "beta ready" feature to a specific
group of users.

Feature flagging is not a way to hide a feature from the users that is still a
work in progress.

## Usage

### Application entrypoint

```typescript
import { FeatureFlagProvider } from '@island.is/feature-flags'
```

then wrap your application using

```typescript jsx
return (
  <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
    <App />
  </FeatureFlagProvider>
)
```

If the FeatureFlagProvider is nested inside [Authenticator](../auth/react/README.md#authenticate), it will derive a default user object from that authentication.

Alternatively, you can pass in a `defaultUser` property to `FeatureFlagProvider`.

### Feature flag consumer

```typescript
    import { useFeatureFlagClient } from '@island.is/feature-flags'

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

```typescript jsx
import { useFeatureFlag } from '@island.is/feature-flags'

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
