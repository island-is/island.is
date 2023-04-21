import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
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
import { NationalRegistryV3Person } from './graphql/models/nationalRegistryPerson.model'
import { ChildGuardianship } from './graphql/models/nationalRegistryChildGuardianship.model'
import { ChildGuardianshipInput } from './graphql/dto/nationalRegistryChildGuardianshipInput'
import { NationalRegistryV3Spouse } from './graphql/models/nationalRegistrySpouse.model'
import { NationalRegistryV3Service } from './nationalRegistryV3.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => NationalRegistryV3Person)
@Audit({ namespace: '@island.is/api/national-registry-v3' })
export class NationalRegistryV3Resolver {
  constructor(private nationalRegistryV3Service: NationalRegistryV3Service) {}

  @Query(() => NationalRegistryV3Person, {
    name: 'nationalRegistryUserV3',
    nullable: true,
  })
  @Audit()
  async nationalRegistryPersons(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryV3Person | null> {
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

  @ResolveField('spouse', () => NationalRegistryV3Spouse, { nullable: true })
  @Audit()
  async resolveSpouse(
    @Context('req') { user }: { user: User },
    @Parent() person: NationalRegistryV3Person,
  ): Promise<NationalRegistryV3Spouse | null> {
    return this.nationalRegistryV3Service.getSpouse(person.nationalId)
  }
}
