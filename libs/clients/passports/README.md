# Passports

This library was generated with [Nx](https://nx.dev).

## How to Use

### Generate the Client

To generate the client, run the following command:

```sh
yarn nx run clients-passports:codegen/backend-client
```

### Usage

1. **Import the `PassportsClientModule`** within the desired service.

   ```typescript
   import { PassportsClientModule } from '@island.is/clients/passports'

   @Module({
     imports: [PassportsClientModule],
   })
   export class SomeModule {}
   ```

2. **Inject the `IdentityDocumentApi`** into your constructor.

   ```typescript
   import { IdentityDocumentApi } from '@island.is/clients/passports'

   @Injectable()
   export class SomeService {
     constructor(private passportsApi: IdentityDocumentApi) {}
   }
   ```

3. **Use the API with authentication middleware**.

   ```typescript
   private getPassportsWithAuth(auth: Auth) {
       return this.passportsApi.withMiddleware(new AuthMiddleware(auth));
   }
   ```

4. **Access the service with authentication**.

   ```typescript
   async function fetchPassport(auth: Auth) {
     const passportResponse = await this.getPassportsWithAuth(
       auth,
     ).identityDocumentGetIdentityDocument({
       personId: '1234567890',
     })

     console.log('passportResponse', passportResponse)
   }
   ```

## Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), run the following command:

```sh
nx test clients-passports
```
