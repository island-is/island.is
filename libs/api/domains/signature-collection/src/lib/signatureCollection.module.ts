import { Module } from '@nestjs/common'
import { SignatureCollectionResolver } from './signatureCollection.resolver'

@Module({
  controllers: [],
  providers: [SignatureCollectionResolver],
  exports: [],
})
export class SignatureCollectionModule {}
