import { Args, Query, Resolver } from '@nestjs/graphql'
import { DocumentService } from './documents.service'
import { DocumentInfoResult } from '../models/documentInfoResult.model'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { Audit } from '@island.is/nest/audit'

@Resolver(() => DocumentInfoResult)
@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.consultationPortalApplication)
@Audit({ namespace: '@island.is/samradsgatt' })
export class DocumentResolver {
  constructor(private documentService: DocumentService) {}

  @Query(() => [DocumentInfoResult], { name: 'consultationPortalDocument' })
  async getCaseDocument(@Args('documentId') documentId: string): Promise<void> {
    return this.documentService.getCaseDocument(documentId)
  }
}
