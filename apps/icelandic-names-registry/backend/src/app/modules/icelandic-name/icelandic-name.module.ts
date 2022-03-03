import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IcelandicNameController } from './icelandic-name.controller'
import { IcelandicName } from './icelandic-name.model'
import { IcelandicNameService } from './icelandic-name.service'

@Module({
  imports: [SequelizeModule.forFeature([IcelandicName])],
  controllers: [IcelandicNameController],
  providers: [IcelandicNameService],
})
export class IcelandicNameModule {}
