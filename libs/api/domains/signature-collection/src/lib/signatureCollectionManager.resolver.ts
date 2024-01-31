import { Args, Query, Resolver } from '@nestjs/graphql'
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
import { Audit } from '@island.is/nest/audit'
import { CollectionGuard } from './guards/collection.guard'
import { CurrentCollection } from './decorators/current-collection.decorator'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { SignatureCollectionManagerService } from './signatureCollectionManager.service'

@UseGuards(IdsUserGuard, CollectionGuard, ScopesGuard)
@Scopes(AdminPortalScope.signatureCollectionManage)
@Resolver()
@Audit({ namespace: '@island.is/api/signature-collection' })
export class SignatureCollectionManagerResolver {
  constructor(
    private signatureCollectionService: SignatureCollectionManagerService,
  ) {}

  @Query(() => SignatureCollection)
  async signatureCollectionManagerCurrent(
    @CurrentCollection() collection: SignatureCollection,
  ): Promise<SignatureCollection> {
    return collection
  }

  @Query(() => [SignatureCollectionList])
  @Audit()
  async signatureCollectionManagerLists(
    @CurrentUser() user: User,
    @CurrentCollection() collection: SignatureCollection,
  ): Promise<SignatureCollectionList[]> {
    return this.signatureCollectionService.allLists(collection, user)
  }

  @Query(() => SignatureCollectionList)
  @Audit()
  async signatureCollectionManagerList(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionList> {
    return this.signatureCollectionService.list(input.id, user)
  }

  @Query(() => [SignatureCollectionSignature], { nullable: true })
  @Audit()
  async signatureCollectionManagerSignatures(
    @CurrentUser() user: User,
    @Args('input') input: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSignature[]> {
    return this.signatureCollectionService.signatures(input.id, user)
  }
}
