# Security checklist

This checklist defines requirements that Skjalaveita web services need to fulfill before a connection to the Ísland.is Pósthólf can take place. The purpose of this checklist is to prevent possible security issues when web services are implemented.

## Transport layer

All communication is encoded using HTTPS (TLS 1.2+). Web servers certificate is issued by a trusted certificate authority (not self signed).

- [ ] Communication is encoded on a server that supports TLS 1.2+.
- [ ] Certificates are issued by a trusted certificate authority.

## Authorization

The web service is implemented with OAuth 2.0, where an access token is verified against the authentication server's signed credentials. The web service also validates a scope and the token's expiration date. The web service is not accessible by any other means.

- [ ] The web service is only accessible with OAuth 2.0.
- [ ] The web service validates that the access token is signed by the authorization service.
- [ ] Authorization is only given when the correct scope is in the access token.
- [ ] An expired access token is rejected when used.

## Tokens

The Skjalaveita production environment only trusts tokens that are issued by the Ísland.is production authentication server. The Ísland.is test environment uses a different authentication server and is never be trusted in production.

- [ ] The production environment only trust the Ísland.is production authentication server.

## Access restriction

The web service's network layer is closed and only accessible by the IP addresses that the Ísland.is Pósthólf uses to query the service.

- [ ] The web service is only accessible by IP addresses that the Ísland.is Pósthólf uses.

## Form validation

An input hsa to be sanitized to avoid possible injections, the correct format is also ensured.

- [ ] The web service returns an error if the input is empty (i.e the nationalId or documentId is empty).
- [ ] The web service returns an error if the nationalId is incorrectly formatted.
- [ ] The web service returns an error if the documentId is not in the correct format. The format is determined by the Skjalaveita.
- [ ] The web service is protected against injections. https://www.owasp.org/index.php/Top_10-2017_A1-Injection

## Data input validation

When the Ísland.is Pósthólf retrieves a document from a Skjalaveita, it sends a nationalId and documentId pair. The Skjalaveita validates that the document is owned by the given nationalId. The document is not returned solely based on the documentId.

- [ ] The web service validates the nationalId and documentId pair with the document before it is returned.

## Logging

The web service logs all requests. The log contains the nationalId, documentId and when the document was requested.

- [ ] Requests are logged.
