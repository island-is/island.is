import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollectionService } from './signatureCollection.service'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  CurrentUser,
  BypassAuth,
  ScopesGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { UserAccessGuard } from './guards/userAccess.guard'
import { ApiScope } from '@island.is/auth/scopes'
import {
  SignatureCollectionAddListsInput,
  SignatureCollectionCancelListsInput,
  SignatureCollectionCanSignFromPaperInput,
  SignatureCollectionIdInput,
  SignatureCollectionListIdInput,
  SignatureCollectionUploadPaperSignatureInput,
} from './dto'
import { AllowManager, CurrentSignee, IsOwner } from './decorators'
import {
  SignatureCollection,
  SignatureCollectionCollector,
  SignatureCollectionList,
  SignatureCollectionListBase,
  SignatureCollectionSignature,
  SignatureCollectionSignedList,
  SignatureCollectionSignee,
} from './models'
import { SignatureCollectionListSummary } from './models/areaSummaryReport.model'
import { SignatureCollectionSignatureUpdateInput } from './dto/signatureUpdate.input'
import { SignatureCollectionBaseInput } from './dto/signatureCollectionBase.input'

@UseGuards(IdsUserGuard, ScopesGuard, UserAccessGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionSuccess)
  @AllowManager()
  @Audit()
  async signatureCollectionIsOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') _input: SignatureCollectionBaseInput,
  ): Promise<SignatureCollectionSuccess> {
    return { success: signee.isOwner }
  }

  @BypassAuth()
  @Query(() => [SignatureCollection])
  async signatureCollectionCurrent(
    @Args('input') input: SignatureCollectionBaseInput,
  ): Promise<SignatureCollection[]> {
    return this.signatureCollectionService.currentCollection(
      input?.collectionType,
    )
  }

  @BypassAuth()
  @Query(() => SignatureCollection)
  async signatureCollectionLatestForType(
    @Args('input') input: SignatureCollectionBaseInput,
  ) {
    return this.signatureCollectionService.getLatestCollectionForType(
      input.collectionType,
    )
  }

  @BypassAuth()
  @Query(() => [SignatureCollectionListBase])
  async signatureCollectionAllOpenLists(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.allOpenLists(input)
  }

  @Scopes(ApiScope.signatureCollection)
  @AllowManager()
  @IsOwner()
  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsForOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') input: SignatureCollectionIdInput,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsForOwner(input, signee, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => [SignatureCollectionListBase])
  @Audit()
  async signatureCollectionListsForUser(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') input: SignatureCollectionIdInput,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.listsForUser(input, signee, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @CurrentUser() user: User,
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.listId, user, signee)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => [SignatureCollectionSignedList], { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @Args('input') input: SignatureCollectionBaseInput,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSignedList[] | null> {
    return this.signatureCollectionService.signedList(
      user,
      input.collectionType,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.listId, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') _input: SignatureCollectionBaseInput,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => Boolean)
  @IsOwner()
  @AllowManager()
  @Audit()
  async signatureCollectionCanSignFromPaper(
    @Args('input') input: SignatureCollectionCanSignFromPaperInput,
    @CurrentUser() user: User,
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<boolean> {
    return await this.signatureCollectionService.canSignFromPaper(
      user,
      input,
      signee,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsign(
      input.listId,
      user,
      input.collectionType,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionCancel(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionCancelListsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.cancel(input, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAddAreas(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionAddListsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.add(input, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUploadPaperSignature(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionUploadPaperSignatureInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.candidacyUploadPaperSignature(
      input,
      user,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Query(() => [SignatureCollectionCollector])
  @Audit()
  async signatureCollectionCollectors(
    @CurrentUser() user: User,
    @CurrentSignee() signee: SignatureCollectionSignee,
    @Args('input') _input: SignatureCollectionBaseInput,
  ): Promise<SignatureCollectionCollector[]> {
    return this.signatureCollectionService.collectors(
      user,
      signee.candidate?.id,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Query(() => SignatureCollectionListSummary)
  @Audit()
  async signatureCollectionListOverview(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionListSummary> {
    return this.signatureCollectionService.listOverview(user, input.listId)
  }

  @Scopes(ApiScope.signatureCollection)
  @IsOwner()
  @AllowManager()
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUpdatePaperSignaturePageNumber(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionSignatureUpdateInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.updateSignaturePageNumber(
      user,
      input,
    )
  }
}
