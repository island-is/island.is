import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollectionService } from './signatureCollection.service'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  CurrentUser,
  BypassAuth,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import {
  SignatureCollection,
  SignatureCollectionInfo,
} from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionIdInput } from './dto/id.input'
import { SignatureCollectionSignature } from './models/signature.model'
import {
  SignatureCollectionListNationalIdsInput,
  SignatureCollectionNationalIdsInput,
} from './dto/signatureListNationalIds.input'
import { SignatureCollectionBulk } from './models/bulk.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'
import { Audit } from '@island.is/nest/audit'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import { RolesGuard } from './guards/roles.guard'
import { RolesRules } from './decorators/roles-rules.decorator'
import { UserRole } from './utils/role.types'
import { CollectionGuard } from './guards/collection.guard'
import { CurrentCollection } from './decorators/current-collection.decorator'
import { CurrentSignee } from './decorators/signee.decorator'
import { CurrentRole } from './decorators/role.decorator'

@UseGuards(IdsUserGuard, CollectionGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Query(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionIsOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.isOwner(signee)
  }

  @BypassAuth()
  @Query(() => SignatureCollection)
  async signatureCollectionCurrent(
    @CurrentCollection() collection: SignatureCollectionInfo,
  ): Promise<SignatureCollection> {
    return this.signatureCollectionService.current(collection.id)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_MANAGER, UserRole.ADMIN_PROCESSOR)
  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionAllLists(): Promise<SignatureCollectionList[]> {
    // TODO: Admin endpoint
    return this.signatureCollectionService.allLists()
  }

  @BypassAuth()
  @Query(() => [SignatureCollectionList])
  async signatureCollectionAllOpenLists(): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allOpenLists()
  }

  @UseGuards(RolesGuard)
  @RolesRules(
    UserRole.CANDIDATE_OWNER,
    UserRole.CANDIDATE_COLLECTOR,
    UserRole.USER,
  )
  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsForUser(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @CurrentCollection() collection: SignatureCollectionInfo,
    @CurrentRole() role: UserRole,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    // TODO: map params here to send in
    console.log('params', signee, collection, role)
    return this.signatureCollectionService.listsForUser(
      user.nationalId,
      collection,
      role,
      signee,
    )
  }

  @UseGuards(RolesGuard)
  @RolesRules(
    UserRole.ADMIN_MANAGER,
    UserRole.ADMIN_PROCESSOR,
    UserRole.CANDIDATE_OWNER,
    UserRole.CANDIDATE_COLLECTOR,
  )
  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    // TODO: Access guard state and role
    return this.signatureCollectionService.list(input.id)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.USER)
  @Query(() => SignatureCollectionList, { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList | null> {
    // TODO: Use signature from decorator
    return this.signatureCollectionService.signedList(user.nationalId)
  }

  @UseGuards(RolesGuard)
  @RolesRules(
    UserRole.ADMIN_MANAGER,
    UserRole.ADMIN_PROCESSOR,
    UserRole.CANDIDATE_OWNER,
    UserRole.CANDIDATE_COLLECTOR,
  )
  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionSignatures(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    // TODO: Collection id
    // TODO: Access guard state and role
    return this.signatureCollectionService.signatures(input.id)
  }

  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_MANAGER, UserRole.ADMIN_PROCESSOR)
  @Mutation(() => SignatureCollectionSlug)
  @Audit()
  async signatureCollectionCreate(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    // Admins will only use as mutation, users will use client directly
    return this.signatureCollectionService.create(user, input)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.USER)
  @Mutation(() => SignatureCollectionSignature)
  @Audit()
  async signatureCollectionSign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature> {
    // TODO: is this used?
    return this.signatureCollectionService.sign(input.id, user.nationalId)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.USER)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    // TODO: role and state NO DELEGATION HERE
    return this.signatureCollectionService.unsign(input.id, user.nationalId)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_MANAGER, UserRole.ADMIN_PROCESSOR)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsignAdmin(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    // TODO: role and state
    return this.signatureCollectionService.unsignAdmin(input.id)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.CANDIDATE_OWNER)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionCancel(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    // TODO: role and state owner not delegated while open
    return this.signatureCollectionService.cancel(user.nationalId, input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionDelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    // TODO: Will this happen here or in interceptor...
    return this.signatureCollectionService.delegateList(input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUndelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    // TODO: check if used
    return this.signatureCollectionService.undelegateList(input)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_PROCESSOR)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionExtendDeadline(
    @Args('input') input: SignatureCollectionExtendDeadlineInput,
  ): Promise<SignatureCollectionSuccess> {
    // TODO: state and role
    return this.signatureCollectionService.extendDeadline(input)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_PROCESSOR)
  @Mutation(() => SignatureCollectionBulk)
  @Audit()
  async signatureCollectionBulkUploadSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListBulkUploadInput,
  ): Promise<SignatureCollectionBulk> {
    // TODO: state and role
    return this.signatureCollectionService.bulkUploadSignatures(input)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_PROCESSOR)
  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionBulkCompareSignaturesAllLists(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    // TODO: state and role
    return this.signatureCollectionService.bulkCompareSignaturesAllLists(input)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.ADMIN_PROCESSOR)
  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionCompareList(
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    // TODO: state and role
    return this.signatureCollectionService.compareLists(input)
  }
}
