import { Module } from '@nestjs/common'
import { SignatureCollectionResolver } from './signatureCollection.resolver'
import { SignatureCollectionService } from './signatureCollection.service'

@Module({
  controllers: [],
  providers: [SignatureCollectionService, SignatureCollectionResolver],
  exports: [],
})
export class SignatureCollectionModule {}
