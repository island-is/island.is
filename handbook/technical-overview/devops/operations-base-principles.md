# Operations base principles

Here are the principles that we apply when deciding how to run Operational workloads. They come from the management team at Stafrænt Ísland.

1. Secure access to data and services
2. Minimize downtime
3. Allow for Developers to move fast
4. Be prepared for running a subset of critical services on-premise
5. Minimize operational overhead
6. Minimize expenses

## Security

We utilize all our expertise when provisioning infrastructure to apply state-of-the-art security in the cloud. We do our part to fulfill our responsibility in the [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/).

## Minimize downtime

We strive to apply changes to our Production environment that we are certain of the impact. That requires us to have pre-Production environment that is very close to the Production one where we exercise all changes before they are applied to Production. We also monitor our Production environment according to the Service-Level Agreements(SLA) for the individual services running there.

## Allow for Developers to move fast

We need to allow the Organization be able to deliver new services to the users and iterate on those quickly and safely. The same goes for fixes and improvements. That's why our Org has invested heavily in infrastructure as well as engineering practices and processes that allow the teams to create new applications with minimal operational overhead. This is achieved by standardizing and pre-packaging all infrastructure concerns in libraries and automation while keeping up with security standards.

## Be prepared for running a subset of critical services on-premise

As part of Iceland's government infrastructure, we need to be prepared to run a subset of our services in a local data center. To achieve that, we need to use technologies that are known to work on-premises. Fortunately, the majority of the core tech today is open-source or is based on open standards, which makes this requirement quite achievable. Non-critical services can utilize all the advantages of the cloud.

## Minimize operational overhead

We are using fully managed services in the cloud as much as possible since the TCO is much lower then managing them ourselves. We try to focus our operational effort on the unique services our Organization develops.

## Minimize expenses

We utilize our cloud expertise to minimize the cost of running in the cloud.
