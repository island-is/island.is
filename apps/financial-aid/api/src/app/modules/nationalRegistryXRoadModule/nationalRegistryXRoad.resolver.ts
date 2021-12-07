import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent, Context } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { Person } from './models/person.model'
import { UserSpouse } from './models/userSpouse.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes('@skra.is/individuals')
@Resolver(() => Person)
@Audit({ namespace: '@island.is/api/national-registry-x-road' })
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => Person, {
    name: 'municipalityNationalRegistryUserV2',
    nullable: true,
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<Person | undefined> {
    console.log('heeeer')
    return this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user,
      user.nationalId,
    )
  }

  @ResolveField('spouse', () => UserSpouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: Person,
  ): Promise<UserSpouse | undefined> {
    return await this.nationalRegistryXRoadService.getSpouse(
      user,
      person.nationalId,
    )
  }
}
