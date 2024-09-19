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
import { SignatureCollection } from './models/collection.model'
import {
  SignatureCollectionList,
  SignatureCollectionListBase,
  SignatureCollectionSignedList,
} from './models/signatureList.model'
import { SignatureCollectionListIdInput } from './dto/listId.input'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { Audit } from '@island.is/nest/audit'
import { IsOwnerGuard } from './guards/userAccess.guard'
import { IsOwner } from './decorators/isOwner.decorator'
import { CurrentSignee } from './decorators/signee.decorator'
import { ApiScope } from '@island.is/auth/scopes'
import { SignatureCollectionCancelListsInput } from './dto/cencelLists.input'
import { SignatureCollectionIdInput } from './dto/collectionId.input'
import { SignatureCollectionCanSignInput } from './dto/canSign.input'
import { SignatureCollectionAddListsInput } from './dto/addLists.input'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionUploadPaperSignatureInput } from './dto/uploadPaperSignature.input'
import {
  DelegationTypeGuard,
  UserDelegationContext,
} from './guards/delegationGuards.guard'
import { DelegationRequirement } from './decorators/delegationType.decorator'

// TODO: clean up imports by having an index file with shared exports

@UseGuards(IdsUserGuard, ScopesGuard, IsOwnerGuard, DelegationTypeGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionIsOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSuccess> {
    return { success: signee.isOwner }
  }

  @BypassAuth()
  @Query(() => SignatureCollection)
  async signatureCollectionCurrent(): Promise<SignatureCollection> {
    return this.signatureCollectionService.currentCollection()
  }

  @BypassAuth()
  @Query(() => [SignatureCollectionListBase])
  async signatureCollectionAllOpenLists(
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.allOpenLists(input)
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(OwnerAccess.AllowActor)
  @IsOwner()
  @DelegationRequirement(UserDelegationContext.AllowAll)
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
  //@AccesRequirement(UserAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
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
  //@AccessRequirement(OwnerAccess.AllowActor)
  @IsOwner()
  @DelegationRequirement(UserDelegationContext.AllowAll)
  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.listId, user)
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(UserAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
  @Query(() => [SignatureCollectionSignedList], { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSignedList[] | null> {
    return this.signatureCollectionService.signedList(user)
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(OwnerAccess.AllowActor)
  @IsOwner()
  @DelegationRequirement(UserDelegationContext.AllowAll)
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
  //@AccessRequirement(UserAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => Boolean)
  //@AccessRequirement(OwnerAccess.AllowActor)
  @IsOwner()
  @DelegationRequirement(UserDelegationContext.AllowAll)
  @Audit()
  async signatureCollectionCanSign(
    @Args('input') input: SignatureCollectionCanSignInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return (
      await this.signatureCollectionService.signee(user, input.signeeNationalId)
    ).canSign
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(UserAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionListIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsign(input.listId, user)
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(OwnerAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionCancel(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionCancelListsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.cancel(input, user)
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(OwnerAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionAddAreas(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionAddListsInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.add(input, user)
  }

  @Scopes(ApiScope.signatureCollection)
  //@AccessRequirement(OwnerAccess.RestrictActor)
  @IsOwner()
  @DelegationRequirement(
    UserDelegationContext.Person,
    UserDelegationContext.ProcurationHolder,
  )
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
}
