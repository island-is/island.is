import { Module } from '@nestjs/common'
import { SignatureCollectionResolver } from './signatureCollection.resolver'
import { SignatureCollectionService } from './signatureCollection.service'

@Module({
  providers: [SignatureCollectionService, SignatureCollectionResolver],
})
export class SignatureCollectionModule {}
