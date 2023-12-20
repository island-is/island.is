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
import { SignatureCollection } from './models/collection.model'
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
import { SignatureCollectionAreaInput } from './dto/area.input'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'
import { Audit } from '@island.is/nest/audit'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'

@UseGuards(IdsUserGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Query(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionIsOwner(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.isOwner(user.nationalId)
  }

  // @Query(() => SignatureCollectionSuccess)
  // @Audit()
  // async signatureCollectionCanCreate(
  //   @CurrentUser() user: User,
  // ): Promise<SignatureCollectionSuccess> {
  //   return this.signatureCollectionService.canCreate(user.nationalId)
  // }

  // @Query(() => SignatureCollectionSuccess)
  // @Audit()
  // async signatureCollectionCanSign(
  //   @CurrentUser() user: User,
  // ): Promise<SignatureCollectionSuccess> {
  //   return this.signatureCollectionService.canSign(user.nationalId)
  // }

  @Query(() => SignatureCollection)
  @Audit()
  async signatureCollectionCurrent(): Promise<SignatureCollection> {
    return this.signatureCollectionService.current()
  }

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionAllLists(): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allLists()
  }
  @BypassAuth()
  @Query(() => [SignatureCollectionList])
  async signatureCollectionAllOpenLists(): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allOpenLists()
  }

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsForUser(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsForUser(user.nationalId)
  }

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsByArea(
    @Args('input') input: SignatureCollectionAreaInput,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsByArea(input.areaId)
  }

  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.id)
  }

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
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSignee> {
    return this.signatureCollectionService.signee(user.nationalId)
  }

  @Mutation(() => String)
  @Audit()
  async signatureCollectionCreate(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListInput,
  ): Promise<string> {
    return this.signatureCollectionService.create(user, input)
  }

  @Mutation(() => SignatureCollectionSignature)
  @Audit()
  async signatureCollectionSign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature> {
    return this.signatureCollectionService.sign(input.id, user.nationalId)
  }

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
  async signatureCollectionDelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.delegateList(input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUndelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.undelegateList(input)
  }

  @Mutation(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionExtendDeadline(
    @Args('input') input: SignatureCollectionExtendDeadlineInput,
  ): Promise<SignatureCollectionList> {
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
