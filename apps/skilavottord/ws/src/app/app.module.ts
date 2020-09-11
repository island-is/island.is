/*import { Module } from '@nestjs/common'

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
      },*/
//      typePaths: ['../**/*.graphql'],
/*      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    }),
    ItemModule,
  ],
})*/

import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
//import { CmsModule } from '@island.is/api/domains/cms'

//import { AuthModule, UserModule, DiscountModule, FlightModule } from './modules'
//import { BackendAPI } from '../services'
import { UserModule, CarModule } from './modules'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/skilavottord/ws/src/app/api.graphql',
      //     path: '/api/graphql',
      //     context: ({ req }) => ({ req })
    }),
    UserModule,
    CarModule,
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
