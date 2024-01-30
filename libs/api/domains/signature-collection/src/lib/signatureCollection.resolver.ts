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
import {
  SignatureCollection,
  SignatureCollectionInfo,
} from './models/collection.model'
import {
  SignatureCollectionList,
  SignatureCollectionListBase,
} from './models/signatureList.model'
import { SignatureCollectionIdInput } from './dto/id.input'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { Audit } from '@island.is/nest/audit'
import { NeedsOwnerGuard } from './guards/needsOwner.guard'
import { NeedsOwner, OwnerAccess } from './decorators/needsOwner.decorator'
import { CollectionGuard } from './guards/collection.guard'
import { CurrentCollection } from './decorators/current-collection.decorator'
import { CurrentSignee } from './decorators/signee.decorator'
import { ApiScope } from '@island.is/auth/scopes'
@UseGuards(IdsUserGuard, CollectionGuard, ScopesGuard, NeedsOwnerGuard)
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
  async signatureCollectionCurrent(
    @CurrentCollection() collection: SignatureCollectionInfo,
  ): Promise<SignatureCollection> {
    return this.signatureCollectionService.current(collection.id)
  }

  @BypassAuth()
  @Query(() => [SignatureCollectionListBase])
  async signatureCollectionAllOpenLists(
    @CurrentCollection() collection: SignatureCollectionInfo,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.allOpenLists(collection)
  }

  @Scopes(ApiScope.signatureCollection)
  @NeedsOwner(OwnerAccess.AllowActor)
  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsForOwner(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @CurrentCollection() collection: SignatureCollectionInfo,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsForOwner(
      collection,
      signee,
      user,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => [SignatureCollectionListBase])
  @Audit()
  async signatureCollectionListsForUser(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @CurrentCollection() collection: SignatureCollectionInfo,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionListBase[]> {
    return this.signatureCollectionService.listsForUser(
      collection,
      signee,
      user,
    )
  }

  @Scopes(ApiScope.signatureCollection)
  @NeedsOwner(OwnerAccess.AllowActor)
  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.id, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionList, { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList | null> {
    return this.signatureCollectionService.signedList(user)
  }

  @Scopes(ApiScope.signatureCollection)
  @NeedsOwner(OwnerAccess.AllowActor)
  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.id, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @Scopes(ApiScope.signatureCollection)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsign(input.id, user)
  }

  @Scopes(ApiScope.signatureCollection)
  @NeedsOwner(OwnerAccess.RestrictActor)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionCancel(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.cancel(input, user)
  }
}
