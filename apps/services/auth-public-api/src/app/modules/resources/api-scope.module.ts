import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApiScope, ResourcesService } from '@island.is/auth-api-lib'
import { ApiScopeController } from './api-scope.controller'

@Module({
  imports: [SequelizeModule.forFeature([ApiScope])],
  controllers: [ApiScopeController],
  providers: [ResourcesService],
})
export class ApiScopeModule {}
