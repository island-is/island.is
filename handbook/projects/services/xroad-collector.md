# X-Road Collector

Scheduler that uses the module from [api-catalogue-services] to collect
information about web services registered in the X-Road environment.

Scheduler configuration can be found in the helm chart settings.

# Usage

_Prerequisite:_

> Make sure that the environment variables described in [api-catalogue-services]
> exists before running the xroad-collector

To run use

```bash
yarn start services-xroad-collector
```

[api-catalogue-services]: ../../../libs/api-catalogue/services/README.md
