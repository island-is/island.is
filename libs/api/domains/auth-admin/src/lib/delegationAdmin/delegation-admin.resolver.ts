import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { NotFoundException, UseGuards } from '@nestjs/common'

import { DelegationAdminService } from './delegation-admin.service'
import { DelegationAdminCustomModel } from './models/delegation.model'

import {
  type User,
  CurrentUser,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import {
  Identity,
  type IdentityDataLoader,
  IdentityLoader,
} from '@island.is/api/domains/identity'
import { Loader } from '@island.is/nest/dataloader'
import { DelegationDTO } from '@island.is/auth-api-lib'
import {
  type DomainDataLoader,
  CustomDelegation,
  Domain,
  DomainLoader,
  ISLAND_DOMAIN,
} from '@island.is/api/domains/auth'
import { CreateDelegationInput } from './dto/createDelegation.input'

@UseGuards(IdsUserGuard)
@Resolver(CustomDelegation)
export class DelegationAdminResolver {
  constructor(
    private readonly delegationAdminService: DelegationAdminService,
  ) {}

  @Query(() => DelegationAdminCustomModel, { name: 'authAdminDelegationAdmin' })
  async getDelegationSystem(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
  ) {
    const delegations = await this.delegationAdminService.getDelegationAdmin(
      user,
      nationalId,
    )
    const identityCard = await identityLoader.load(nationalId)

    return {
      nationalId: nationalId,
      name: identityCard.name,
      incoming: delegations.incoming,
      outgoing: delegations.outgoing,
    }
  }

  @Mutation(() => Boolean, { name: 'authDeleteAdminDelegation' })
  async deleteDelegationSystem(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.delegationAdminService.deleteDelegationAdmin(user, id)
  }

  @Mutation(() => CustomDelegation, { name: 'authCreateDelegation' })
  async createDelegationSystem(
    @Args('input') input: CreateDelegationInput,
    @CurrentUser() user: User,
  ) {
    return this.delegationAdminService.createDelegationAdmin(user, input)
  }

  @ResolveField('from', () => Identity)
  resolveFromIdentity(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() customDelegation: DelegationDTO,
  ) {
    return identityLoader.load(customDelegation.fromNationalId)
  }

  @ResolveField('to', () => Identity)
  resolveToIdentity(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() customDelegation: DelegationDTO,
  ) {
    return identityLoader.load(customDelegation.toNationalId)
  }

  @ResolveField('createdBy', () => Identity, { nullable: true })
  resolveCreatedByIdentity(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() customDelegation: DelegationDTO,
  ) {
    if (!customDelegation.createdByNationalId) {
      return null
    }
    return identityLoader.load(customDelegation.createdByNationalId)
  }

  @ResolveField('validTo', () => Date, { nullable: true })
  resolveValidTo(@Parent() delegation: DelegationDTO): Date | undefined {
    if (!delegation.validTo) {
      return undefined
    }

    return delegation.scopes?.every(
      (scope) => scope.validTo?.toString() === delegation.validTo?.toString(),
    )
      ? delegation.validTo
      : undefined
  }

  @ResolveField('domain', () => Domain)
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() delegation: DelegationDTO,
  ): Promise<Domain> {
    if (!delegation.domainName) {
      return {
        name: '',
        displayName: '',
        description: '',
        nationalId: '',
        organisationLogoKey: '',
      }
    }

    const domainName = delegation.domainName ?? ISLAND_DOMAIN
    const domain = await domainLoader.load({
      lang: 'is',
      domain: domainName,
    })

    if (!domain) {
      throw new NotFoundException(`Could not find domain: ${domainName}`)
    }

    return domain
  }
}
