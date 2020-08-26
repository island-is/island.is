# Islandis umbrella Helm chart

To add a new service to the umbrella chart you need to

- add a new entry to the `dependencies` in [Chart.yaml](./Chart.yaml)
- add a new top-level entry for the service in [values.yaml](./values.yaml) - here you can turn on resources like ingress, service accounts, etc.
- add a new top-level entry for the service in [values.dev.yaml](./values.dev.yaml) - here we have settings specific to the Development environment
- add a new top-level entry for the service in [values.prod.yaml](./values.prod.yaml) - here we have settings specific to the Production environment

When the umbrella charet changes, you need to increment the version at the bottom of [Chart.yaml](./Chart.yaml)

## Upgrading the Helm chart template

We are trying to stick to as few different templates as possible to avoid duplication and managed helm upgrades in a reasonable way. In [libs](./libs) folder we keep the different helm chart templates source. If you need to make changes in those you need to update the dependencies for the umbrella chart like this

```
helm dep update
```

~~Unfortunately we need to commit to git the resulting `.tgz` files in the [charts](./charts) folder since our deployment tool - Spinnaker, does not support building the files on the fly. Hopefully in a future version of Spinnaker, this will be fixed.~~

## Previewing/Troubleshooting your service's Helm chart

To see what Helm generates for the umbrella chart (and therefore your service as part of it) you can run something like this:

```
$ cd helm/islandis
$ helm template .  -f values.dev.yaml --set global.image.tag=2
```
