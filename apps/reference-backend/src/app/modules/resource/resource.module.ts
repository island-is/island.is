import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Resource } from './resource.model'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'
import { AuthZModule } from '../authz/authz.module'
import { AuthNModule } from '../authn/authn.module'

@Module({
  imports: [SequelizeModule.forFeature([Resource]), AuthNModule, AuthZModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
