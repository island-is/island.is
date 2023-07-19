import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Person } from './models/nationalRegistryPerson.model'
import { Spouse, formatSpouse } from './models/nationalRegistrySpouse.model'
import { Address, formatAddress } from './models/nationalRegistryAddress.model'
import {
  Birthplace,
  formatBirthplace,
} from './models/nationalRegistryBirthplace.model'
import {
  Citizenship,
  formatCitizenship,
} from './models/nationalRegistryCitizenship.model'
import { Name, formatName } from './models/nationalRegistryName.model'
import {
  Religion,
  formatReligion,
} from './models/nationalRegistryReligion.model'
import { NationalRegistryV3Service } from './nationalRegistryV3.service'

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
  async nationalRegistryPerson(
    @CurrentUser() user: User,
  ): Promise<Person | null> {
    return this.nationalRegistryV3Service.getNationalRegistryPerson(
      user.nationalId,
    )
  }
  /*
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
*/
  /*
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
*/
  /*
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
    return this.nationalRegistryV3Service.getNationalRegistryResidenceHistory(
      person.nationalId,
    )
    return null
  }
  */

  @ResolveField('birthplace', () => Birthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() person: Person,
  ): Promise<Birthplace | null> {
    if (person.rawData) {
      return formatBirthplace(person.rawData.faedingarstadur)
    }
    return this.nationalRegistryV3Service.getBirthplace(person.nationalId)
  }

  @ResolveField('citizenship', () => Citizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() person: Person,
  ): Promise<Citizenship | null> {
    if (person.rawData) {
      return formatCitizenship(person.rawData.rikisfang)
    }

    return this.nationalRegistryV3Service.getCitizenship(person.nationalId)
  }

  @ResolveField('spouse', () => Spouse, { nullable: true })
  @Audit()
  async resolveSpouse(@Parent() person: Person): Promise<Spouse | null> {
    if (person.rawData) {
      return formatSpouse(person.rawData.hjuskaparstada)
    }

    return this.nationalRegistryV3Service.getSpouse(person.nationalId)
  }

  @ResolveField('address', () => Address, { nullable: true })
  @Audit()
  async resolveAddress(@Parent() person: Person): Promise<Address | null> {
    if (person.rawData) {
      return formatAddress(person.rawData.heimilisfang)
    }
    return this.nationalRegistryV3Service.getAddress(person.nationalId)
  }

  @ResolveField('name', () => Name, { nullable: true })
  @Audit()
  async resolveName(@Parent() person: Person): Promise<Name | null> {
    if (person.rawData) {
      return formatName(person.rawData.fulltNafn)
    }
    return this.nationalRegistryV3Service.getName(person.nationalId)
  }

  @ResolveField('religion', () => Religion, {
    nullable: true,
  })
  @Audit()
  async resolveReligion(@Parent() person: Person): Promise<Religion | null> {
    if (person.rawData) {
      return formatReligion(person.rawData.trufelag)
    }
    return this.nationalRegistryV3Service.getReligion(person.nationalId)
  }

  /*

  @ResolveField('domicilePopulace', () => DomicilePopulace, {
    nullable: true,
  })
  @Audit()
  async resolveLegalDomicilePopulace(
    @Parent() person: Person,
  ): Promise<DomicilePopulace | null> {
    return this.nationalRegistryV3Service.getDomicilePopulace(person.nationalId)
  }
  */
}
