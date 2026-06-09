import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
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
import {
  ShipRegistrySailorCertificates,
  type ShipRegistrySailorCertificatesBase,
} from '../models/sailorCertificates.model'
import { ShipRegistrySailorSchoolCertificate } from '../models/sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from '../models/sailorRightCertificate.model'
import { ShipRegistrySailorMaritimeBook } from '../models/sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from '../models/sailorRegistrationExemption.model'
import { SailorsService } from '../services/sailors.service'

const namespace = '@island.is/api/ship-registry'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.ships)
@FeatureFlag(Features.isServicePortalSailorsPageEnabled)
@Audit({ namespace })
@Resolver(() => ShipRegistrySailorCertificates)
export class SailorCertificatesResolver {
  constructor(
    private readonly sailorsService: SailorsService,
    private readonly auditService: AuditService,
  ) {}

  @ResolveField(
    'schoolCertificates',
    () => [ShipRegistrySailorSchoolCertificate],
    {
      nullable: true,
    },
  )
  async resolveSchoolCertificates(
    @Context('req') { user }: { user: User },
    @Parent() { locale }: ShipRegistrySailorCertificatesBase,
  ): Promise<ShipRegistrySailorSchoolCertificate[]> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveSchoolCertificates',
      resources: user.nationalId,
    })
    return this.sailorsService.getSailorSchoolCertificates(user, locale)
  }

  @ResolveField(
    'rightCertificates',
    () => [ShipRegistrySailorRightCertificate],
    {
      nullable: true,
    },
  )
  async resolveRightCertificates(
    @Context('req') { user }: { user: User },
    @Parent() { locale }: ShipRegistrySailorCertificatesBase,
  ): Promise<ShipRegistrySailorRightCertificate[]> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveRightCertificates',
      resources: user.nationalId,
    })
    return this.sailorsService.getSailorRightCertificates(user, locale)
  }

  @ResolveField('maritimeBooks', () => [ShipRegistrySailorMaritimeBook], {
    nullable: true,
  })
  async resolveMaritimeBooks(
    @Context('req') { user }: { user: User },
    @Parent() { locale }: ShipRegistrySailorCertificatesBase,
  ): Promise<ShipRegistrySailorMaritimeBook[]> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveMaritimeBooks',
      resources: user.nationalId,
    })
    return this.sailorsService.getSailorMaritimeBooks(user, locale)
  }

  @ResolveField(
    'registrationExemptions',
    () => [ShipRegistrySailorRegistrationExemption],
    {
      nullable: true,
    },
  )
  async resolveRegistrationExemptions(
    @Context('req') { user }: { user: User },
    @Parent() { locale }: ShipRegistrySailorCertificatesBase,
  ): Promise<ShipRegistrySailorRegistrationExemption[]> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveRegistrationExemptions',
      resources: user.nationalId,
    })
    return this.sailorsService.getSailorRegistrationExemptions(user, locale)
  }
}
