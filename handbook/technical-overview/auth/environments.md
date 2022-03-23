# Environments

The IAS has the three environments but SPs SHOULD generally only integrate with the production and staging environments.

You should only need the issuer URI (sometimes called authority) for your integration, everything else can be configured automatically with Open ID Discovery. If you need to find other endpoints (eg authorization, token, userinfo and jwks) you can find them in the OpenID Configuration.

### Production

> **Issuer:** [https://innskra.island.is/](https://innskra.island.is/) > **OpenID Configuration:** [https://innskra.island.is/.well-known/openid-configuration](https://innskra.island.is/.well-known/openid-configuration) > **Users:** Real

The production environment is meant for SPs in production. It does not authenticate fake users.

### Staging

> **Issuer:** [https://identity-server.staging01.devland.is/](https://identity-server.staging01.devland.is/) > **OpenID Configuration:** [https://identity-server.staging01.devland.is/.well-known/openid-configuration](https://identity-server.staging01.devland.is/.well-known/openid-configuration) > **Users:** Real and fake

The staging environment SHOULD be used when developing and testing an IAS integration.

### Development

> **Issuer:** [https://identity-server.dev01.devland.is/](https://identity-server.dev01.devland.is/) > **OpenID Configuration:** [https://identity-server.dev01.devland.is/.well-known/openid-configuration](https://identity-server.dev01.devland.is/.well-known/openid-configuration) > **Users:** Real and fake

The development environment is used internally at [Island.is](http://Island.is) to develop and test new functionality.

{% hint style="info" %}

SPs SHOULD NOT integrate with the development environment directly. Your development environment SHOULD integrate with the staging environment of IAS instead.

{% endhint %}
