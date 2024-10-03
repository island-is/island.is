# NestJS Dataloader Documentation

> **Note:** This library is a fork of [nestjs-dataloader](https://github.com/krislefeber/nestjs-dataloader) to solve two issues:
>
> - The `package.json` has an invalid "types" property, affecting the types. [See Issue](https://github.com/krislefeber/nestjs-dataloader/pull/59)
> - The dataloader lacks access to request context variables, like the authenticated user. [See Issue](https://github.com/krislefeber/nestjs-dataloader/pull/11)
>
> Once these pull requests are merged and released, we will switch back to `nestjs-dataloader`.

NestJS dataloader simplifies integrating [graphql/dataloader](https://github.com/graphql/dataloader) into your NestJS project. DataLoader addresses the common N+1 loading problem.

## Installation

### Using Yarn

```bash
yarn add nestjs-dataloader
```

### Using npm

```bash
npm install --save nestjs-dataloader
```

## Usage

### Creating a NestDataLoader

Start by implementing the `NestDataLoader` interface to define how `DataLoader` loads your objects.

```typescript
import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';

@Injectable()
export class AccountLoader implements NestDataLoader<string, Account> {
  constructor(private readonly accountService: AccountService) {}

  generateDataLoader(): DataLoader<string, Account> {
    return new DataLoader<string, Account>(keys => this.accountService.findByIds(keys));
  }
}
```

The first generic specifies the type of ID used by the datastore, and the second generic specifies the type of object returned. Here, `DataLoader` returns instances of the `Account` class.

### Providing a NestDataLoader

For each `NestDataLoader` created, you need to provide it to your module.

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader';

@Module({
  providers: [
    AccountResolver,
    AccountLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class ResolversModule {}
```

### Using a NestDataLoader

With a dataloader created and provided to your module, pass it to a method in your GraphQL resolver.

```typescript
import * as DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

@Resolver(Account)
export class AccountResolver {

  @Query(() => [Account])
  public getAccounts(
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
    @Loader(AccountLoader) accountLoader: DataLoader<Account['id'], Account>
  ): Promise<Account[]> {
    return accountLoader.loadMany(ids);
  }
}
```

The `@Loader` decorator parameter is the `NestDataLoader` entity/class to be injected into the method. The DataLoader library handles bulk retrieval and caching of requests, with caching stored per request.

## Contributing

Pull requests are always welcome. For major changes, please open an issue first to discuss proposed modifications.