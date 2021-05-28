# Auth Scopes

This library was generated to contain scope defnitions in one central place for the repo.

## Scope naming rules

Scope names should conform to the following pattern:

```
'@<Comapny or Organisation identifier>/<Service name>/<Optionally module name>:<Access name>'
```

### Examples

#### Without module name segment:

```
'@island.is/user-profile:read'
'@island.is/user-profile:write'
```

#### With module name segment:

```
'@island.is/documents/document-provider:read'
'@island.is/documents/document-provider:write'
```
