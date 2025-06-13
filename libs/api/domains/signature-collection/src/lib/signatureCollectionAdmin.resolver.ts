import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SignatureCollectionSuccess } from './models/success.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  CurrentUser,
  ScopesGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
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
import { SignatureCollectionManagerService } from './signatureCollectionManager.service'
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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.signatureCollectionProcess)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionAdminResolver {
  constructor(
    private signatureCollectionService: SignatureCollectionAdminService,
    private signatureCollectionManagerService: SignatureCollectionManagerService,
  ) {}

  @Query(() => SignatureCollectionSuccess)
  async signatureCollectionAdminCanSignInfo(
    @CurrentUser()
    user: User,
    @Args('input') input: SignatureCollectionCanSignFromPaperInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.getCanSignInfo(
      user,
      input.signeeNationalId,
      input.listId,
      input.collectionType,
    )
  }

  @Query(() => SignatureCollection)
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  async signatureCollectionAdminCurrent(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionBaseInput,
  ): Promise<SignatureCollection> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.getLatestCollectionForType(
          user,
          input.collectionType,
        )
      : this.signatureCollectionService.getLatestCollectionForType(
          user,
          input.collectionType,
        )
  }

  @Query(() => [SignatureCollectionList])
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminLists(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList[]> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.allLists(input, user)
      : this.signatureCollectionService.allLists(input, user)
  }

  @Query(() => SignatureCollectionList)
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionList> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.list(input.listId, user)
      : this.signatureCollectionService.list(input.listId, user)
  }

  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.signatures(input.listId, user)
      : this.signatureCollectionService.signatures(input.listId, user)
  }

  @Query(() => SignatureCollectionCandidateLookUp)
  @Audit()
  async signatureCollectionAdminCandidateLookup(
    @CurrentUser() user: User,
    @Args('input')
    { nationalId, collectionType }: SignatureCollectionNationalIdInput,
  ): Promise<SignatureCollectionCandidateLookUp> {
    return this.signatureCollectionService.signee(
      nationalId,
      collectionType,
      user,
    )
  }

  @Query(() => SignatureCollectionListStatus)
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminListStatus(
    @CurrentUser() user: User,
    @Args('input') { listId }: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionListStatus> {
    return this.signatureCollectionService.listStatus(listId, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminToggleListReview(
    @CurrentUser() user: User,
    @Args('input') { listId }: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.toggleListStatus(listId, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminProcess(
    @CurrentUser() user: User,
    @Args('input') { collectionId }: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.processCollection(collectionId, user)
  }

  @Mutation(() => SignatureCollectionSlug)
  @Audit()
  async signatureCollectionAdminCreate(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    return this.signatureCollectionService.create(user, input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminRemoveCandidate(
    @CurrentUser() user: User,
    @Args('input') { candidateId }: SignatureCollectionCandidateIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.removeCandidate(candidateId, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminRemoveList(
    @CurrentUser() user: User,
    @Args('input') { listId }: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.removeList(listId, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUnsign(
    @CurrentUser() user: User,
    @Args('input') { signatureId }: SignatureCollectionSignatureIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsignAdmin(signatureId, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminExtendDeadline(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionExtendDeadlineInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.extendDeadline(input, user)
  }

  @Mutation(() => SignatureCollectionBulk)
  @Audit()
  async signatureCollectionAdminBulkUploadSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListBulkUploadInput,
  ): Promise<SignatureCollectionBulk> {
    return this.signatureCollectionService.bulkUploadSignatures(input, user)
  }

  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionAdminBulkCompareSignaturesAllLists(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.bulkCompareSignaturesAllLists(
      input,
      user,
    )
  }

  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionAdminCompareList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.compareLists(input, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUpdatePaperSignaturePageNumber(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionSignatureUpdateInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.updateSignaturePageNumber(
      user,
      input,
    )
  }

  @Query(() => [SignatureCollectionSignature])
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionSignatureLookup(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionSignatureLookupInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatureLookup(user, input)
  }

  @Query(() => SignatureCollectionAreaSummaryReport)
  @Audit()
  async signatureCollectionAreaSummaryReport(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionAreaSummaryReportInput,
  ): Promise<SignatureCollectionAreaSummaryReport> {
    return this.signatureCollectionService.getAreaSummaryReport(input, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionLockList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.lockList(input, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUploadPaperSignature(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionUploadPaperSignatureInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.uploadPaperSignature(input, user)
  }
}
