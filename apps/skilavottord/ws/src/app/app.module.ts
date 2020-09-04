import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
//import { join } from 'path'
import { ItemModule } from '../item/item.module'

@Module({
  imports: [
    GraphQLModule.forRoot({
      definitions: {
        path: 'apps/skilavottord/ws/src/graphql.schema.d.ts',
        outputAs: 'class',
      },
      typePaths: ['../**/*.graphql'],
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    }),
    ItemModule,
  ],
})

/*@Module({
  imports: [GraphQLModule.forRoot({debug: false, playground: false, }), ],
  controllers: [AppController],
  providers: [AppService],
})*/

//export class AppModule {}

//import { Module } from '@nestjs/common';
//import { GraphQLModule } from '@nestjs/graphql';
//imports: [GraphQLModule.forRoot({debug: false, playground: false, }), ],
export class AppModule {}
