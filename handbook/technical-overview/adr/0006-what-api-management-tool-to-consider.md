# What API Management tool to consider

- Status: accepted
- Deciders: devs
- Date: 2020-09-14

Technical Story: Design of Api Gateway / API Portal

## Context and Problem Statement

Is there available tool that is compliant to requirements? Can the tool provide functionality for API Gateway? Can the tool provide functionality for API Development Portal?

### Requirements

Since the API Gateway is intended for students and startups to gather open government data, the following requirements need to be fulfilled. The student / startup is defined as Consumer of service. The organization that deliver the service as open service is defined as Provider of service. The open service is hosted on organizations X-Road server. The API Gateway must provide functionality for

- Registration of services with rate limit
- Self-service portal
- API key for Consumer
- Rate limit for Consumer

#### Provider

- Register open service in API gateway.
- Set rate limit on open service in API gateway.

#### Consumer

- Register as service user.
- Register application intended to use API (Consideration).
- Get API key for that application or consumer.
- Register what API to use in the application.
- Ability to test the API from API console with application API key (Consideration).

#### Considerations

API Keys / Rate Limits Is it sufficient to have only One API key for each Consumer, or is it required to define different Consumer applications with different API key. If a typical Consumer has created application and has valid API key, it is likely that he will not bother to register new application and get new API key. He could reuse the already given one. Consumer could also use the ability to register another application and get new API key with fresh rate limits.

Consumer registration What will be used to validate / approve students or startups for access on services. Should it be registered by SSN or some unique id, or only by email, with ability to reregister with new email again and again.

## Decision Drivers

- Vendor lock in for runtime
- Open source or not
- Installation options
- Functional ability
- Market presence
- Pricing

Pricing model for API management solutions are complex. Usually based on transaction count, or CPU instances. Sometimes pricing is variation of annual fee and transactional fee. All prices that are exposed in this documentation are estimates, needed to be negotiated with vendor.

There is consideration that most API management providers are aiming customers in hosted solutions, instead of on-prem installation, that would provide lock in for that vendor.

### Functional ability for decision

Functional ability to consider when evaluating the tool. The following list was taken from [wikipedia page for API Management](https://en.wikipedia.org/wiki/API_management).

- Gateway: a server that acts as an API front-end, receives API requests, enforces throttling and security policies, passes requests to the back-end service and then passes the response back to the requester. A gateway often includes a transformation engine to orchestrate and modify the requests and responses on the fly. A gateway can also provide functionality such as collecting analytics data and providing caching. The gateway can provide functionality to support authentication, authorization, security, audit and regulatory compliance.
- Publishing tools: a collection of tools that API providers use to define APIs, for instance using the OpenAPI or RAML specifications, generate API documentation, manage access and usage policies for APIs, test and debug the execution of API, including security testing and automated generation of tests and test suites, deploy APIs into production, staging, and quality assurance environments, and coordinate the overall API lifecycle.
- Developer portal/API store: community site, typically branded by an API provider, that can encapsulate for API users in a single convenient source information and functionality including documentation, tutorials, sample code, software development kits, an interactive API console and sandbox to trial APIs, the ability to subscribe to the APIs and manage subscription keys such as OAuth2 Client ID and Client Secret, and obtain support from the API provider and user and community.
- Reporting and analytics: functionality to monitor API usage and load (overall hits, completed transactions, number of data objects returned, amount of compute time and other internal resources consumed, volume of data transferred). This can include real-time monitoring of the API with alerts being raised directly or via a higher-level network management system, for instance, if the load on an API has become too great, as well as functionality to analyze historical data, such as transaction logs, to detect usage trends. Functionality can also be provided to create synthetic transactions that can be used to test the performance and behavior of API endpoints. The information gathered by the reporting and analytics functionality can be used by the API provider to optimize the API offering within an organization's overall continuous improvement process and for defining software Service-Level Agreements for APIs.
- Monetization: functionality to support charging for access to commercial APIs. This functionality can include support for setting up pricing rules, based on usage, load and functionality, issuing invoices and collecting payments including multiple types of credit card payments.

## Considered Options

- [Google Apigee Edge](https://cloud.google.com/apigee/api-management)
- [Mulesoft Anypoint](https://www.mulesoft.com/platform/api-management)
- [Software AG API Management](https://softwareaggov.com/products/integration/webmethods-api-management/)
- [IBM API Connect](https://www.ibm.com/cloud/api-connect)
- [Axway Ampify](https://www.axway.com/en/products/api-management)
- [Tibco Mashery](https://www.tibco.com/products/api-management)
- [AWS](https://aws.amazon.com/api-gateway/api-management/)
- [Akana](https://www.akana.com/)
- [Sensedia](https://sensedia.com/)
- [Kong](https://konghq.com/)
- [Red Hat 3Scale](https://www.3scale.net/)
- [WSO2](https://wso2.com/api-management/)
- [Tyk](https://tyk.io/)
- [Dell Boomi](https://boomi.com/)
- [Microsoft Azure API Management](https://azure.microsoft.com/en-us/services/api-management/)
- [Nginx Plus](https://www.nginx.com/)
- [Broadcom Layer7](https://www.broadcom.com/products/software/api-management)
- [KrakenD](https://www.krakend.io/)
- [Netflix Zool](https://github.com/Netflix/zuul)
- [Api Umbrella](https://apiumbrella.io/)
- [Express Gateway](https://www.express-gateway.io/)
- [Gravitee.io](https://gravitee.io/)

### Considered options functional matrix

The following list checks out the options. The options were checked by looking into documentation and read reviews. A Gap in the matrix does not mean that the option does not exist, only that it was not noted in documentation.

| API Management Tools                                 | Apigee Edge | Mulesoft Anypoint | Software AG | IBM | Axway | Tibco Mashery | AWS  | Akana | Sensedia | Kong | Red Hat 3Scale | WSO2        | Tyk          | Boomi | Azure | Nginx Plus | Broadcom | KrakenD | Netflix Zool | API Umbrella | Express Gateway | Gravitee.io    |
| ---------------------------------------------------- | ----------- | ----------------- | ----------- | --- | ----- | ------------- | ---- | ----- | -------- | ---- | -------------- | ----------- | ------------ | ----- | ----- | ---------- | -------- | ------- | ------------ | ------------ | --------------- | -------------- |
| **Platform Information**                             |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| On premise installation                              | Yes         | Yes               | Yes         | Yes | Yes   | Yes           |      | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      | Yes     | Yes          | Yes          | Yes             | Yes            |
| Cloud Service                                        | Yes         | Yes               | Yes         | Yes | Yes   | Yes           | Yes  |       |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   |            | Yes      |         |              |              |                 |                |
| Hybrid Installation                                  | Yes         | Yes               | Yes         |     |       | Yes           |      |       |          |      |                |             |              |       |       |            | Yes      |         |              |              |                 |                |
| Open Source                                          | No          | Yes/No            | No          |     | No    | No            | No   | No    | No       | Yes  | Yes            | Yes         | Yes          | No    | No    | No         | No       | Yes     | Yes          | Yes          | Yes             | Yes            |
| License model                                        | Paid        | Paid              | Paid        |     | Paid  | Paid          | Paid | Paid  | Paid     | Paid | Apache/Paid    | Apache/Paid | Mozilla/Paid | Paid  | Paid  | Paid       | Paid     | Apache  | Apache       | MIT          | Apache License  | Apache License |
| Cost of usage (on prem)                              |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| Cost of usage (cloud)                                |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| Gartner 2019                                         | \#1         | \#2               | \#3         | \#4 | \#5   | \#6           | \#12 |       | \#9      | \#7  | \#8            | \#10        | \#17         | \#20  | \#14  | N/A        | \#13     | N/A     | N/A          | N/A          | N/A             | N/A            |
| Forrester 2020                                       | \#3         | \#6               | \#1         | \#2 | \#5   | \#6           |      | \#5   |          | \#14 | \#11           | \#4         | \#12         | N/A   | \#13  | N/A        | N/A      | N/A     | N/A          | N/A          | N/A             | N/A            |
| Forrester 2018                                       | \#2         | \#10              | \#3         | \#1 | \#7   | \#6           |      | \#4   |          |      | \#15           | \#5         | \#12         | N/A   | \#12  | N/A        | N/A      | N/A     | N/A          | N/A          | N/A             | N/A            |
| Forrester Market precense 2020                       | 1           | 1                 | 2           | 1   | 3     | 2             |      | 4     | 5        |      | 3              | 3           | 5            | N/A   | 2     | N/A        | N/A      | N/A     | N/A          | N/A          | N/A             | N/A            |
| Forrester Market precense 2018                       | 1           | 1                 | 3           | 2   | 3     | 3             |      | 5     | 5        |      | 3              | 3           | 5            | N/A   | 2     | N/A        | N/A      | N/A     | N/A          | N/A          | N/A             | N/A            |
|                                                      |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| **Gateway**                                          |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| Oauth                                                | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      | Yes     |              | Yes          | Yes             | Yes            |
| OpenID Connect                                       | Yes         | Yes               | Yes         |     | Yes   |               | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      |         |              |              |                 | Yes            |
| Caching                                              | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      | Yes     |              |              |                 | Yes            |
| Throttling / Rate limit                              | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      |         | No           | Yes          | Yes             | Yes            |
| Analytics                                            | Yes         | ?                 | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   | Yes        |          | No      |              |              |                 |                |
| Stages (prod/dev/test)                               | Yes         | Yes               | Yes         |     |       | Yes           | Yes  |       |          |      | Yes            | Yes         |              | Yes   | Yes   | Yes        |          |         |              |              |                 |                |
|                                                      |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| **Publishing Tool**                                  | Yes         | Yes               | Yes         |     |       |               |      |       |          |      |                | Yes         |              |       |       |            |          | No      |              |              |                 |                |
| OpenAPI Description                                  | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   | Yes   |            | Yes      |         |              |              | No              | Yes            |
| RAML API Descriptor                                  |             | Yes               |             |     | Yes   | Yes           |      | Yes   |          |      | Yes            |             |              | Yes   | No    |            |          |         |              |              |                 |                |
| Soap WSDL Description                                | Yes         | Yes               | Yes         |     | Yes   | Yes           |      |       |          |      | Yes            | Yes         | Yes          | Yes   | Yes   |            | Yes      |         |              |              |                 |                |
| Does tool provide Life Cycle Management of Services. | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  | Yes   |          |      |                | Yes         |              |       | Yes   |            |          |         |              |              |                 | Yes            |
| Message Mediation / Orchestration / Transformations  | Yes         |                   | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  |                | Yes         | Yes          | Yes   | Yes   |            | Yes      |         |              |              |                 | Yes            |
| Does tool provide Dynamic endpoints.                 | Yes         |                   | Yes         |     | Yes   | Yes           |      |       |          | Yes  |                | Yes         | Yes          |       |       |            |          |         |              |              |                 |                |
| API Interface for registration of services           | Yes         |                   |             |     | Yes   |               | Yes  | Yes   |          | Yes  |                | Yes         | Yes\*        |       |       |            |          |         |              |              |                 |                |
|                                                      |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| **Developer portal/API store**                       |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          | No      | No           |              | No              |                |
| API Inventory                                        | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  | Yes   |          | Yes  | Yes            | Yes         | Yes          | Yes   |       | Yes        | Yes      |         |              | Yes          |                 | Yes            |
| Access request workflow                              | Yes         | Yes               | Yes         |     | Yes   |               |      |       |          |      |                | Yes         | Yes          |       |       |            | Yes      |         |              |              |                 | Yes            |
| Branding / Customize user interface                  | Yes         | Yes               | Yes         |     |       | Yes           | Yes  |       |          | Yes  | Yes            | Yes         | Yes          | Yes   |       |            | Yes      |         |              |              |                 |                |
| Analytics                                            |             |                   |             |     |       |               |      |       |          |      |                | Yes         |              | Yes   |       |            |          |         |              |              |                 | Yes            |
|                                                      |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          |         |              |              |                 |                |
| **Reporting and analytics**                          |             |                   |             |     |       |               |      |       |          |      |                |             |              |       |       |            |          | No      | No           |              | No              |                |
| Does tool provide Monitoring Dashboard               | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  |       |          | Yes  |                | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      |         |              |              |                 | No             |
| Does tool provide Logging of request.                | Yes         | Yes               | Yes         |     | Yes   | Yes           | Yes  |       |          | Yes  |                | Yes         | Yes          | Yes   | Yes   | Yes        | Yes      |         |              |              |                 |                |
| Does tool provide statistics for SLA.                | Yes         | Yes               | Yes         |     | Yes   |               | Yes  |       |          |      |                | Yes         |              |       |       |            |          |         |              |              |                 |                |
| Does tool provide logging to ELK / 3rd party logging | Yes         | Yes               | Yes         |     | Yes   | Yes           |      |       |          | Yes  |                | Yes         | Yes          |       |       | Yes        | Yes      |         |              | Yes          |                 | Yes            |

## Decision Outcome

We recommend using hosted solution from **AWS** for API gateway. The reason is that if we look at the requirements and other architectural decisions in the project, the AWS solution does both fit in the architecture and pricing based on usage is cheaper than in other options. We made a pricing estimate for five years. Based on 100 million API calls per month the price of using AWS is one third of bought enterprise or homemade solutions. If the usage is 20 million API calls per month, we are looking at one fifth of the enterprise solutions. Note that there is also cost in using the management API and storage cost of logging, but it seems to be fraction of the total cost of using the product. Since the requirement is to host X-Road services that are defined as open and hosted at organization, we need to access the service through open X-Road server. Currently there will be installed X-Road server on AWS environment to use by island.is, that server can also be used by API gateway. Downside is that all request needs to go to the AWS environment, and then go back to Iceland. According to vendor lock in, then the investment cost of this option is not in the range that it will stop us to change to other solution. That could happen if requirement changes or the usage will be more than expected. This decision is based on the requirements and intended usage. If those requirements change, for example we would use the API portal as portal for Viskuausan, or more intense usage is expected, other options could be more relevant.

Following is the decision phases used to get this conclusion.

### Second phase of decision

For Open Source tool, we recommend usage of **Kong Community Edition**, with custom made API Developer Portal and Analytics. The analytics part could be based on ELK stack through plugin. The Kong community is large, and there are some Developers Portals available in the Open Source community. There is also some plugin available for logging and monitoring available. Kong API Gateway provides rest interface that can be used for customizing API Portal, and ability to create custom plugins for custom implementations. This decision provides more custom code to be developed and we need to rely on that the community can provide plugins. We also rely on that the Kong product will remain open source, but lot of plugins are only available for Enterprise edition.

**WSO2** could be considered, since the whole suite is Open Source, so API Developer Portal and Admin UI is part of their Open Source offering. It is not recommend to use it without paid support plan.

For Vendor specific tool we recommend **Software AG API Management**. It is fully functional with customizable Developer Portal, and analysis tool. It has both partner and customers in Iceland. Current pricing model is based on transaction count and same applies for On-Prem vs. Hosted implementations. There are no cloud provider or runtime lock in. Implementation is that the tool needs to be installed and configured. The Developer Portal needs to be customized. For starter it is also option to host the installation at Advania for further evaluation. Analytics are fully integrated to ELK stack.

For hosted solutions, we recommend **AWS**, since it best fits the architectural decisions made for island.is

### First phase of decision

In the first decision phase the following tools were initially pinpointed for further analysis. That was based on the option to run the API Management tool on premise. In decision outcome above, the tools have been narrowed to two options.

If open source options are not a requirement, it is suggested to evaluate the following tools.

- [Software AG API Management](https://softwareaggov.com/products/integration/webmethods-api-management/)
- [IBM API Connect](https://www.ibm.com/cloud/api-connect)
- [Google Apigee Edge](https://apigee.com/about/cp/open-source-api-management)
- [Mulesoft Anypoint](https://www.mulesoft.com/platform/api-management)
- [Axway Ampify](https://www.axway.com/en/products/api-management)

These are the tools that are most mature, and do not provide lock in for runtime platform. They need to be evaluated based on pricing and technical ability.

If true open source is required, it is suggested to evaluate the following tools.

- [WSO2](https://wso2.com/api-management/)
- [Kong](https://konghq.com/)

These tools provide open source offering, but in most cases the features for Api Developer Portal and Publishing tools are only part of enterprise offering with subscription. Evaluation is needed for validating if the open source offering of the tool contains what is needed for implementation. We need to evaluate pricing of enterprise offering against the price of creating/implementing required pieces, like custom Api Developer Portal.

For hosted solution, the following options is considered

- [AWS](https://aws.amazon.com/api-gateway/api-management/)
- [Microsoft Azure API Management](https://azure.microsoft.com/en-us/services/api-management/)
- [Google Apigee Edge](https://apigee.com/about/cp/open-source-api-management)

Downside is that they are all platform dependent, to the owners proposed platform with more limited on-premise options. These are all top of the line tools according to capabilities.

For all considered tools we need to check what underlying software components are required. For example, data storage, queuing, and logging capacity. We need to take into consideration effort and ability to build Developer portal, compared to customizing the tool offering.

Other tools that we looked at did in our opinion lack functionality or other ability for further considered, even though many of them could be considered. Note that the list provided is not all existing Api Management tools, so other options might apply.

### Positive Consequences

- Api Management tools are listed and grouped based on if they have open source option or not.

### Negative Consequences

- All considered options are vendor lock in.

## Pros and Cons of the Options

### [Google Apigee Edge](https://apigee.com/about/cp/open-source-api-management)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: At least one large company is using ApiGee.

Full blown API Management Platform from Google.

- Good, considered leader by both Gartner and Forrester
- Good, number 1 product in Gartner.
- Good, number 3 product in Forrester.
- Good, offers lot of functionality, and easy to use. `Gartner`
- Good, big market presence. `Forrester`
- Bad, complex to install on site. `Gartner`
- Bad, prices are higher. `Gartner`
- Bad, cloud offerings are only available on Google Cloud.

### [Mulesoft Anypoint](https://www.mulesoft.com/platform/api-management)

Price: To be requested. Partners in Iceland: Unknown Usage in Iceland: Unknown

Full blown API Management Platform from Mulesoft. Mulesoft products combine Application Integration and API management in product suite. Mulesoft is based on open source core product Mule. [GitHub](https://github.com/mulesoft/mule), but API management components are not open source. Mulesoft was acquainted by SalesForce 2018.

- Good, considered leader by Gartner and strong performer by Forrester
- Good, number 2 product in Gartner.
- Good, because chosen option for Australia gov.au platform.
- Good, because Mulesoft offers stand-alone offering for API Management.
- Consideration, what happens with ownership of SalesForce.

### [Software AG API Management](https://softwareaggov.com/products/integration/webmethods-api-management/)

Price: 500.000ISK per month based on 3.000.000 API calls per month. (To be negotiated). Partners in Iceland: Advania.

Usage in Iceland: 3 Installations for customers. Full blown API Management Platform from Software AG. Software AG products combine Application Integration and API management in product suite. Software AG products are not open source.

- Good, considered leader by both Gartner and Forrester
- Good, number 3 product in Gartner.
- Good, number 3 product in Forrester.
- Good, offers stand-alone offering for API Management.

### [IBM API Connect](https://www.ibm.com/cloud/api-connect)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: Unknown

Full blown API Management Platform from IBM. API Connect from IBM is not open source.

- Good, considered leader by both Gartner and Forrester
- Good, number 1 product in Forrester.
- Good, number 4 product in Gartner.

### [Axway Ampify](https://www.axway.com/en/products/api-management)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: Unknown

Full blown API Management Platform from Axway. Axway products combine Application Integration and API management in product suite. Axway products are not open source.

- Good, considered leader by both Gartner and strong performer by Forrester
- Good, offers stand-alone offering for API Management.

### [Tibco Mashery](https://www.tibco.com/products/api-management)

Price: Needs request. Partners in Iceland: Advania. Usage in Iceland: Unknown

Full blown API Management Platform from Tibco. Tibco products combine Application Integration and API management in product suite. Tibco products are not open source.

- Average, considered visionary by Gartner and strong performer by Forrester.
- Good, offers stand-alone offering for API Management.

### [AWS](https://aws.amazon.com/api-gateway/api-management/)

Price: Needs request. Partners in Iceland: [Andes](https://andes.is), others Usage in Iceland: Unknown

Full blown API Management Platform from AWS.

- Good, in 2018, AWS’s revenue from Amazon API Gateway grew by a market-leading 160% year over year, far above the market average of 31%. `Gartner`
- Average, considered challenger by Gartner
- Consideration, AWS indicates that their product can be installed on premise, but most reviews point out that it is Cloud only offering.
- Bad, AWS doesn’t offer a customer-managed gateway, which is critical technology for many organizations operating in highly secured and restricted on-premises environments. However, its AWS Outposts offering, which provides AWS services on-premises (managed, maintained and supported by AWS), is in preview at the time of writing. `Gartner`

### [Akana by Perforce](https://www.akana.com/)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: At least two large installations

Full blown API Management Platform from Perforce. The Solution has been purchased twice in recent years. First by Rouge Software, then by Perforce in 2019. This product was on top of Gartner report some years ago, but small presence and evolution in other tools has put them bit back.

- Bad, small market presence `Forrester`
- Average, moderate customer satisfaction with product usage `Forrester`
- Bad, low satisfaction with the vendor `Forrester`

### [Sensedia](https://sensedia.com/)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: Unknown

To get further information about Sensedia product we need to register email and read whitepapers. Review is based on Gartner / Forrester report.

- Average, considered visionary by Gartner and strong performer Forrester
- Good, Sensedia is one of the few vendors in this market to support the growing demand for the creation and management of GraphQL endpoints. `Gartner`
- Bad, Although Sensedia has been hiring local staff and has begun to expand into Europe, it still has limited reach beyond its home country of Brazil. `Gartner`
- Bad, Small market presence `Forrester`

### [Kong Community Edition](https://konghq.com/)

Price: Open Source. Partners in Iceland: N/A Usage in Iceland: Community edition is used in small setup, but not advertised.

Kong Community Edition is Open Source API Gateway. [GitHub](https://github.com/Kong). The tool is managed by Rest services. There are quite few Open Source Admin tools like Konga ([https://pantsel.github.io/konga/](https://pantsel.github.io/konga/)) and ([https://github.com/pocketdigi/kong-admin-ui](https://github.com/pocketdigi/kong-admin-ui)) that can be used to manage the API Gateway. Everyone can write their own plugin to the product, and it has variety of options advertised ([https://docs.konghq.com/hub/](https://docs.konghq.com/hub/)), Many plugins are only available in Enterprise edition of the product, which require subscriptions and they are not Open Source. As a user you still have ability to either create your own plugin or find plugin for your need in Open Source community. For example plugin for OpenID Connect requires enterprise edition, but we can still find contributed plugin for that functionality ([https://github.com/Optum/kong-oidc-auth](https://github.com/Optum/kong-oidc-auth)). The Community edition does not have Open Source Developer Portal. We have found at least one Open Source Portal on top of Kong ([https://github.com/Haufe-Lexware/wicked.haufe.io](https://github.com/Haufe-Lexware/wicked.haufe.io)). Kong does not natively support OpenAPI, but plugin is available to define OpenAPI spec url to an endpoint. There are also some paid solutions built on Kong Gateway. All GraphQL plugins are part of Enterprise Edition. Risk factor is that future additions to Kong, will aim on Enterprise Edition.

### [Kong Enterprise Edition](https://konghq.com/)

Price: Request needed with NDA signature. Partners in Iceland: Unknown Usage in Iceland: Unknown

By using Kong Enterprise edition, more plugins and support can be obtained by Kong. In addition you get customizable Developer Portal, Analytics tools and various developer tools. The add on features are not open source, and provides a Kong vendor lock in. Kong provides Enterprise Edition of the Product, that includes API Developer Portal, and Development Tools. Kong is built on NginX.

- Average, considered visionary by Gartner.
- Good, large open source community, over 180 contributors and 25000 GitHub stars.
- Good, large range of installation modules.
- Good, provides maintenance and support for large enterprise.
- Good, API Interface for managing the gateway.
- Bad, little SOAP support.

### [Red Hat 3Scale](https://www.3scale.net/)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: Unknown

Red Hat 3Scale is open source API gateway [GitHub](https://github.com/3scale/APIcast). It needs license for usage.

- Average-, considered visionary by Gartner and contender by Forrester
- Good, fully open source product. All offerings are open source.
- Good, company has good market presence `Forrester`
- Consideration, small community, 28 contributors 196 GitHub stars

### [WSO2](https://wso2.com/api-management/)

Price (Unsupported Version): Open Source. Price: 11400 EUR Per Core / per year. For 4 Cores it would be 600.000ISK per month. (To be negotiated). Partners in Iceland: N/A Usage in Iceland: Unknown

WSO2 is open source API management tool. It can be obtained from GitHub without support, but Paid option includes support and fixes. The unsupported version provides all functionality, including Developer Portal and API Gateway Administrative user interface. However, no fixes, and support is provided. During our research we found out that to run the product in Production environment, user must work around through bugs that are in the base versions. Bug fixes are not available in the community edition. Downloaded bundles from WSO2 site may not be used in production Environment. They include WS02 license that prohibit production usage without support subscription. Risk factor is that the product is moving to full license module.

- Average+, considered visionary by Gartner and leader by Forrester
- Good, number 4 product in Forrester.
- Good, decent open source community, 144 contributors and 410 GitHub stars.
- Good, fully open source product. All offerings are open source.
- Consideration, recent change in license model, directing customers to paid support.

### [Tyk Open Source Edition](https://tyk.io/)

Price: Open Source. Partners in Iceland: N/A Usage in Iceland: Unknown

This Open Source offering is similar to Kong Community edition. Only the API gateway of the product is Open Source, and it is managed by Rest Services. The community is smaller than Kong even though it has 5600 stars on GitHub. Like in Kong, Plugin can be created, but does not contain as extensive inventory of plugins as Kong.

### [Tyk](https://tyk.io/)

Price: Starting price \$450 per month. Partners in Iceland: N/A Usage in Iceland: Unknown

Full blown API Management Platform from Tyk. Tyk provides open source API Gateway described above. In addition the paid version of the program includes Tyk API Dashboard, Designer, Analytics and Developer Portal.

- Average, considered strong performer by both Gartner and Forrester
- Good, API Gateway is free to use for all forever according to homepage.
- Good, good open source community, 62 contributors and 5600 GitHub stars.
- Bad, Small market presence `Forrester`

### [Dell Boomi](https://boomi.com/)

Boomi is full blown API Management Platform from Dell. This is enterprise solution, and not open source.

- Average-, considered nice player by Gartner.
- Bad, score lowest of all vendors in Gartner report.

### [Microsoft Azure API Management](https://azure.microsoft.com/en-us/services/api-management/)

Price: Premium ~\$2,795.17/month.

Api management platform from Microsoft. This platform is easy to install and operate in the Azure cloud. The prefered pricing option is the premium one. In the premium pricing option you have the ability to have self hosted gateway, that can be executed on prem for network latencey. All management is however done from the Azure cloud.

- Good, considered leader by both Gartner and Forrester
- Consideration, Microsoft indicates that their product can be installed on premise via VLAN, but most reviews point out that it is Cloud only offering.
- Bad, Azure API Management is an Azure cloud service and will remain focused on developers’ and IT professionals’ priorities to build, deploy and manage applications through Microsoft’s global cloud. It’s unlikely to evolve in response to the main business drivers of digital transformations, in contrast to most other offerings in this market. `Gartner`

### [Nginx Plus](https://www.nginx.com/)

Price: For Nginx plus, yearly price for software is \$2500. Partners in Iceland: Unknown Usage in Iceland: Unknown

Nginx offers API management in Nginx Plus and Nginx Controller product. Nginx Plus is a API Gateway, and API Management features like developer portal and management / registration interface is provided with API management plugin on NginX Controler. Nginx Plus and NginX Controller are not open source products. Ngin

- Good, NginX open source reverse proxy is widely used as component in other API Management solutions.
- Bad, did not find many information about distribution and usage.

### [Broadcom Layer7](https://www.broadcom.com/products/software/api-management)

Price: Needs request. Partners in Iceland: Unknown Usage in Iceland: Unknown

Layer7 is full blown API Management Platform from Broadcom. Layer7 is not open source product.

- Average-, considered nice player by Gartner
- Bad, drops from leader in Gartner report. `Gartner`

### [KrakenD](https://www.krakend.io/)

Price: Open Source. Partners in Iceland: Unknown Usage in Iceland: Unknown

Krakend offers open source API Gateway. Tool is intended to create REST interface to combine many calls to backend system.

- Consideration, small community, 17 contributors but 2700 GitHub stars
- Bad, no developer portal.
- Bad, tool not intended as API Management tool, only gateway to combine microservice in single platform.

### [Netflix Zool](https://github.com/Netflix/zuul)

Price: Open Source. Partners in Iceland: Unknown Usage in Iceland: Unknown

Zool is open source API Management Tool by Netflix, [GitHub](https://github.com/Netflix/zuul) Zool is purpose was to serve as backend of the NetFlix streaming application.

- Good, 66 contributors and 9400 GitHub stars.
- Consideration, 66 contributors but very small activity on GitHub.
- Consideration, designed for use with Netflix.
- Bad, no Api Development Portal.
- Bad, Last release nearly one year ago.

### [Api Umbrella](https://apiumbrella.io/)

Price: Open Source. Partners in Iceland: Unknown Usage in Iceland: Unknown

Open source API management tool by National Renewable Energy Laboratory. Open source [GitHub](https://github.com/NREL/api-umbrella)

- Consideration, 66 contributors but very small activity on GitHub.
- Bad, latest release over one year ago.

### [Express Gateway](https://www.express-gateway.io/)

Price: Open Source. Partners in Iceland: Unknown Usage in Iceland: Unknown

According to homepage, initial purpose as microservices API Gateway. Open Source [GitHub](https://github.com/ExpressGateway/express-gateway)

- Bad, no support for OpenAPI, requested in GitHub 2018 without implementation.
- Bad, 26 contributors, and very small activity on GitHub.

### [Gravitee.io](https://gravitee.io/)

Price: Open Source. Partners in Iceland: Unknown Usage in Iceland: Unknown

According to homepage, initial purpose as microservices API Gateway. Open Source [GitHub](https://github.com/gravitee-io).

- Good, 995 Github stars.
- Bad, only 16 contributors, and very small activity on GitHub.
- Consideration, currently creating paid Enterprise edition to address all change requests.

## Links

- [`Gartner`](https://www.gartner.com/) Magic Quadrant for Full Life Cycle API Management, Published 9 October 2019
- [`Forrester`](https://www.forrester.com/) The Forrester Wave™: API Management Solutions, Q4 2018
- [`Forrester`](https://www.forrester.com/) The Forrester Wave™: API Management Solutions, Q3 2020
