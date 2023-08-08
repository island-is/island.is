import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser, User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
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
  Citizenship,
  Custodian,
  Person,
  PersonBase,
  Spouse,
} from '../shared/models'
import { NationalRegistryService } from '../nationalRegistry.service'
import type { SharedPerson } from '../shared/types'
import { Housing } from '../shared/models/housing.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Name } from '../shared/models/name.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => Person)
@Audit({ namespace: '@island.is/api/national-registry' })
export class PersonResolver {
  constructor(
    private service: NationalRegistryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => Person, {
    nullable: true,
    name: 'nationalRegistryPerson',
  })
  @Audit()
  async nationalRegistryPerson(
    @CurrentUser() user: AuthUser,
    @Args('api', { nullable: true }) api?: 'v1' | 'v3',
  ): Promise<Person | null> {
    const person = await this.service.getPerson(user.nationalId, api ?? 'v1')
    return person
  }

  @ResolveField('custodians', () => [Custodian], {
    nullable: true,
  })
  @Audit()
  async resolveCustodians(
    @Parent() person: SharedPerson,
  ): Promise<Array<Custodian> | null> {
    return this.service.getCustodians(person.nationalId, person)
  }

  @ResolveField('birthParents', () => [PersonBase], {
    nullable: true,
  })
  @Audit()
  async resolveBirthParents(
    @Parent() person: SharedPerson,
  ): Promise<Array<PersonBase> | null> {
    return this.service.getParents(person.nationalId, person)
  }

  @ResolveField('childCustody', () => [Person], {
    nullable: true,
  })
  @Audit()
  async resolveChildCustody(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<SharedPerson> | null> {
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
    return this.service.getBirthplace(person.nationalId, person)
  }

  @ResolveField('housing', () => Housing, {
    nullable: true,
  })
  @Audit()
  async resolveHousing(
    @Parent() person: SharedPerson,
  ): Promise<Housing | null> {
    return this.service.getHousing(person.nationalId, person)
  }

  @ResolveField('citizenship', () => Citizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() person: SharedPerson,
  ): Promise<Citizenship | null> {
    return this.service.getCitizenship(person.nationalId, person)
  }

  @ResolveField('spouse', () => Spouse, { nullable: true })
  @Audit()
  async resolveSpouse(@Parent() person: SharedPerson): Promise<Spouse | null> {
    return this.service.getSpouse(person.nationalId, person)
  }

  @ResolveField('name', () => Name, { nullable: true })
  @Audit()
  async resolveName(@Parent() person: SharedPerson): Promise<Name| null> {
    return this.service.getName(person.nationalId, person)
  }
}
