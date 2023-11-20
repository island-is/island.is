import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Success } from './models/success.model'
import { SignatureCollectionService } from './signatureCollection.service'
import type { User as AuthUser, User } from '@island.is/auth-nest-tools'
import {
  IdsAuthGuard,
  IdsUserGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Collection } from './models/collection.model'
import { SignatureList } from './models/signatureList.model'
import { IdInput } from './dto/id.input'
import { Signature } from './models/signature.model'
import { SignatureListNationalIdsInput } from './dto/signatureListNationalIds.input'
import { Bulk } from './models/bulk.model'
import { Signee } from './models/signee.model'
import { SignatureListInput } from './dto/singatureList.input'
import { FindSignatureInput } from './dto/findSignature.input'

@UseGuards(IdsAuthGuard, IdsUserGuard)
@Resolver()
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Query(() => Success)
  signatureCollectionTest(): Promise<Success> {
    return this.signatureCollectionService.test()
  }
  //   signatureCollectionIsOwner
  @Query(() => Success)
  async signatureCollectionIsOwner(
    @CurrentUser() user: User,
  ): Promise<Success> {
    return this.signatureCollectionService.isOwner(user.nationalId)
  }

  //   signatureCollectionCanCreate
  @Query(() => Success)
  async signatureCollectionCanCreate(
    @CurrentUser() user: User,
  ): Promise<Success> {
    return this.signatureCollectionService.canCreate(user.nationalId)
  }

  //   signatureCollectionCanSign
  @Query(() => Success)
  async signatureCollectionCanSign(
    @CurrentUser() user: User,
  ): Promise<Success> {
    return this.signatureCollectionService.canSign(user.nationalId)
  }

  //   signatureCollectionCurrent
  @Query(() => Collection)
  async signatureCollectionCurrent(): Promise<Collection> {
    return this.signatureCollectionService.current()
  }

  //   signatureCollectionAllLists
  @Query(() => [SignatureList])
  async signatureCollectionAllLists(): Promise<SignatureList[]> {
    return this.signatureCollectionService.allLists()
  }

  //   signatureCollectionAllOpenLists
  @Query(() => [SignatureList])
  async signatureCollectionAllOpenLists(): Promise<SignatureList[]> {
    return this.signatureCollectionService.allOpenLists()
  }

  //   signatureCollectionListsByOwner
  //   TODO: Can take in owner parameter?
  @Query(() => [SignatureList])
  async signatureCollectionListsByOwner(
    @CurrentUser() user: User,
  ): Promise<SignatureList[]> {
    return this.signatureCollectionService.listsByOwner(user.nationalId)
  }

  //   signatureCollectionListsByArea
  @Query(() => [SignatureList])
  async signatureCollectionListsByArea(
    @Args('input') input: IdInput,
  ): Promise<SignatureList[]> {
    return this.signatureCollectionService.listsByArea(input.id)
  }

  //   signatureCollectionList
  @Query(() => SignatureList)
  async signatureCollectionList(
    @Args('input') input: IdInput,
  ): Promise<SignatureList> {
    return this.signatureCollectionService.list(input.id)
  }

  //   signatureCollectionSignedList
  //   TODO: If none found what should we return
  @Query(() => SignatureList, { nullable: true })
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureList | null> {
    return this.signatureCollectionService.signedList(user.nationalId)
  }

  //   signatureCollectionSignatures
  @Query(() => [Signature], { nullable: true })
  async signatureCollectionSignatures(
    @Args('input') input: IdInput,
  ): Promise<Signature[]> {
    return this.signatureCollectionService.signatures(input.id)
  }
  //   signatureCollectionFindSignature
  @Query(() => Signature, { nullable: true })
  async signatureCollectionFindSignature(
    @Args('input') input: FindSignatureInput,
  ): Promise<Signature | null> {
    return this.signatureCollectionService.findSignature(input)
  }

  //   signatureCollectionCompareLists
  @Query(() => Bulk)
  async signatureCollectionCompareLists(
    @Args('input') input: SignatureListNationalIdsInput,
  ): Promise<Bulk | null> {
    return this.signatureCollectionService.compareLists(input)
  }

  //   signatureCollectionSignee
  @Query(() => Signee)
  async signatureCollectionSignee(@CurrentUser() user: User): Promise<Signee> {
    return this.signatureCollectionService.signee(user.nationalId)
  }

  //   signatureCollectionCreate
  @Mutation(() => Success)
  async signatureCollectionCreate(
    @CurrentUser() user: User,
    @Args('input') input: SignatureListInput,
  ): Promise<Success> {
    return this.signatureCollectionService.create(input)
  }
  //   signatureCollectionSign
  @Mutation(() => Success)
  async signatureCollectionSign(
    @CurrentUser() user: User,
    @Args('input') input: IdInput,
  ): Promise<Success> {
    return this.signatureCollectionService.sign(input.id)
  }

  //   signatureCollectionUnsign
  @Mutation(() => Success)
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: IdInput,
  ): Promise<Success> {
    return this.signatureCollectionService.unsign(input.id)
  }

  //   signatureCollectionCancel
  @Mutation(() => Success)
  async signatureCollectionCancel(@CurrentUser() user: User): Promise<Success> {
    return this.signatureCollectionService.cancel(user.nationalId)
  }

  //   signatureCollectionDelegateList
  @Mutation(() => Success)
  async signatureCollectionDelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureListNationalIdsInput,
  ): Promise<Success> {
    return this.signatureCollectionService.delegateList(input)
  }

  //   signatureCollectionUndelegateList
  @Mutation(() => Success)
  async signatureCollectionUndelegateList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureListNationalIdsInput,
  ): Promise<Success> {
    return this.signatureCollectionService.undelegateList(input)
  }
  //   signatureCollectionExtendDeadline

  //   signatureCollectionBulkUploadSignatures
  @Mutation(() => Bulk)
  async signatureCollectionBulkUploadSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureListNationalIdsInput,
  ): Promise<Bulk> {
    return this.signatureCollectionService.bulkUploadSignatures(input)
  }
}