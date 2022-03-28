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
import { Person } from './models/person.model'
import { UserSpouse } from './models/userSpouse.model'
import { MunicipalityNationalRegistryService } from './municipalityNationalRegistry.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes('@samband.is/internal')
@Resolver(() => Person)
@Audit({ namespace: '@island.is/api/national-registry-x-road' })
export class MunicipalityNationalRegistryResolver {
  constructor(
    private municipalityNationalRegistryService: MunicipalityNationalRegistryService,
  ) {}

  @Query(() => Person, {
    name: 'municipalityNationalRegistryUserV2',
    nullable: true,
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<Person | undefined> {
    return this.municipalityNationalRegistryService.getNationalRegistryPerson(
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
    return await this.municipalityNationalRegistryService
      .getSpouse(user, person.nationalId)
      .then((res) => {
        return res
      })
      .catch(() => {
        return undefined
      })
  }
}
