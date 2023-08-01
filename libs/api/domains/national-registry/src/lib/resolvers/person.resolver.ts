import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser, User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  Birthplace,
  ChildCustody,
  Citizenship,
  Custodian,
  Person,
  PersonBase,
  Spouse,
} from '../shared/models'
import { NationalRegistryService } from '../nationalRegistry.service'
import { SharedPerson } from '../shared/types'
import { Housing } from '../shared/models/housing.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => Person)
@Audit({ namespace: '@island.is/api/national-registry' })
export class PersonResolver {
  constructor(private service: NationalRegistryService) {}

  @Query(() => Person, {
    nullable: true,
    name: 'nationalRegistryPerson',
  })
  @Audit()
  async nationalRegistryPerson(
    @CurrentUser() user: AuthUser,
    @Args('api', { nullable: true }) api?: 'v1' | 'v3',
  ): Promise<Person | null> {
    return this.service.getPerson(user.nationalId, api ?? 'v1')
  }

  @ResolveField('custodians', () => [Custodian], {
    nullable: true,
  })
  @Audit()
  async resolveCustodians(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<Custodian> | null> {
    if (user.nationalId !== person.nationalId) {
      return null
    }

    return this.service.getCustodians(person.nationalId)
  }

  @ResolveField('birthParents', () => [PersonBase], {
    nullable: true,
  })
  @Audit()
  async resolveBirthParents(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<PersonBase> | null> {
    if (user.nationalId !== person.nationalId) {
      return null
    }

    return this.service.getParents(person.nationalId)
  }

  @ResolveField('childCustody', () => [ChildCustody], {
    nullable: true,
  })
  @Audit()
  async resolveChildCustody(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<ChildCustody> | null> {
    if (user.nationalId !== person.nationalId) {
      return null
    }

    return this.service.getChildCustody(person.nationalId, person)
  }

  @ResolveField('birthplace', () => Birthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() person: SharedPerson,
  ): Promise<Birthplace | null> {
    return this.service.getBirthplace(person.nationalId)
  }

  @ResolveField('housing', () => Housing, {
    nullable: true,
  })
  @Audit()
  async resolveHousing(
    @Parent() person: SharedPerson,
  ): Promise<Housing | null> {
    return this.service.getHousing(person.nationalId)
  }

  @ResolveField('citizenship', () => Citizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() person: SharedPerson,
  ): Promise<Citizenship | null> {
    return this.service.getCitizenship(person.nationalId)
  }

  @ResolveField('spouse', () => Spouse, { nullable: true })
  @Audit()
  async resolveSpouse(@Parent() person: SharedPerson): Promise<Spouse | null> {
    return this.service.getSpouse(person.nationalId)
  }
}
