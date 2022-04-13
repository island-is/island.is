# Terminology

## Requirements Notation

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this documentation are to be interpreted as described in [RFC 2119](https://openid.net/specs/openid-connect-core-1_0.html#RFC2119).

## Terms

The IAS documentation uses the following terms:

**Access Token**

Access tokens are Credentials used to access protected resources. Access tokens issued by IAS are **[JSON Web Tokens (JWTs)](https://openid.net/specs/openid-connect-core-1_0.html#JWT)** signed with the [RS256 algorithm](https://datatracker.ietf.org/doc/html/rfc7518#section-3).

**Claim**

Piece of information asserted about an Entity.

**Client**

An application making protected resource requests on behalf of a resource owner (such as a user).

**Credential**

Data presented as evidence of the right to use an identity or other resources.

**End-User**

Human participant.

**Entity**

Something that has a separate and distinct existence and that can be identified in a context. An End-User is one example of an Entity.

**ID Token**

**[JWT](https://openid.net/specs/openid-connect-core-1_0.html#JWT)** that contains Claims about an Authentication. It MAY contain other Claims.

**Issuer**

Entity that issues a set of Claims.

**JSON Web Token (JWT)**

JSON Web Token (JWT) is a compact, URL-safe means of representing Claims to be transferred between two parties.

**Refresh Token**

Refresh tokens are Credentials used to obtain Access Tokens.

**Resource Owner**

An entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an End-User.

**Resource Server**

A server hosting protected resources, usually in the form of an API. Capable of accepting and responding to protected resource requests using Access Tokens.
