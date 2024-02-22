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
import { SignatureCollectionIdInput } from './dto/id.input'
import { SignatureCollectionSignature } from './models/signature.model'
import {
  SignatureCollectionListNationalIdsInput,
  SignatureCollectionNationalIdsInput,
} from './dto/signatureListNationalIds.input'
import { SignatureCollectionBulk } from './models/bulk.model'
import { SignatureCollectionCandidateLookUp } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'
import { Audit } from '@island.is/nest/audit'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import { CollectionGuard } from './guards/collection.guard'
import { CurrentCollection } from './decorators/current-collection.decorator'
import { SignatureCollectionAdminService } from './signatureCollectionAdmin.service'
import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  SignatureCollectionListStatus,
  SignatureCollectionStatus,
} from './models/status.model'
import { SignatureCollectionManagerService } from './signatureCollectionManager.service'

@UseGuards(IdsUserGuard, CollectionGuard, ScopesGuard)
@Scopes(AdminPortalScope.signatureCollectionProcess)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionAdminResolver {
  constructor(
    private signatureCollectionService: SignatureCollectionAdminService,
    private signatureCollectionManagerService: SignatureCollectionManagerService,
  ) {}

  @Query(() => SignatureCollection)
  async signatureCollectionAdminCurrent(
    @CurrentCollection() collection: SignatureCollection,
  ): Promise<SignatureCollection> {
    return collection
  }

  @Query(() => [SignatureCollectionList])
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminLists(
    @CurrentUser() user: User,
    @CurrentCollection() collection: SignatureCollection,
  ): Promise<SignatureCollectionList[]> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.allLists(collection, user)
      : this.signatureCollectionService.allLists(collection, user)
  }

  @Query(() => SignatureCollectionList)
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.list(input.id, user)
      : this.signatureCollectionService.list(input.id, user)
  }

  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.signatures(input.id, user)
      : this.signatureCollectionService.signatures(input.id, user)
  }

  @Query(() => SignatureCollectionCandidateLookUp)
  @Audit()
  async signatureCollectionAdminCandidateLookup(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionCandidateLookUp> {
    return this.signatureCollectionService.signee(input.id, user)
  }

  @Query(() => SignatureCollectionStatus)
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminStatus(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionStatus> {
    const isManager = user.scope.includes(
      AdminPortalScope.signatureCollectionManage,
    )
    return isManager
      ? this.signatureCollectionManagerService.collectionStatus(user)
      : this.signatureCollectionService.collectionStatus(user)
  }

  @Query(() => SignatureCollectionListStatus)
  @Scopes(
    AdminPortalScope.signatureCollectionManage,
    AdminPortalScope.signatureCollectionProcess,
  )
  @Audit()
  async signatureCollectionAdminListStatus(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionListStatus> {
    return this.signatureCollectionService.listStatus(input.id, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminToggleListReview(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.toggleListStatus(input.id, user)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminProcess(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.processCollection(user)
  }

  @Mutation(() => SignatureCollectionSlug)
  @Audit()
  async signatureCollectionAdminCreate(
    @CurrentUser() user: User,
    @CurrentCollection() collection: SignatureCollection,
    @Args('input') input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    return this.signatureCollectionService.create(user, input, collection.id)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAdminUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsignAdmin(input.id, user)
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
}
