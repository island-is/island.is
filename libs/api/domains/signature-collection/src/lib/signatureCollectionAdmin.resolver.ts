import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SignatureCollectionSuccess } from './models/success.model'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { SignatureCollection } from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionListIdInput } from './dto/listId.input'
import { SignatureCollectionSignature } from './models/signature.model'
import {
  SignatureCollectionListNationalIdsInput,
  SignatureCollectionNationalIdsInput,
} from './dto/signatureListNationalIds.input'
import { SignatureCollectionBulk } from './models/bulk.model'
import { SignatureCollectionCandidateLookUp } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadline.input'
import { Audit } from '@island.is/nest/audit'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import { SignatureCollectionAdminService } from './signatureCollectionAdmin.service'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { SignatureCollectionListStatus } from './models/status.model'
import { SignatureCollectionNationalIdInput } from './dto/nationalId.input'
import { SignatureCollectionSignatureIdInput } from './dto/signatureId.input'
import { SignatureCollectionIdInput } from './dto/collectionId.input'
import { SignatureCollectionCandidateIdInput } from './dto/candidateId.input'
import { SignatureCollectionCanSignFromPaperInput } from './dto/canSignFromPaper.input'
import { SignatureCollectionSignatureUpdateInput } from './dto/signatureUpdate.input'
import { SignatureCollectionSignatureLookupInput } from './dto/signatureLookup.input'
import { SignatureCollectionAreaSummaryReportInput } from './dto/areaSummaryReport.input'
import { SignatureCollectionAreaSummaryReport } from './models/areaSummaryReport.model'
import { SignatureCollectionUploadPaperSignatureInput } from './dto/uploadPaperSignature.input'
import { SignatureCollectionBaseInput } from './dto/signatureCollectionBase.input'
import { SignatureCollectionAreaInput } from './dto'
import { CurrentAdmin } from './decorators'
import { SignatureCollectionAdmin } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(
  AdminPortalScope.signatureCollectionProcess,
  AdminPortalScope.signatureCollectionManage,
  AdminPortalScope.signatureCollectionMunicipality,
)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionAdminResolver {
  constructor(
    private signatureCollectionService: SignatureCollectionAdminService,
  ) {}

  @Query(() => SignatureCollectionSuccess)
  async signatureCollectionAdminCanSignInfo(
    @CurrentAdmin()
    admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionCanSignFromPaperInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.getCanSignInfo(
      admin,
      input.signeeNationalId,
      input.listId,
      input.collectionType,
    )
  }

  @Query(() => SignatureCollection)
  async signatureCollectionAdminCurrent(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionBaseInput,
  ): Promise<SignatureCollection> {
    return this.signatureCollectionService.getLatestCollectionForType(
      admin,
      input.collectionType,
    )
  }

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionAdminLists(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allLists(input, admin)
  }

  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionAdminList(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.listId, admin)
  }

  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionAdminSignatures(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.listId, admin)
  }

  @Query(() => SignatureCollectionCandidateLookUp)
  @Audit()
  async signatureCollectionAdminCandidateLookup(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input')
    { nationalId, collectionType }: SignatureCollectionNationalIdInput,
  ): Promise<SignatureCollectionCandidateLookUp> {
    return this.signatureCollectionService.signee(
      nationalId,
      collectionType,
      admin,
    )
  }

  @Query(() => SignatureCollectionListStatus)
  @Audit()
  async signatureCollectionAdminListStatus(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { listId }: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionListStatus> {
    return this.signatureCollectionService.listStatus(listId, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminToggleListReview(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { listId }: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.toggleListStatus(listId, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminProcess(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { collectionId }: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.processCollection(
      collectionId,
      admin,
    )
  }

  @Mutation(() => SignatureCollectionSlug)
  @Audit()
  async signatureCollectionAdminCreate(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    return this.signatureCollectionService.create(admin, input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminRemoveCandidate(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { candidateId }: SignatureCollectionCandidateIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.removeCandidate(candidateId, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminRemoveList(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { listId }: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.removeList(listId, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUnsign(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { signatureId }: SignatureCollectionSignatureIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsignAdmin(signatureId, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminExtendDeadline(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionExtendDeadlineInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.extendDeadline(input, admin)
  }

  @Mutation(() => SignatureCollectionBulk)
  @Audit()
  async signatureCollectionAdminBulkUploadSignatures(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionListBulkUploadInput,
  ): Promise<SignatureCollectionBulk> {
    return this.signatureCollectionService.bulkUploadSignatures(input, admin)
  }

  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionAdminBulkCompareSignaturesAllLists(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.bulkCompareSignaturesAllLists(
      input,
      admin,
    )
  }

  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionAdminCompareList(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.compareLists(input, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUpdatePaperSignaturePageNumber(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionSignatureUpdateInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.updateSignaturePageNumber(
      admin,
      input,
    )
  }

  @Query(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionSignatureLookup(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionSignatureLookupInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatureLookup(admin, input)
  }

  @Query(() => SignatureCollectionAreaSummaryReport)
  @Audit()
  async signatureCollectionAreaSummaryReport(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionAreaSummaryReportInput,
  ): Promise<SignatureCollectionAreaSummaryReport> {
    return this.signatureCollectionService.getAreaSummaryReport(input, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionLockList(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.lockList(input, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUploadPaperSignature(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') input: SignatureCollectionUploadPaperSignatureInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.uploadPaperSignature(input, admin)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminStartMunicipalityCollection(
    @CurrentAdmin() admin: SignatureCollectionAdmin,
    @Args('input') { areaId }: SignatureCollectionAreaInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.startMunicipalityCollection(
      admin,
      areaId,
    )
  }
}
