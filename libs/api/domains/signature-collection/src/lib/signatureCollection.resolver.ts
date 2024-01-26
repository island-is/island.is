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
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionIdInput } from './dto/id.input'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { Audit } from '@island.is/nest/audit'
import { RolesGuard } from './guards/roles.guard'
import { IsOwner, OwnerAccess } from './decorators/isOwner.decorator'
import { CollectionGuard } from './guards/collection.guard'
import { CurrentCollection } from './decorators/current-collection.decorator'
import { CurrentSignee } from './decorators/signee.decorator'
import { ApiScope } from '@island.is/auth/scopes'
@UseGuards(IdsUserGuard, CollectionGuard, ScopesGuard, RolesGuard)
@Scopes(ApiScope.signatureCollection)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionResolver {
  constructor(private signatureCollectionService: SignatureCollectionService) {}

  @Query(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionTest(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.test(user)
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

  @BypassAuth()
  @Query(() => [SignatureCollectionList])
  async signatureCollectionAllOpenLists(
    @CurrentCollection() collection: SignatureCollectionInfo,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allOpenLists(collection)
  }

  @IsOwner(OwnerAccess.AllowActor)
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

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionListsForUser(
    @CurrentSignee() signee: SignatureCollectionSignee,
    @CurrentCollection() collection: SignatureCollectionInfo,
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.listsForUser(
      collection,
      signee,
      user,
    )
  }

  @IsOwner(OwnerAccess.AllowActor)
  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.id, user)
  }

  @Query(() => SignatureCollectionList, { nullable: true })
  @Audit()
  async signatureCollectionSignedList(
    @CurrentUser() user: User,
  ): Promise<SignatureCollectionList | null> {
    return this.signatureCollectionService.signedList(user)
  }

  @IsOwner(OwnerAccess.AllowActor)
  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.id, user)
  }

  @Query(() => SignatureCollectionSignee)
  @Audit()
  async signatureCollectionSignee(
    @CurrentSignee() signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSignee> {
    return signee
  }

  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionUnsign(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.unsign(input.id, user)
  }

  @IsOwner(OwnerAccess.RestrictActor)
  @Mutation(() => SignatureCollectionSuccess)
  @Audit()
  async signatureCollectionCancel(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return this.signatureCollectionService.cancel(input, user)
  }
}
