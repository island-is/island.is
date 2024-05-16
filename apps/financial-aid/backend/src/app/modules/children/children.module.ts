import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ChildrenModel } from './models'
import { ChildrenService } from './children.service'

@Module({
  imports: [SequelizeModule.forFeature([ChildrenModel])],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
