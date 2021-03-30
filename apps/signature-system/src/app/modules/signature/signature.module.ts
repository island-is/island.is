import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Signature } from './signature.model'
import { SignatureController } from './signature.controller'
import { SignatureService } from './signature.service'

@Module({
  imports: [SequelizeModule.forFeature([Signature])],
  controllers: [SignatureController],
  providers: [SignatureService],
})
export class SignatureModule {}
