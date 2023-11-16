import {
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { AuditService } from '@island.is/nest/audit'
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Person } from '../shared/models'
import { NationalRegistryService } from '../nationalRegistry.service'
import { ChildCustody } from '../shared/models/childCustody.model'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { SharedChildCustody } from '../shared/types'

const namespace = '@island.is/api/national-registry'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver(() => ChildCustody)
@Audit({ namespace })
export class ChildCustodyResolver {
  constructor(
    private service: NationalRegistryService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @ResolveField('details', () => Person, {
    nullable: true,
  })
  async resolveChildDetails(
    @Context('req') { user }: { user: User },
    @Parent() childCustody: SharedChildCustody,
  ): Promise<Person | null> {
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveChildDetails',
      resources: user.nationalId,
    })

    return this.service.getChildDetails(
      childCustody.nationalId ?? '0',
      childCustody.api,
    )
  }
}
