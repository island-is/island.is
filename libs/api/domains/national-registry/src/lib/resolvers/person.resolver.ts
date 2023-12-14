import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser, User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { AuditService } from '@island.is/nest/audit'
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
import {
  NationalIdType,
  type SharedChildCustody,
  type SharedPerson,
} from '../shared/types'
import { Housing } from '../shared/models/housing.model'
import { Name } from '../shared/models/name.model'
import { ChildCustody } from '../shared/models/childCustody.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const namespace = '@island.is/api/national-registry'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => Person)
@Audit({ namespace })
export class PersonResolver {
  constructor(
    private service: NationalRegistryService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => Person, {
    nullable: true,
  })
  @Audit()
  nationalRegistryPerson(
    @CurrentUser() user: AuthUser,
    @Args('api', { nullable: true }) api?: 'v1' | 'v3',
    @Args('useFakeData', { nullable: true }) useFakeData?: boolean,
  ): Promise<Person | null> {
    return this.service.getPerson(user.nationalId, api ?? 'v1', useFakeData)
  }

  @ResolveField('custodians', () => [Custodian], {
    nullable: true,
  })
  async resolveCustodians(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<Custodian> | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveCustodians',
      resources: user.nationalId,
    })
    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getCustodians(
        person.nationalId,
        user.nationalId,
        person,
      )
    }
    return null
  }

  @ResolveField('birthParents', () => [PersonBase], {
    nullable: true,
  })
  async resolveBirthParents(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<PersonBase> | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveBirthParents',
      resources: user.nationalId,
    })
    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getParents(person.nationalId, person, user.nationalId)
    }
    return null
  }

  @ResolveField('childCustody', () => [ChildCustody], {
    nullable: true,
  })
  async resolveChildCustody(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
    @Args('childNationalId', { nullable: true }) childNationalId?: string,
  ): Promise<Array<SharedChildCustody> | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveChildCustody',
      resources: user.nationalId,
    })

    if (
      !(person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID)
    ) {
      return null
    }

    const custodyInfo = await this.service.getChildCustody(
      person.nationalId,
      person,
    )

    if (childNationalId) {
      const child = (custodyInfo as Array<SharedChildCustody>)?.find(
        (c) => c.nationalId === childNationalId,
      )
      return child ? [child] : null
    }

    return custodyInfo as Array<SharedChildCustody>
  }

  @ResolveField('birthplace', () => Birthplace, {
    nullable: true,
  })
  async resolveBirthPlace(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Birthplace | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveBirthPlace',
      resources: person.nationalId,
    })
    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getBirthplace(person.nationalId, person)
    }
    return null
  }

  @ResolveField('housing', () => Housing, {
    nullable: true,
  })
  async resolveHousing(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Housing | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveHousing',
      resources: person.nationalId,
    })
    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getHousing(person.nationalId, person)
    }

    return null
  }

  @ResolveField('citizenship', () => Citizenship, {
    nullable: true,
  })
  async resolveCitizenship(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Citizenship | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveCitizenship',
      resources: person.nationalId,
    })
    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getCitizenship(person.nationalId, person)
    }
    return null
  }

  @ResolveField('spouse', () => Spouse, { nullable: true })
  async resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Spouse | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveSpouse',
      resources: person.nationalId,
    })

    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getSpouse(person.nationalId, person)
    }

    return null
  }

  @ResolveField('name', () => Name, { nullable: true })
  async resolveName(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Name | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveName',
      resources: person.nationalId,
    })

    if (
      person.nationalIdType === NationalIdType.NATIONAL_REGISTRY_NATIONAL_ID
    ) {
      return this.service.getName(person.nationalId, person)
    }
    return null
  }
}
