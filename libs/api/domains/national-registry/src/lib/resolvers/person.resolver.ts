import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser, User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
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
import type { SharedPerson } from '../shared/types'
import { Housing } from '../shared/models/housing.model'
import { Name } from '../shared/models/name.model'
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
  ): Promise<Person | null> {
    return this.service.getPerson(user.nationalId, api ?? 'v1')
  }

  @ResolveField('custodians', () => [Custodian], {
    nullable: true,
  })
  resolveCustodians(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<Custodian> | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveCustodians',
        resources: user.nationalId,
      },

      this.service.getCustodians(person.nationalId, user.nationalId, person),
    )
  }

  @ResolveField('birthParents', () => [PersonBase], {
    nullable: true,
  })
  resolveBirthParents(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Array<PersonBase> | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveBirthParents',
        resources: user.nationalId,
      },
      this.service.getParents(person.nationalId, person, user.nationalId),
    )
  }

  @ResolveField('childCustody', () => [Person], {
    nullable: true,
  })
  async resolveChildCustody(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
    @Args('childNationalId', { nullable: true }) childNationalId?: string,
  ): Promise<Array<SharedPerson> | null> {
    if (user.nationalId !== person.nationalId) {
      //might be unnecessary, but better safe than sorry
      return Promise.reject('User and person being queried do not match')
    }

    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveChildCustody',
      resources: user.nationalId,
    })

    const custodyInfo = await this.service.getChildCustody(
      person.nationalId,
      person,
    )

    if (!custodyInfo) {
      return []
    }

    const singleChild = (custodyInfo as SharedPerson[]).find(
      (c) => c.nationalId === childNationalId,
    )

    return singleChild ? [singleChild as SharedPerson] : custodyInfo
  }

  @ResolveField('birthplace', () => Birthplace, {
    nullable: true,
  })
  async resolveBirthPlace(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Birthplace | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveBirthPlace',
        resources: person.nationalId,
      },
      this.service.getBirthplace(person.nationalId, person),
    )
  }

  @ResolveField('housing', () => Housing, {
    nullable: true,
  })
  resolveHousing(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Housing | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveHousing',
        resources: person.nationalId,
      },
      this.service.getHousing(person.nationalId, person),
    )
  }

  @ResolveField('citizenship', () => Citizenship, {
    nullable: true,
  })
  resolveCitizenship(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Citizenship | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveCitizenship',
        resources: person.nationalId,
      },
      this.service.getCitizenship(person.nationalId, person),
    )
  }

  @ResolveField('spouse', () => Spouse, { nullable: true })
  resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Spouse | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveSpouse',
        resources: person.nationalId,
      },
      this.service.getSpouse(person.nationalId, person),
    )
  }

  @ResolveField('name', () => Name, { nullable: true })
  resolveName(
    @Context('req') { user }: { user: User },
    @Parent() person: SharedPerson,
  ): Promise<Name | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'resolveName',
        resources: person.nationalId,
      },
      this.service.getName(person.nationalId, person),
    )
  }
}
