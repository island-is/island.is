import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { GdprModel } from './gdpr.model'
import { GdprResolver } from './gdpr.resolver'
import { GdprService } from './gdpr.service'

@Module({
  imports: [SequelizeModule.forFeature([GdprModel])],
  providers: [GdprResolver, GdprService],
})
export class GdprModule {}
