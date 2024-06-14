import { Module } from '@nestjs/common'
import { GroupsController } from './groups.controller'
import { GroupsService } from './groups.service'
import { Group } from './models/group.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
