import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SignatureList } from './signatureList.model'
import { SignatureListController } from './signatureList.controller'
import { SignatureListService } from './signatureList.service'

@Module({
  imports: [SequelizeModule.forFeature([SignatureList])],
  controllers: [SignatureListController],
  providers: [SignatureListService],
})
export class SignatureListModule {}
