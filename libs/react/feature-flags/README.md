```markdown
# React Feature Flagging Library

This is a high-level feature flagging library designed for React applications.

> **Warning**  
> Feature flagging enables the soft-launch of a "beta ready" feature to a specific group of users. It is not intended to hide a feature from users while it is still under development.

## Usage

### Application Entry Point

Begin by importing the `FeatureFlagProvider`:

```tsx
import { FeatureFlagProvider } from '@island.is/feature-flags';
```

Wrap your application with the `FeatureFlagProvider` component:

```tsx
return (
  <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
    <App />
  </FeatureFlagProvider>
);
```

When the `FeatureFlagProvider` is nested within the [Authenticator](../auth/react/README.md#authenticate), it automatically derives a default user object from the authentication context. Alternatively, a `defaultUser` property can be passed to the `FeatureFlagProvider`.

### Feature Flag Consumer

To use feature flags, utilize the `useFeatureFlagClient` hook:

```tsx
import { useFeatureFlagClient } from '@island.is/react/feature-flags';

const MyComponent = () => {
  const featureFlagClient = useFeatureFlagClient();
  const [showAwesome, setShowAwesome] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const featureEnabled = await featureFlagClient.getValue(
        'isAwesomeFeatureEnabled',
        false,
      );

      setShowAwesome(featureEnabled as boolean);
    };

    getData();
  }, []);

  return `You are ${showAwesome ? 'awesome' : 'not really that awesome'}.`;
}
```

For more convenient feature flag checks, use the `useFeatureFlag` hook:

```tsx
import { useFeatureFlag } from '@island.is/react/feature-flags';

const MyComponent = () => {
  const { value: showAwesome, loading } = useFeatureFlag('isAwesomeFeatureEnabled', false);

  return `You are ${showAwesome ? 'awesome' : 'not really that awesome'}.`;
}
```

**Note:** While feature flags are loading (`loading === true`), the value defaults to the `defaultValue` argument provided.

The third argument (`user`) in `getValue` is optional and will default to the `defaultUser` prop in `FeatureFlagProvider` or the authenticated user from `Authenticator`.

## Running Unit Tests

To run unit tests with [Jest](https://jestjs.io), execute:

```sh
nx test react-feature-flags
```
```