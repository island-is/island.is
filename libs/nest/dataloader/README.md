# NestJS Dataloader

> NOTE: This library is forked from [nestjs-dataloader](https://github.com/krislefeber/nestjs-dataloader) to address two issues:
>
> - [The package.json has an invalid "types" property which breaks the types.](https://github.com/krislefeber/nestjs-dataloader/pull/59)
> - [The dataloader doesn't get access to any request context variables, like the authenticated user.](https://github.com/krislefeber/nestjs-dataloader/pull/11)
>
> When these PRs are merged and released, we will switch to nestjs-dataloader.

NestJS dataloader simplifies adding [graphql/dataloader](https://github.com/graphql/dataloader) to your NestJS project. DataLoader aims to solve the common N+1 loading problem.

## Installation

Install with yarn

```bash
yarn add nestjs-dataloader
```

Install with npm

```bash
npm install --save nestjs-dataloader
```

## Usage

### NestDataLoader Creation

We start by implementing the `NestDataLoader` interface. This tells `DataLoader` how to load our objects.

```typescript
import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
...

@Injectable()
export class AccountLoader implements NestDataLoader<string, Account> {
  constructor(private readonly accountService: AccountService) { }

  generateDataLoader(): DataLoader<string, Account> {
    return new DataLoader<string, Account>(keys => this.accountService.findByIds(keys));
  }
}
```

The first generic of the interface is the type of ID the datastore uses. The second generic is the type of object that will be returned. In the above instance, we want `DataLoader` to return instances of the `Account` class.

### Providing the NestDataLoader

For each NestDataLoader we create, we need to provide it to our module.

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {DataLoaderInterceptor} from 'nestjs-dataloader'
...

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
export class ResolversModule { }
```

### Using the NestDataLoader

Now that we have a dataloader and our module is aware of it, we need to pass it as a parameter to an endpoint in our graphQL resolver.

```typescript
import * as DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
...

@Resolver(Account)
export class AccountResolver {

    @Query(() => [Account])
    public getAccounts(
        @Args({ name: 'ids', type: () => [String] }) ids: string[],
        @Loader(AccountLoader) accountLoader: DataLoader<Account['id'], Account>): Promise<Account[]> {
        return accountLoader.loadMany(ids);
    }
}
```

The important thing to note is that the parameter of the `@Loader` decorator is the entity/class of the `NestDataLoader` we want to be injected to the method. The DataLoader library will handle bulk retrieval and caching of our requests. Note that the caching is stored on a per-request basis.

## Contributing

Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to change.
