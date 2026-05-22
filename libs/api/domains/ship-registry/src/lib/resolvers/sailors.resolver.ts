import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { LocaleEnum } from '@island.is/nest/graphql'
import { ShipRegistrySailor, type ShipRegistrySailorBase } from '../models/sailor.model'
import { ShipRegistrySailorCertificates, type ShipRegistrySailorCertificatesBase } from '../models/sailorCertificates.model'
import { ShipRegistrySailorSeaServiceBookEntry } from '../models/sailorSeaServiceBookEntry.model'
import { SeaServiceBookFilterInput } from '../dto/sailor-sea-service-book-filter.input'
import { SailorsService } from '../services/sailors.service'

const namespace = '@island.is/api/ship-registry'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.ships)
@FeatureFlag(Features.isServicePortalSailorsPageEnabled)
@Audit({ namespace })
@Resolver(() => ShipRegistrySailor)
export class SailorsResolver {
  constructor(
    private readonly sailorsService: SailorsService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => ShipRegistrySailor, {
    name: 'shipRegistrySailor',
    nullable: true,
  })
  @Audit()
  async sailor(
    @CurrentUser() user: User,
    @Args('locale', { type: () => LocaleEnum, nullable: true, defaultValue: LocaleEnum.Is })
    locale: LocaleEnum,
  ): Promise<ShipRegistrySailorBase> {
    return { locale }
  }

  @ResolveField('certificates', () => ShipRegistrySailorCertificates, {
    nullable: true,
  })
  resolveCertificates(
    @Context('req') { user }: { user: User },
    @Parent() { locale }: ShipRegistrySailorBase,
  ): ShipRegistrySailorCertificatesBase {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveCertificates',
      resources: user.nationalId,
    })
    return { locale }
  }

  @ResolveField('seaServiceBook', () => [ShipRegistrySailorSeaServiceBookEntry], {
    nullable: true,
  })
  async resolveSeaServiceBook(
    @Context('req') { user }: { user: User },
    @Parent() { locale }: ShipRegistrySailorBase,
    @Args('filters', { type: () => SeaServiceBookFilterInput, nullable: true })
    filters?: SeaServiceBookFilterInput,
  ): Promise<ShipRegistrySailorSeaServiceBookEntry[]> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveSeaServiceBook',
      resources: user.nationalId,
    })
    return this.sailorsService.getSailorSeaServiceBook(user, locale, filters)
  }
}
