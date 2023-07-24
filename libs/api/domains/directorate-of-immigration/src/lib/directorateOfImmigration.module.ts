import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { DirectorateOfImmigrationApi } from './directorateOfImmigration.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
  ],
  providers: [MainResolver, DirectorateOfImmigrationApi],
  exports: [DirectorateOfImmigrationApi],
})
export class DirectorateOfImmigrationApiModule {}
