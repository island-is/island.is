import { UseGuards } from '@nestjs/common'
import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
  Args,
} from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistryResidence } from '../models/nationalRegistryResidence.model'
import { NationalRegistrySpouse } from '../models/nationalRegistrySpouse.model'
import { ChildGuardianship } from '../models/nationalRegistryChildGuardianship.model'
import { ChildGuardianshipInput } from '../dto/nationalRegistryChildGuardianshipInput'
import { NationalRegistryBirthplace } from '../models/nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from '../models/nationalRegistryCitizenship.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryPerson)
@Audit({ namespace: '@island.is/api/national-registry-x-road' })
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => NationalRegistryPerson, {
    name: 'nationalRegistryUserV2',
    nullable: true,
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryPerson | null> {
    return this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user.nationalId,
    )
  }

  @Query(() => ChildGuardianship, {
    name: 'nationalRegistryUserV2ChildGuardianship',
    nullable: true,
  })
  @Audit()
  async childGuardianship(
    @Context('req') { user }: { user: User },
    @Args('input') input: ChildGuardianshipInput,
  ): Promise<ChildGuardianship | null> {
    return this.nationalRegistryXRoadService.getChildGuardianship(
      user,
      input.childNationalId,
    )
  }

  @ResolveField('children', () => [NationalRegistryPerson], { nullable: true })
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryPerson[] | undefined> {
    if (person.nationalId !== user.nationalId) {
      return undefined
    }
    return this.nationalRegistryXRoadService.getChildrenCustodyInformation(user)
  }

  @ResolveField('residenceHistory', () => [NationalRegistryResidence], {
    nullable: true,
  })
  @Audit()
  async resolveResidenceHistory(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryResidence[] | undefined> {
    return this.nationalRegistryXRoadService.getNationalRegistryResidenceHistory(
      person.nationalId,
    )
  }

  @ResolveField('spouse', () => NationalRegistrySpouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistrySpouse | null> {
    return this.nationalRegistryXRoadService.getSpouse(person.nationalId)
  }

  @ResolveField('birthplace', () => NationalRegistryBirthplace, {
    nullable: true,
  })
  @Audit()
  async resolveBirthPlace(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryBirthplace | null> {
    return this.nationalRegistryXRoadService.getBirthplace(person.nationalId)
  }

  @ResolveField('citizenship', () => NationalRegistryCitizenship, {
    nullable: true,
  })
  @Audit()
  async resolveCitizenship(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryCitizenship | null> {
    return this.nationalRegistryXRoadService.getCitizenship(person.nationalId)
  }
}
