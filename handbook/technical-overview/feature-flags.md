# Feature Flags

## Developer usage

If you want to introduce something behind a feature flag you can follow these steps:

1. Ask someone from DevOps for invite to ConfigCat.
2. Once you're in (https://app.configcat.com/) you can add your feature flag. The initial values should always be "On" in Dev and (probably always to start with) "Off" in Production and Staging.
3. Make sure that the CONFIGCAT_SDK_KEY environment variable is `export`ed in `.env.secret` in the root of the repository. You can fetch it by calling for example `yarn get-secrets service-portal`.
4. Start using your flag by using the package `@island.is/feature-flags`.

## Naming convention

When creating your feature flag, please try to have both the "Key for humans" and "key for programs" descriptive. If the feature flag will be used by a single service, make sure that at least the human key contains the service name. Adding a clear description will also help others knowing what your new flag does.

Example: Your service name is "my-awesome-service" and you're introducing a feature flag called "show-content". The key for humans could be "My awesome service: Show content" and the key for programs could be "myAwesomeServiceShowContent" (Hint: The UI generates the program key automatically from the human key)

## Feature flag lifecycle

After a feature flag has been flipped on for all environments be mindful to clean it up. That involves removing all mentions of that flag in the source code and deleting it from ConfigCat. You will need to contact an administrator to delete the flag.

## Feature flag for applications

You can introduce feature flags to applications. The flag determines whether the applications is accessible for users. See readme [here](https://docs.devland.is/libs/application/core#feature-flags 'Application system core readme') on further details on how to implement.
