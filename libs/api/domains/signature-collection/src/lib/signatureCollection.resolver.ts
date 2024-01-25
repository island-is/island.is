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
import { CollectionGuard } from './guards/collection.guard'
import { CurrentCollection } from './decorators/current-collection.decorator'
import { CurrentSignee } from './decorators/signee.decorator'
import { CurrentRole } from './decorators/role.decorator'
import { UserRole, UserWithRole } from '@island.is/clients/signature-collection'

@UseGuards(IdsUserGuard, CollectionGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @UseGuards(RolesGuard)
  @RolesRules(
    UserRole.CANDIDATE_OWNER,
    UserRole.CANDIDATE_COLLECTOR,
    UserRole.USER,
    UserRole.ADMIN_PROCESSOR,
    UserRole.ADMIN_MANAGER,
  )
  @Query(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionTest(
    // @CurrentUser() user: User,
    @CurrentRole() role: UserWithRole,
  ): Promise<SignatureCollectionSuccess> {
    console.log("UserWithRole",role)
    return this.signatureCollectionService.test(role)
  }

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

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionAllLists(
    @CurrentCollection() collection: SignatureCollectionInfo,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allLists(collection)
  }

  @BypassAuth()
  @Query(() => [SignatureCollectionList])
  async signatureCollectionAllOpenLists(
    @CurrentCollection() collection: SignatureCollectionInfo,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allOpenLists(collection)
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
    return this.signatureCollectionService.listsForUser(
      collection,
      role,
      signee,
      user,
    )
  }

  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.id)
  }

  @UseGuards(RolesGuard)
  @RolesRules(UserRole.USER)
  @Query(() => SignatureCollectionList, { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList | null> {
    return this.signatureCollectionService.signedList(user.nationalId)
  }

  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionSignatures(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.id)
  }

  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSigneeLookup(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignee> {
    return this.signatureCollectionService.signee(input.id)
  }

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
    return this.signatureCollectionService.unsign(input.id, user.nationalId)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsignAdmin(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
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
    return this.signatureCollectionService.cancel(user.nationalId, input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionExtendDeadline(
    @Args('input') input: SignatureCollectionExtendDeadlineInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.extendDeadline(input)
  }

  @Mutation(() => SignatureCollectionBulk)
  @Audit()
  async signatureCollectionBulkUploadSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListBulkUploadInput,
  ): Promise<SignatureCollectionBulk> {
    return this.signatureCollectionService.bulkUploadSignatures(input)
  }

  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionBulkCompareSignaturesAllLists(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.bulkCompareSignaturesAllLists(input)
  }

  @Mutation(() => [SignatureCollectionSignature])
  @Audit()
  async signatureCollectionCompareList(
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.compareLists(input)
  }
}
