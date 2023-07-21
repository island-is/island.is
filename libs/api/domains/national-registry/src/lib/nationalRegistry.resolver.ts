import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  NationalRegistryPersonDiscriminated,
  NationalRegistryPerson,
} from './models/nationalRegistryPerson.model'
import {
  NationalRegistrySpouse,
  formatSpouse,
} from './models/nationalRegistrySpouse.model'
import {
  NationalRegistryAddress,
  formatAddress,
} from './models/nationalRegistryAddress.model'
import {
  NationalRegistryBirthplace,
  formatBirthplace,
} from './models/nationalRegistryBirthplace.model'
import {
  NationalRegistryCitizenship,
  formatCitizenship,
} from './models/nationalRegistryCitizenship.model'
import {
  NationalRegistryName,
  formatName,
} from './models/nationalRegistryName.model'
import {
  NationalRegistryReligion,
  formatReligion,
} from './models/nationalRegistryReligion.model'
import { NationalRegistryV3Service } from './services/v3/nationalRegistryV3.service'
import { NationalRegistryXRoadService } from './services/v2/nationalRegistryXRoad.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryPerson)
@Audit({ namespace: '@island.is/api/national-registry' })
export class NationalRegistryResolver {
  constructor(
    private v3: NationalRegistryV3Service,
    private v2: NationalRegistryXRoadService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private dataService = (api: 'v2' | 'v3') => (api === 'v3' ? this.v3 : this.v2)

  @Query(() => NationalRegistryPerson, {
    nullable: true,
    name: 'nationalRegistryUser',
  })
  @Audit()
  async nationalRegistryPerson(
    @CurrentUser() user: AuthUser,
    @Args('api', { nullable: true }) api?: 'v2' | 'v3',
  ): Promise<NationalRegistryPersonDiscriminated | null> {
    const apiVersion = api === 'v3' ? 'v3' : 'v2'
    const service = this.dataService(apiVersion)
    return service.getNationalRegistryPerson(user.nationalId)
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
  @ResolveField('children', () => [user], {
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

  @ResolveField('birthplace', () => NationalRegistryBirthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() user: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryBirthplace | null> {
    if (user.api === 'v3' && user.rawData) {
      return formatBirthplace(user.rawData.faedingarstadur)
    }

    return this.dataService(user.api).getBirthplace(user.nationalId)
  }

  @ResolveField('citizenship', () => NationalRegistryCitizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() user: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryCitizenship | null> {
    if (user.api === 'v3' && user.rawData) {
      return formatCitizenship(user.rawData.rikisfang)
    }

    return this.dataService(user.api).getCitizenship(user.nationalId)
  }

  @ResolveField('spouse', () => NationalRegistrySpouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Parent() user: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistrySpouse | null> {
    if (user.api === 'v3' && user.rawData) {
      return formatSpouse(user.rawData.hjuskaparstada)
    }

    return this.dataService(user.api).getSpouse(user.nationalId)
  }

  @ResolveField('address', () => NationalRegistryAddress, { nullable: true })
  @Audit()
  async resolveAddress(
    @Parent() user: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryAddress | null> {
    if (user.api === 'v3') {
      return user.rawData
        ? formatAddress(user.rawData.heimilisfang)
        : this.v3.getAddress(user.nationalId)
    }

    const data = await this.v2.getNationalRegistryPerson(user.nationalId)
    return data?.address ?? null
  }

  @ResolveField('name', () => NationalRegistryName, { nullable: true })
  @Audit()
  async resolveName(
    @Parent() user: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryName | null> {
    if (user.api === 'v3' && user.rawData) {
      return formatName(user.rawData.fulltNafn)
    }
    return this.dataService(user.api).getName(user.nationalId)
  }

  @ResolveField('religion', () => NationalRegistryReligion, {
    nullable: true,
  })
  @Audit()
  async resolveReligion(
    @Parent() user: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryReligion | null> {
    if (user.api === 'v3' && user.rawData) {
      return formatReligion(user.rawData.trufelag)
    }
    return null
    //return this.dataService(user.api).getReligion(user.nationalId)
  }

  /*

  @ResolveField('domicilePopulace', () => DomicilePopulace, {
    nullable: true,
  })
  @Audit()
  async resolveLegalDomicilePopulace(
    @Parent() user: user,
  ): Promise<DomicilePopulace | null> {
    return this.nationalRegistryV3Service.getDomicilePopulace(user.nationalId)
  }
  */
}
