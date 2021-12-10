import { UseGuards } from '@nestjs/common'
import {
  Args,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
  Field,
  InputType,
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { NationalRegistryStatus } from '../models/nationalRegistryStatus.model'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistryResidence } from '../models/nationalRegistryResidence.model'
import { NationalRegistrySpouse } from '../models/nationalRegistrySpouse.model'

@InputType()
export class GetNationalRegistryPersonLoadTestInput {
  @Field(() => String)
  nationalId!: string
}

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
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
  ): Promise<NationalRegistryPerson | undefined> {
    return this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user,
      user.nationalId,
    )
  }

  @ResolveField('children', () => [NationalRegistryPerson], { nullable: true })
  @Audit()
  async resolveChildren(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryPerson[] | undefined> {
    return await this.nationalRegistryXRoadService.getChildrenCustodyInformation(
      user,
      person.nationalId,
    )
  }

  @ResolveField('residenceHistory', () => [NationalRegistryResidence], {
    nullable: true,
  })
  @Audit()
  async resolveResidenceHistory(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistryResidence[] | undefined> {
    return await this.nationalRegistryXRoadService.getNationalRegistryResidenceHistory(
      user,
      person.nationalId,
    )
  }

  @ResolveField('spouse', () => NationalRegistrySpouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryPerson,
  ): Promise<NationalRegistrySpouse | undefined> {
    return await this.nationalRegistryXRoadService.getSpouse(
      user,
      person.nationalId,
    )
  }

  @Query(() => NationalRegistryStatus, {
    name: 'nationalRegistryPersonLoadTest',
  })
  @Audit()
  async nationalRegistryPersonLoadTest(
    @CurrentUser() user: User,
    @Args('input') input: GetNationalRegistryPersonLoadTestInput,
  ): Promise<NationalRegistryStatus | undefined> {
    this.authorize(user.nationalId)
    const person = await this.nationalRegistryXRoadService.getNationalRegistryPerson(
      user,
      input.nationalId,
    )
    return {
      status: '200',
      data: [person?.fullName || ''],
    }
  }

  @Query(() => NationalRegistryStatus, {
    name: 'nationalRegistryCustodyLoadTest',
  })
  @Audit()
  async nationalRegistryCustodyLoadTest(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryStatus | undefined> {
    this.authorize(user.nationalId)
    const custody = await this.nationalRegistryXRoadService.getCustody(
      user,
      user.nationalId,
    )
    return {
      status: '200',
      data: custody || [],
    }
  }

  @Query(() => NationalRegistryStatus, {
    name: 'nationalRegistryCustodyParentsLoadTest',
  })
  @Audit()
  async nationalRegistryCustodyParentsLoadTest(
    @CurrentUser() user: User,
    @Args('input') input: GetNationalRegistryPersonLoadTestInput,
  ): Promise<NationalRegistryStatus | undefined> {
    this.authorize(user.nationalId)
    const parents = await this.nationalRegistryXRoadService.getCustodyParents(
      user,
      user.nationalId,
      input.nationalId,
    )
    return {
      status: '200',
      data: parents || [],
    }
  }

  @Query(() => NationalRegistryStatus, {
    name: 'nationalRegistryFamilyLoadTest',
  })
  @Audit()
  async nationalRegistryFamilyLoadTest(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryStatus | undefined> {
    this.authorize(user.nationalId)
    const family = await this.nationalRegistryXRoadService.getFamily(
      user,
      user.nationalId,
    )
    return {
      status: '200',
      data: family || [],
    }
  }

  private authorize(nationalId: string) {
    const loadTestNationalId = process.env.LOAD_TEST_NATIONAL_ID
    if (!loadTestNationalId || nationalId !== loadTestNationalId) {
      throw new ApolloError('You are not authorized for this!', '401')
    }
  }
}
