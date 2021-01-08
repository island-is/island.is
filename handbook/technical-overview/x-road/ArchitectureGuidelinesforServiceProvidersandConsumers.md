# Architecture Guidelines for Service Providers and Consumers

## Overview <a id="19bfb586-a73f-4335-8e13-11e141dd907f"></a>

_Straumurinn_ is based on X-Road, an open source data exchange layer solution that enables organizations to exchange information over the Internet. X-Road is a centrally managed distributed data exchange layer between information systems that provides a standardized and secure way to produce and consume services.

While configuration, service registration and certification is centrally managed, individual service providers and consumers manage or use their own Security Servers, which are resilient to disruptions in the operation of the central services. Availability is one of the main concerns for the operators of individual Security Services, and options in that regard are thus a focus of this document.

![](../../../.gitbook/assets/x-road/image1%20%282%29.png)

Figure 1: [X-Road security architecture](https://github.com/nordic-institute/X-Road/blob/develop/doc/Architecture/arc-sec_x_road_security_architecture.md)

The exchange of information over the X-Road security layer is synchronous. There is no queuing mechanism offered by X-Road, as its main purpose is to serve as a secure transport layer, and thus the handling of errors is the responsibility of the corresponding client and provider information systems.

### Further reading <a id="d33a23fc-c9ce-497f-9957-61de4700f10a"></a>

* [X-Road Architecture](https://x-road.global/architecture)
* [X-Road Security Architecture](https://github.com/nordic-institute/X-Road/blob/develop/doc/Architecture/arc-sec_x_road_security_architecture.md)
* [X-Road Architecture - Technical Specification](https://github.com/nordic-institute/X-Road/blob/develop/doc/Architecture/arc-g_x-road_arhitecture.md)

## Availability <a id="2c8b484c-479c-4a28-9dc0-211bc028a9c9"></a>

A benefit of the distributed design of X-Road is that no one component is a system-wide bottleneck or point of failure. The availability of security services for each service consumer and provider can be increased with redundant configurations. There are two possible approaches to increase the availability of X-Road security servers: Internal and external load balancing. Those two approaches entail a trade-off between simplicity and flexibility.

The Security Server has an internal client-side load balancer, and it also supports external load balancing. The client-side load balancer is a built-in feature, and it provides high availability. Instead, external load balancing provides both high availability and scalability from a performance point of view.

### Internal load balancing <a id="8e8e3a9e-b444-4f1a-adb6-d64c1424b28b"></a>

Internal load balancing is a feature built into the X-Road security servers. The solution provides high availability, but not scalability, as identical services can be registered on multiple Security Servers and are chosen on a "Fastest Wins" basis. If the same service is available on multiple Security Servers, the requests are load-balanced amongst the Security Servers but the load is not evenly distributed between all the provider side Security Servers. If one of the Security Servers goes offline, requests are automatically routed to other available Security Servers. The service client's security server will choose the first available service provider's security server when forwarding the request. Thus, redundancy is inherent to the X-Road message transport protocol, provided that there are multiple security servers configured to offer the same service.

The configuration of internal load balancing is simpler than external load balancing, as the Security Servers take care of routing the requests and verification of certificates internally. It does require the effort of configuring the services independently, though identically, on each Security Server; adding a new service requires adding it manually to each Security Server intended to handle requests to that service. The addition of each Security Server requires an independent registration process with the X-Road central to be completed.

![](../../../.gitbook/assets/x-road/image2%20%283%29.png)

Figure 2: “The Fastest Wins” - the server that responds the fastest to TCP connection establishment request is used by a client Security Server. See [Balancing the Load in X-Road](https://www.niis.org/blog/2018/6/25/balancing-the-load).

### External load balancing <a id="1dfbab03-054f-4967-a7c5-9910c90118ed"></a>

Both high availability and scalability, from a performance point of view, can be achieved with the X-Road Security Server support for the use of external internet-facing load balancers. In this setup an external LB is used in front of a Security Server cluster and the LB is responsible for routing incoming messages to different nodes of the cluster based on the configured load balancing algorithm. Using the health check API of the Security Server, the LB detects if one of the nodes becomes unresponsive and quits routing messages to it.

Setting up a Security Server cluster is more complicated compared to the internal load balancing that is a built-in feature and enabled by default. Security Server version upgrades are more complex with an external load balancer, as the upgrade process must be coordinated within the cluster. On the other hand, adding new nodes to a cluster is easy, as the normal registration process is not required, because all the nodes in the cluster share the same identity. In contrast, when relying on the internal load balancing, each node is independent and has its own identity – adding a new Security Server means that full registration process must be completed.

![](../../../.gitbook/assets/x-road/image3%20%281%29.png)

Figure 3: An external LB can be used in front of a Security Server cluster and the LB is responsible for routing incoming messages to different nodes. See [Balancing the Load in X-Road](https://www.niis.org/blog/2018/6/25/balancing-the-load).

### Further reading <a id="89cf0edb-da88-4faf-b0aa-3d490642dcf3"></a>

* [X-Road Architecture](https://x-road.global/architecture)
* [Balancing the Load in X-Road](https://www.niis.org/blog/2018/6/25/balancing-the-load)
* [X-Road Security Architecture: Availability](https://github.com/nordic-institute/X-Road/blob/develop/doc/Architecture/arc-sec_x_road_security_architecture.md#5-availability)
* [X-Road: Security Server Architecture: Redundant Deployment](https://github.com/nordic-institute/X-Road/blob/develop/doc/Architecture/arc-ss_x-road_security_server_architecture.md#52-redundant-deployment)
* [X-Road: External Load Balancer Installation Guide](https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/LoadBalancing/ig-xlb_x-road_external_load_balancer_installation_guide.md)

The following table summarizes the Availability and Performance configuration options discussed above:

## Availability and performance configuration options.

| Architecture | Pros | Cons |
| :--- | :--- | :--- |
| [Single Server](https://www.notion.so/Single-Server-966858d704f84db28fc10938c52ecbf4) | Simple Set up | Low resiliency, Best Effort |
| [Internal Load Balancing](https://www.notion.so/Internal-Load-Balancing-3717244103c2428ba10cb6c2d9dd7746) | High Availability, Feature built into X-Road | Requires independent configuration and registration for each node |
| [External Load Balancing](https://www.notion.so/External-Load-Balancing-90e87293ccba4f61938402bdb47a03ea) | Offers both High Availability and High Performance \(with e.g. auto-scaling\). One-time configuration and registration for all nodes. | Initial configuration more complex. |

## Monitoring <a id="a2a0b91e-4ee9-49d3-a38b-66ca387aaf86"></a>

X-Road offers environmental and operational monitoring. The operational monitoring processes operational statistics \(such as which services have been called, how many times, what was the size of the response, etc.\) of the security servers. Operational data of the X-Road Security Servers is collected and made available for external monitoring systems \(e.g. Zabbix, Nagios\) via corresponding interfaces.

The load balancing support includes a health check service that can be used to ping the security server using HTTP to see if it is healthy and likely to be able to send and receive messages.

### Further reading <a id="3c283098-20da-47fe-b8b8-f001c663cecc"></a>

* [X-Road: Operational Monitoring Daemon Architecture](https://github.com/nordic-institute/X-Road/blob/develop/doc/OperationalMonitoring/Architecture/arc-opmond_x-road_operational_monitoring_daemon_architecture_Y-1096-1.md)
* [X-Road: External Load Balancer Installation Guide - Health check service configuration](https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/LoadBalancing/ig-xlb_x-road_external_load_balancer_installation_guide.md#34-health-check-service-configuration)

## Data Exchange <a id="d0595987-2ecb-4275-89aa-d07d62de59d2"></a>

X-Road can be integrated with information systems using multiple patterns. From X-Road’s point of view it’s enough that an information system implements the X-Road Message Protocol for SOAP or REST. When it comes to REST, you can publish existing REST services without any changes, as-is. Instead, SOAP services must support X-Road specific SOAP headers.

The X-Road metaservices can be used to retrieve lists of Service Providers, Central Services and lists of services offered by an X-Road client.

### Further reading <a id="4daaf8f9-8206-4efa-bb23-a84c6405e6b1"></a>

* [X-Road Message Protocol for REST](https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-rest_x-road_message_protocol_for_rest.md)
* [X-Road Message Protocol for SOAP](https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-mess_x-road_message_protocol.md)
* [X-Road: Service Metadata Protocol for REST](https://github.com/nordic-institute/X-Road/blob/develop/doc/Protocols/pr-mrest_x-road_service_metadata_protocol_for_rest.md)

## Installation and Upgrading <a id="950b9f07-4e8e-4ab9-a8f3-eefc1b860e06"></a>

The currently recommended installation approach, for production ready X-Road deployments, is to use Operating System specific software installation packages, which are available for the Ubuntu and RedHat Enterprise Linux Operating Systems. Specifically, Icelandic variants of those packages should be used when setting up Security Servers to be registered in the Icelandic X-Road instance _Straumurinn_ – see links below.

As a general rule, X-Road Security Servers should be no further than two releases behind the latest X-Road release.

In the currently recommended \(non-containerized\) production ready configuration, upgrading is mostly a matter of upgrading the Operation System specific X-Road packages. Manual steps may be required, such as performing a database migration. Release notes and the X-Road Knowledge Base should be studied carefully before each upgrade, especially when major releases are involved.

### Further reading <a id="4b148a7d-2554-45fc-a1dc-823bae02adbb"></a>

* [How to Set Up a Security Server?](https://confluence.niis.org/pages/viewpage.action?pageId=4292920)
  * see specifically the example upgrade commands in that parent document
* [X-Road Knowledge Base](https://confluence.niis.org/display/XRDKB/X-Road+Knowledge+Base)
* [Steps needed to install and participate in](https://github.com/digitaliceland/Straumurinn) [_Straumurinn_](https://github.com/digitaliceland/Straumurinn) [\(Icelandic X-Road environment\)](https://github.com/digitaliceland/Straumurinn)


### Further Reading <a id="d9df2a4e-368b-42d5-a7fb-d1e460848eca"></a>

* X-Road Logs Explained – [Part 1](https://www.niis.org/blog/2018/5/27/x-road-logs-basics), [Part 2](https://www.niis.org/blog/2018/6/3/x-road-logs-explained-part-2) and [Part 3](https://www.niis.org/blog/2018/6/12/x-road-logs-explained-part-3)
* [Signed Document Download and Verification Manual](https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/ug-sigdoc_x-road_signed_document_download_and_verification_manual.md)
