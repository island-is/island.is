import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendApi } from '../../data-sources'
import { CreateIndictmentCountInput } from './dto/createIndictmentCount.input'
import { DeleteIndictmentCountInput } from './dto/deleteIndictmentCount.input'
import { UpdateIndictmentCountInput } from './dto/updateIndictmentCount.input'
import { DeleteIndictmentCountResponse } from './models/delete.response'
import { IndictmentCount } from './models/indictmentCount.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class IndictmentCountResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => IndictmentCount, { nullable: true })
  createIndictmentCount(
    @Args('input', { type: () => CreateIndictmentCountInput })
    input: CreateIndictmentCountInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<IndictmentCount> {
    this.logger.debug(
      `Creating a new indictment count for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_INDICTMENT_COUNT,
      backendApi.createIndictmentCount(input),
      (theIndictmentCount) => theIndictmentCount.id,
    )
  }

  @Mutation(() => IndictmentCount, { nullable: true })
  updateIndictmentCount(
    @Args('input', { type: () => UpdateIndictmentCountInput })
    input: UpdateIndictmentCountInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<IndictmentCount> {
    this.logger.debug(
      `Updating indictment count ${input.indictmentCountId} for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_INDICTMENT_COUNT,
      backendApi.updateIndictmentCount(input),
      input.indictmentCountId,
    )
  }

  @Mutation(() => DeleteIndictmentCountResponse, { nullable: true })
  deleteIndictmentCount(
    @Args('input', { type: () => DeleteIndictmentCountInput })
    input: DeleteIndictmentCountInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<DeleteIndictmentCountResponse> {
    this.logger.debug(
      `Deleting indictment count ${input.indictmentCountId} for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_INDICTMENT_COUNT,
      backendApi.deleteIndictmentCount(input),
      input.indictmentCountId,
    )
  }
}
