import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import type { User } from '@island.is/judicial-system/types'

import { SignedUrl } from './models/signedUrl.model'
import { GetSignedUrlInput } from './dto/getSignedUrl.input'
import { BackendApi } from '../../data-sources'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class LimitiedAccessFileResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => SignedUrl, { nullable: true })
  getLimitedAccessSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<SignedUrl> {
    const { caseId, id } = input

    this.logger.debug(`Getting a signed url for file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SIGNED_URL,
      backendApi.getLimitedAccessCaseFileSignedUrl(caseId, id),
      id,
    )
  }
}
