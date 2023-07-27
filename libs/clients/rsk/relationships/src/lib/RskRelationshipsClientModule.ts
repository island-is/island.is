import { Module } from '@nestjs/common'
import { RskRelationshipsConfigurationProvider } from './apiConfiguration'
import { RskRelationshipsClient } from './RskRelationshipsClient'

@Module({
  providers: [RskRelationshipsClient, RskRelationshipsConfigurationProvider],
  exports: [RskRelationshipsClient],
})
export class RskRelationshipsClientModule {}
