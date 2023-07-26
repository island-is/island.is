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
  type PersonDiscriminated,
  type NationalRegistryPersonV2,
  NationalRegistryPerson,
  NationalRegistryPersonV3,
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
  formatLivingArrangements,
  formatBirthParent,
} from './services/v3/mapper'
import { ExcludesFalse } from './utils'
import { NationalRegistryLivingArrangements } from './models/nationalRegistryLivingArrangements.model'
import { NationalRegistryBasePerson } from './models/nationalRegistryBasePerson.model'
import { NationalRegistryResidence } from './models/nationalRegistryResidence.model'
import { NationalRegistryChild } from './models/nationalRegistryChild.model'
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
  })
  @Audit()
  async nationalRegistryPerson(
    @CurrentUser() user: AuthUser,
    @Args('api', { nullable: true }) api?: 'v2' | 'v3',
  ): Promise<NationalRegistryPersonV2 | NationalRegistryPersonV3 | null> {
    const apiVersion = api === 'v3' ? 'v3' : 'v2'
    const service = this.dataService(apiVersion)
    return service.getNationalRegistryPerson(user.nationalId)
  }

  @ResolveField('children', () => [NationalRegistryPerson], {
    nullable: true,
  })
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: PersonDiscriminated,
  ): Promise<NationalRegistryChild[] | NationalRegistryPersonV2[] | null> {
    if (user.nationalId !== person.nationalId) {
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
        .map((b) => b as NationalRegistryChild)

      return childData
    }

    return this.dataService(person.api).getChildrenCustodyInformation(user)
  }

  @ResolveField('birthParents', () => [NationalRegistryBasePerson], {
    nullable: true,
  })
  @Audit()
  async resolveBirthParents(
    @Context('req') { user }: { user: User },
    @Parent() person: PersonDiscriminated,
  ): Promise<Array<NationalRegistryBasePerson> | null> {
    if (user.nationalId !== person.nationalId || person.api === 'v2') {
      return null
    }
    if (person.api === 'v3' && person.rawData) {
      if (!person.rawData?.logforeldrar?.logForeldrar) {
        return null
      }

      return person.rawData.logforeldrar.logForeldrar
        .map((l) => formatBirthParent(l))
        .filter((Boolean as unknown) as ExcludesFalse)
    }

    return this.v3.getParents(person.nationalId)
  }

  @ResolveField('residenceHistory', () => [NationalRegistryResidence], {
    nullable: true,
  })
  @Audit()
  async resolveResidenceHistory(
    @Parent() person: PersonDiscriminated,
  ): Promise<NationalRegistryResidence[] | null> {
    if (person.api === 'v2') {
      return this.v2.getNationalRegistryResidenceHistory(person.nationalId)
    }
    return null
  }

  @ResolveField(
    'nationalRegistryLivingArrangements',
    () => NationalRegistryLivingArrangements,
    {
      nullable: true,
    },
  )
  @Audit()
  async resolveLivingArrangements(
    @Parent() person: PersonDiscriminated,
  ): Promise<NationalRegistryLivingArrangements | null> {
    if (person.api === 'v3') {
      return person.rawData
        ? formatLivingArrangements(
            person.rawData.itarupplysingar,
            person.rawData.logheimilistengsl,
          )
        : this.v3.getNationalRegistryLivingArrangements(person.nationalId)
    }
    return null
  }

  @ResolveField('birthplace', () => NationalRegistryBirthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Parent() person: PersonDiscriminated,
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
    @Parent() person: PersonDiscriminated,
  ): Promise<NationalRegistryCitizenship | null> {
    if (person.api === 'v3' && person.rawData) {
      return formatCitizenship(person.rawData.rikisfang)
    }

    return this.dataService(person.api).getCitizenship(person.nationalId)
  }

  @ResolveField('spouse', () => NationalRegistrySpouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Parent() person: PersonDiscriminated,
  ): Promise<NationalRegistrySpouse | null> {
    if (person.api === 'v3' && person.rawData) {
      return formatSpouse(person.rawData.hjuskaparstada)
    }

    return this.dataService(person.api).getSpouse(person.nationalId)
  }

  @ResolveField('address', () => NationalRegistryAddress, { nullable: true })
  @Audit()
  async resolveAddress(
    @Parent() person: PersonDiscriminated,
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
    @Parent() person: PersonDiscriminated,
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
    @Parent() person: PersonDiscriminated,
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
