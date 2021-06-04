# Logging, Monitoring and APM Platform

- Status: proposed
- Deciders: ops, devs, devops, managers
- Date: 2021-01-27

Technical Story: Using SaaS solution or build our own for logging, monitoring and APM(application performance monitoring)

## Context and Problem Statement

We need a central observability platform where we ingest all our logs, metrics and traces so that ops, devs and devops can analyze performance, reliability and uptime. We can try to build and host such a platform on our own or use SaaS providers like DataDog.

## Decision Drivers

- Reliability
- Feature-richness
- Cost
- Maintenance
- Development
- Vendor lock level

## Considered Options

- Self hosted: Elasticsearch + Grafana + Kibana + Logstash + Jaeger
- SaaS: DataDog

**Full disclosure: Andes ehf. is a DataDog partner. Andes ehf. would not be receiving any sort of kick-backs due to Stafrænt Ísland using DataDog services. Stafrænt Ísland would be in a direct relationship with DataDog.**

Special note about pricing comparison: This is a very high-level price comparison, which does not take into account the ever-growing consumption we will see but should give a rough idea of the balance of cost.

| Self-Hosted                         |                    |               |                           |                                   |                                        |
| ----------------------------------- | ------------------ | ------------- | ------------------------- | --------------------------------- | -------------------------------------- | --- |
| Factors                             | Fixed price, hours | Monthly hours | Monthly price without VAT | First year total cost without VAT | First two years total cost without VAT |
| Development                         | 160                | 0             | 0                         | ISK3,200,000.00                   | ISK3,200,000.00                        |
| Infrastructure                      | 0                  | 0             | \$700.00                  | ISK1,100,400.00                   | ISK2,200,800.00                        |
| Monitoring                          | 8                  | 0             | ISK10,000.00              | ISK280,000.00                     | ISK400,000.00                          |
| Maintenance                         | 0                  | 5             | 0                         | ISK1,200,000.00                   | ISK2,400,000.00                        |
| Total                               |                    |               |                           | **ISK5,780,400.00**               | **ISK8,200,800.00**                    |
|                                     |                    |               |                           |                                   |                                        |
| **SaaS**                            |                    |               |                           |                                   |                                        |
| DataDog                             | 0                  | 0             | \$1,750.00                | **ISK2,751,000.00**               | **ISK5,502,000.00**                    |     |
|                                     |                    |               |                           |                                   |                                        |
|                                     |                    |               |                           |                                   |                                        |
|                                     |                    |               |                           |                                   |                                        |
|                                     |                    |               |                           |                                   |                                        |
| Sample hourly rate without VAT, ISK | ISK20,000.00       |               |                           |                                   |                                        |
| ISK/USD                             | ISK131.00          |               |                           |                                   |                                        |

## Decision Outcome

SaaS solution (DataDog) is a clear winner due to its hastle-free service usage, continuous improvement as well as its competitive pricing.

### Positive Consequences

- Easy access to observability for devs and devops
- Well known integration target for third-party services
- Monitoring setup is well known in the industry
- No special knowledge about setup of the plaftorm

### Negative Consequences

None.

## Pros and Cons of the Options

### Self-hosted

Elasticsearch + Grafana + Kibana + Logstash + Jagger + Prometheus

- Good, because it consists of open-source components which we can use
- Good, because it uses open protocols
- Good, because it is a relatively low cost running this stack
- Bad, because there are no ready Dashboards for our stack
- Bad, because we need to develop this package ourselves and it would be a while before we can use it
- Bad, because due to a disagreement between AWS and the company behind the open source Elasticsearch, there is some uncertainty about its future on the AWS platform
- Bad, because we need to operate this ourselves - run, monitor, upgrade, integrate addons

### DataDog

DataDog is a monitoring and APM platform that has a wide variety of integrations and continues to develop new ones

- Good, because it is a very feature-rich platform
- Good, because it allows having our data in the EU and complies with data regulations relevant to Iceland
- Good, because it is ready to use right now
- Good, because it supports open protocols
- Good, because it scales with usage
- Good, because it is run by someone else than us
- Good, because the company keeps adding new features that we can simply turn on
- Good, because devops have all this time to do other things specific to the problem domain
- Bad, because with increased usage comes increased markup

## Links

- [DataDog](https://datadoghq.com)
- [Prometheus](https://prometheus.com)
- [Elasticsearch](https://www.elastic.co)
- [Jaeger](https://www.jaegertracing.io)
- [Grafana](https://grafana.com/grafana/)
