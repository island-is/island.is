import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Gdpr, GdprService } from './models'
import { GdprResolver } from './gdpr.resolver'
// import { GdprService } from './models'

@Module({
  imports: [SequelizeModule.forFeature([Gdpr])],
  providers: [GdprResolver, GdprService],
})
export class GdprModule {}

// @Module({
//   imports: [SequelizeModule.forFeature([GdprModel])],
//   providers: [GdprResolver, GdprService],
//   exports: [GdprService],
// })
// export class GdprModule {}
