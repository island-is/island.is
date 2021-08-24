# Service configuration

## Deploying our services

The services we are developing are deployed to Kubernetes using Helm. We have developed a mini DSL in TypeScript to help us with the configuration of the services as well as allow us some flexibility when creating feature deployments compared to the static YAML.
The configuration for each service is part of the source code for the service, in a separate folder named `infra`.

The DSL is helping us enforce certain conventions and responsibilities. For example it helps us make sure that secrets values are present in all environments that we are deploying to. Same for environment variables' values.

## Server-side feature flags

We already have a method to roll out [feature flags](../feature-flags.md) to users, so you might be wondering what are these "server-side" features all about. These are features that are not specific to users or groups of users. They are intended for features that are not ready for production (or staging) yet usually due to:

- lack of configuration information
- incomplete implementation

Using these features you can deploy the code all the way to production without having to provide secret or env. variables values for the env where the feature is not turned on.

## Turning the features on and off

Curretntly the feature-specific configuration that can be specified is environment variables and secrets. For an example please see [this file](../../../infra/src/dsl/toggles.spec.ts)

The features are turned off by default and need to be turned on explicitly in the environment configuration using the field `featuresOn`.

## Using the features in the code

The only usage of the features is to check whether a flag is "on". To do that, use the `ServerSideFeatureClient` object [exported in the feature flags library](../../../src/libs/feature-flags/src/lib/server-side-clients.ts).

## Cleaning up

After the feature is in use on prod, please remove all references to it in the code.
