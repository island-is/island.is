import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { GdprService } from './gdpr.service'
import { GdprModel } from './gdpr.model'
import { GdprResolver } from './gdpr.resolver'

@Module({
  imports: [SequelizeModule.forFeature([GdprModel])],
  providers: [GdprResolver, GdprService],
})
export class GdprModule {}
