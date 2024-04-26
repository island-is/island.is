# Passports

This library was generated with [Nx](https://nx.dev).

## How to use

### Generate the client:

```sh
yarn nx run clients-passports:codegen/backend-client
```

### Usage

- Import the `PassportsClientModule` within the service of choice.

```
import { PassportsClientModule } from '@island.is/clients/passports'

@Module({
    ...,
        imports: [PassportsClientModule],
    ...,
})
```

- Pass in the IdentityDocumentApi

```
import { IdentityDocumentApi } from '@island.is/clients/passports'

constructor(
    private passportsApi: IdentityDocumentApi,
)
```

- Use with auth middleware

```
  private getPassportsWithAuth(auth: Auth) {
    return this.passportsApi.withMiddleware(new AuthMiddleware(auth))
  }
```

- Now you can access the service with authentication

```
const passportResponse = await this.getPassportsWithAuth(
        auth,
        )
        .identityDocumentGetIdentityDocument({
            personId: '1234567890',
        })

console.log('passportResponse', passportResponse)
```

## Running unit tests

Run `nx test clients-passports` to execute the unit tests via [Jest](https://jestjs.io).
