import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Resource } from './resource.model'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

@Module({
  imports: [SequelizeModule.forFeature([Resource])],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
