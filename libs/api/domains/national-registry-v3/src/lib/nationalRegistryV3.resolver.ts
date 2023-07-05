import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
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
import { Person } from './graphql/models/nationalRegistryPerson.model'
import { ChildGuardianship } from './graphql/models/nationalRegistryChildGuardianship.model'
import { ChildGuardianshipInput } from './graphql/dto/nationalRegistryChildGuardianshipInput'
import { Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { Address } from './graphql/models/nationalRegistryAddress.model'
import { Birthplace } from './graphql/models/nationalRegistryBirthplace.model'
import { Residence } from './graphql/models/nationalRegistryResidence.model'
import { Citizenship } from './graphql/models/nationalRegistryCitizenship.model'
import { Name } from './graphql/models/nationalRegistryName.model'
import { Religion } from './graphql/models/nationalRegistryReligion.model'
import { NationalRegistryV3Service } from './nationalRegistryV3.service'
import { DomicilePopulace } from './graphql/models/nationalRegistryDomicilePopulace.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => Person)
@Audit({ namespace: '@island.is/api/national-registry-v3' })
export class NationalRegistryV3Resolver {
  constructor(private nationalRegistryV3Service: NationalRegistryV3Service) {}

  @Query(() => Person, {
    name: 'nationalRegistryUserV3',
    nullable: true,
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<Person | null> {
    return this.nationalRegistryV3Service.getNationalRegistryPerson(
      user.nationalId,
    )
  }

  @Query(() => ChildGuardianship, {
    name: 'nationalRegistryUserV3ChildGuardianship',
    nullable: true,
  })
  @Audit()
  async childGuardianship(
    @Context('req') { user }: { user: User },
    @Args('input') input: ChildGuardianshipInput,
  ): Promise<ChildGuardianship | null> {
    return this.nationalRegistryV3Service.getChildGuardianship(
      user,
      input.childNationalId,
    )
  }

  @ResolveField('children', () => [Person], {
    nullable: true,
  })
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: Person,
  ): Promise<Array<Person> | null> {
    if (person.nationalId !== user.nationalId) {
      return null
    }
    return this.nationalRegistryV3Service.getChildren(user.nationalId)
  }

  @ResolveField('parents', () => [Person], {
    nullable: true,
  })
  @Audit()
  async resolveParents(
    @Context('req') { user }: { user: User },
    @Parent() person: Person,
  ): Promise<Array<Person> | null> {
    if (person.nationalId !== user.nationalId) {
      return null
    }
    return this.nationalRegistryV3Service.getParents(user.nationalId)
  }

  @ResolveField('residenceHistory', () => [Residence], {
    nullable: true,
  })
  @Audit()
  async resolveResidenceHistory(
    @Context('req') { user }: { user: User },
    @Parent() person: Person,
  ): Promise<Array<NationalRegistryV3Service> | null> {
    /*return this.nationalRegistryV3Service.getNationalRegistryResidenceHistory(
      person.nationalId,
    )*/
    return null
  }

  @ResolveField('birthplace', () => Birthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() person: Person,
  ): Promise<Birthplace | null> {
    return this.nationalRegistryV3Service.getBirthplace(person.nationalId)
  }

  @ResolveField('citizenship', () => Citizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() person: Person,
  ): Promise<Citizenship | null> {
    return this.nationalRegistryV3Service.getCitizenship(person.nationalId)
  }

  @ResolveField('spouse', () => Spouse, { nullable: true })
  @Audit()
  async resolveSpouse(@Parent() person: Person): Promise<Spouse | null> {
    return this.nationalRegistryV3Service.getSpouse(person.nationalId)
  }

  @ResolveField('address', () => Address, { nullable: true })
  @Audit()
  async resolveAddress(@Parent() person: Person): Promise<Address | null> {
    return this.nationalRegistryV3Service.getAddress(person.nationalId)
  }

  @ResolveField('name', () => Name, { nullable: true })
  @Audit()
  async resolveName(@Parent() person: Person): Promise<Name | null> {
    return this.nationalRegistryV3Service.getName(person.nationalId)
  }

  @ResolveField('religion', () => Religion, {
    nullable: true,
  })
  @Audit()
  async resolveReligion(@Parent() person: Person): Promise<Religion | null> {
    return this.nationalRegistryV3Service.getReligion(person.nationalId)
  }

  @ResolveField('domicilePopulace', () => DomicilePopulace, {
    nullable: true,
  })
  @Audit()
  async resolveLegalDomicilePopulace(
    @Parent() person: Person,
  ): Promise<DomicilePopulace | null> {
    return this.nationalRegistryV3Service.getDomicilePopulace(person.nationalId)
  }
}
