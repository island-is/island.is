# Versioning

Versioning APIs is necessary to ensure the possibility of continuous development of API services. All APIs must provide a major, minor and patch version numbers. The **major** version number must be included as the first part of the URI path for all APIs.

## Version changes

Developers should strive to make all changes backwards compatible (non-breaking changes).

Versioning APIs should follow the [semantic versioning](https://semver.org/) specification. Given a version number MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes,
2. MINOR version when you add functionality in a backwards compatible manner, and
3. PATCH version when you make backwards compatible bug fixes.

When a `major` version is incremented, a new instance of the API service must be
made available and the older version instance kept running as described in section
[Deprecating API versions](#deprecating-api-versions).

## URLs

In all URLs with no exceptions, APIs must expose the **major** version number, with the character `v` as a prefix. The **minor** and **patch** version numbers should not be exposed in URLs.

**Bad**

```text
https://my-service.island.is/users
https://my-service.island.is/users?v=1
https://my-service.island.is/users?version=1
https://my-service.island.is/v1.2/users
https://my-service.island.is/v1.2.3/users
```

**Good**

```text
https://my-service.island.is/v1/users
```

## Increment version numbers

If an API introduces a breaking change, such as removing or renaming a field, its `major` version number must be incremented to ensure that existing user code does not suddenly break. Incrementing the `major` version should be avoided whenever possible to avoid increasing maintenance and cost of running many versions of the same service.

For **GraphQL** APIs use the `@deprecated` directive on fields which are to be renamed or removed from schemas. Add a descriptive text in the `reason:` with information on what the client should use in the future. This will allow older clients to continue functioning while updated clients can get the new schema right away. See [here](https://www.netlify.com/blog/2020/01/21/advice-from-a-graphql-expert/#designing-a-schema-that-is-easy-to-evolve) for more details.

## Deprecating API versions

When there are more than one running instances of an API, the old versions need to be decommissioned at some time to reduce maintenance costs.

### Notify clients when a specific API version will be discontinued

You should notify clients, who use your service, that the old version will stop working at a specified date. You should give them a link to a new version of the service and provide them with information about all breaking changes between versions. To help with that, you should always provide release notes with every version bump.

The specified date must not be less than 6 months from the time you notify your last client. Exceptions from this rule can be made when you see via your logs that no calls to this API version are made anymore.
