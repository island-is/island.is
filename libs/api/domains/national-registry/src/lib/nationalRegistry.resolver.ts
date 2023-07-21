import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
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
  NationalRegistryPersonDiscriminated,
  NationalRegistryPerson,
} from './models/nationalRegistryPerson.model'
import { NationalRegistrySpouse } from './models/nationalRegistrySpouse.model'
import { NationalRegistryAddress } from './models/nationalRegistryAddress.model'
import { NationalRegistryBirthplace } from './models/nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from './models/nationalRegistryCitizenship.model'
import { NationalRegistryName } from './models/nationalRegistryName.model'
import { NationalRegistryReligion } from './models/nationalRegistryReligion.model'
import { NationalRegistryV3Service } from './services/v3/nationalRegistryV3.service'
import { NationalRegistryXRoadService } from './services/v2/nationalRegistryXRoad.service'
import {
  formatBirthplace,
  formatCitizenship,
  formatSpouse,
  formatAddress,
  formatName,
  formatReligion,
  formatPerson,
} from './services/v3/mapper'
import { NationalRegistryChildGuardianship } from './models/nationalRegistryChildGuardianship.model'
import { ChildGuardianshipInput } from './dto/ChildGuardianshipInput'
import { ExcludesFalse } from './utils'
import { child } from 'winston'
import { NationalRegistryResidence } from './models/nationalRegistryResidence.model'

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

  @Query(() => NationalRegistryChildGuardianship, {
    nullable: true,
  })
  @Audit()
  async childGuardianship(
    @Context('req') { user }: { user: User },
    @Args('input') input: ChildGuardianshipInput,
    @Args('api', { nullable: true }) api?: 'v2' | 'v3',
  ): Promise<NationalRegistryChildGuardianship | null> {
    const apiVersion = api === 'v3' ? 'v3' : 'v2'
    const service = this.dataService(apiVersion)
    return service.getChildGuardianship(user, input.childNationalId)
  }

  @ResolveField('children', () => [NationalRegistryPerson], {
    nullable: true,
  })
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<Array<NationalRegistryPerson> | null> {
    if (person.nationalId !== person.nationalId) {
      return null
    }

    if (person.api === 'v3' && person.rawData) {
      const wards = person.rawData?.forsja?.born
        ?.map((b) => b.barnKennitala)
        .filter((Boolean as unknown) as ExcludesFalse)

      if (!wards) {
        return null
      }

      const childData = (
        await Promise.all(
          wards.map(async (b) => this.v3.getNationalRegistryPerson(b)),
        )
      )
        .filter((Boolean as unknown) as ExcludesFalse)
        .map((b) => b as NationalRegistryPerson)

      return childData
    }

    return this.dataService(person.api).getChildrenCustodyInformation(user)
  }

  @ResolveField('parents', () => [NationalRegistryPerson], {
    nullable: true,
  })
  @Audit()
  async resolveParents(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<Array<NationalRegistryPerson> | null> {
    if (person.nationalId !== person.nationalId || person.api === 'v2') {
      return null
    }
    if (person.api === 'v3' && person.rawData) {
      const parents = person.rawData?.forsja?.forsjaradilar
        ?.map((f) => f.forsjaAdiliKennitala)
        .filter((Boolean as unknown) as ExcludesFalse)

      if (!parents) {
        return null
      }

      const parentData = (
        await Promise.all(
          parents.map(async (b) => this.v3.getNationalRegistryPerson(b)),
        )
      )
        .filter((Boolean as unknown) as ExcludesFalse)
        .map((b) => b as NationalRegistryPerson)

      return parentData
    }

    return this.v3.getCustodians(person.nationalId)
  }

  @ResolveField('residenceHistory', () => [NationalRegistryResidence], {
    nullable: true,
  })
  @Audit()
  async resolveResidenceHistory(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryResidence[] | null> {
    return this.dataService(person.api).getNationalRegistryResidenceHistory(
      person.nationalId,
    )
  }

  @ResolveField('birthplace', () => NationalRegistryBirthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryBirthplace | null> {
    if (person.api === 'v3' && person.rawData) {
      return formatBirthplace(person.rawData.faedingarstadur)
    }

    return this.dataService(person.api).getBirthplace(person.nationalId)
  }

  @ResolveField('citizenship', () => NationalRegistryCitizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryCitizenship | null> {
    if (person.api === 'v3' && person.rawData) {
      return formatCitizenship(person.rawData.rikisfang)
    }

    return this.dataService(person.api).getCitizenship(person.nationalId)
  }

  @ResolveField('spouse', () => NationalRegistrySpouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistrySpouse | null> {
    if (person.api === 'v3' && person.rawData) {
      return formatSpouse(person.rawData.hjuskaparstada)
    }

    return this.dataService(person.api).getSpouse(person.nationalId)
  }

  @ResolveField('address', () => NationalRegistryAddress, { nullable: true })
  @Audit()
  async resolveAddress(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryAddress | null> {
    if (person.api === 'v3') {
      return person.rawData
        ? formatAddress(person.rawData.heimilisfang)
        : this.v3.getAddress(person.nationalId)
    }

    const data = await this.v2.getNationalRegistryPerson(person.nationalId)
    return data?.address ?? null
  }

  @ResolveField('name', () => NationalRegistryName, { nullable: true })
  @Audit()
  async resolveName(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<NationalRegistryName | null> {
    if (person.api === 'v3') {
      return person.rawData
        ? formatName(person.rawData.fulltNafn)
        : this.v3.getName(person.nationalId)
    }
    const data = await this.v2.getNationalRegistryPerson(person.nationalId)
    return data?.name ?? null
  }

  @ResolveField('religion', () => NationalRegistryReligion, {
    nullable: true,
  })
  @Audit()
  async resolveReligion(
    @Parent() person: NationalRegistryPersonDiscriminated,
  ): Promise<Array<NationalRegistryReligion> | null> {
    if (person.api === 'v3') {
      const religion = person.rawData
        ? formatReligion(person.rawData.trufelag)
        : await this.v3.getReligion(person.nationalId)

      return religion ? [religion] : null
    }

    return this.v2.getReligions()
  }

  /*

  @ResolveField('domicilePopulace', () => DomicilePopulace, {
    nullable: true,
  })
  @Audit()
  async resolveLegalDomicilePopulace(
    @Parent() person: user,
  ): Promise<DomicilePopulace | null> {
    return this.nationalRegistryV3Service.getDomicilePopulace(person.nationalId)
  }
  */
}
