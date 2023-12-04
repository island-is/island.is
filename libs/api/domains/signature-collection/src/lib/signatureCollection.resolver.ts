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
import { SignatureCollectionNationalIdsInput } from './dto/signatureListNationalIds.input'
import { SignatureCollectionBulk } from './models/bulk.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import { SignatureCollectionFindSignatureInput } from './dto/findSignature.input'
import { SignatureCollectionAreaInput } from './dto/area.input'

@UseGuards(IdsUserGuard)
@Resolver()
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Query(() => SignatureCollectionSuccess)
  signatureCollectionTest(): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.test()
  }
  @Query(() => SignatureCollectionSuccess)
  async signatureCollectionIsOwner(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.isOwner(user.nationalId)
  }

  @Query(() => SignatureCollectionSuccess)
  async signatureCollectionCanCreate(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.canCreate(user.nationalId)
  }

  @Query(() => SignatureCollectionSuccess)
  async signatureCollectionCanSign(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.canSign(user.nationalId)
  }

  @Query(() => SignatureCollection)
  async signatureCollectionCurrent(): Promise<SignatureCollection> {
    return this.signatureCollectionService.current()
  }

  @Query(() => [SignatureCollectionList])
  async signatureCollectionAllLists(): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allLists()
  }
  @BypassAuth()
  @Query(() => [SignatureCollectionList])
  async signatureCollectionAllOpenLists(): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allOpenLists()
  }

  //   TODO: Can take in owner parameter?
  @Query(() => [SignatureCollectionList])
  async signatureCollectionListsByOwner(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsByOwner(user.nationalId)
  }

  @Query(() => [SignatureCollectionList])
  async signatureCollectionListsByArea(
    @Args('input') input: SignatureCollectionAreaInput,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsByArea(input.areaId)
  }

  @Query(() => SignatureCollectionList)
  async signatureCollectionList(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.id)
  }

  //   TODO: If none found what should we return
  @Query(() => SignatureCollectionList, { nullable: true })
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList | null> {
    return this.signatureCollectionService.signedList(user.nationalId)
  }

  @Query(() => [SignatureCollectionSignature], { nullable: true })
  async signatureCollectionSignatures(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.id)
  }
  @Query(() => SignatureCollectionSignature, { nullable: true })
  async signatureCollectionFindSignature(
    @Args('input') input: SignatureCollectionFindSignatureInput,
  ): Promise<SignatureCollectionSignature | null> {
    return this.signatureCollectionService.findSignature(input)
  }

  @Query(() => SignatureCollectionBulk)
  async signatureCollectionCompareLists(
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionBulk | null> {
    return this.signatureCollectionService.compareLists(input)
  }

  @Query(() => SignatureCollectionSignee)
  async signatureCollectionSignee(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSignee> {
    return this.signatureCollectionService.signee(user.nationalId)
  }

  @Mutation(() => SignatureCollectionSuccess)
  async signatureCollectionCreate(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.create(input)
  }
  @Mutation(() => SignatureCollectionSuccess)
  async signatureCollectionSign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.sign(input.id)
  }

  @Mutation(() => SignatureCollectionSuccess)
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsign(input.id)
  }

  @Mutation(() => SignatureCollectionSuccess)
  async signatureCollectionCancel(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.cancel(user.nationalId)
  }

  @Mutation(() => SignatureCollectionSuccess)
  async signatureCollectionDelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.delegateList(input)
  }

  @Mutation(() => SignatureCollectionSuccess)
  async signatureCollectionUndelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.undelegateList(input)
  }
  //   TODO: signatureCollectionExtendDeadline

  @Mutation(() => SignatureCollectionBulk)
  async signatureCollectionBulkUploadSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionBulk> {
    return this.signatureCollectionService.bulkUploadSignatures(input)
  }
}
