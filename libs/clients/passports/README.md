# Passports

This library was generated with [Nx](https://nx.dev).

## How to Use

### Generate the Client

```sh
yarn nx run clients-passports:codegen/backend-client
```

### Usage

1. **Import the `PassportsClientModule` in your service:**

   ```typescript
   import { PassportsClientModule } from '@island.is/clients/passports';

   @Module({
       imports: [PassportsClientModule],
   })
   ```

2. **Inject the `IdentityDocumentApi`:**

   ```typescript
   import { IdentityDocumentApi } from '@island.is/clients/passports';

   constructor(
       private passportsApi: IdentityDocumentApi,
   ) {}
   ```

3. **Use with Auth Middleware:**

   ```typescript
   private getPassportsWithAuth(auth: Auth) {
     return this.passportsApi.withMiddleware(new AuthMiddleware(auth));
   }
   ```

4. **Access the Service with Authentication:**

   ```typescript
   const passportResponse = await this.getPassportsWithAuth(
     auth,
   ).identityDocumentGetIdentityDocument({
     personId: '1234567890',
   })

   console.log('passportResponse', passportResponse)
   ```

## Running Unit Tests

Execute `nx test clients-passports` to run unit tests via [Jest](https://jestjs.io).
