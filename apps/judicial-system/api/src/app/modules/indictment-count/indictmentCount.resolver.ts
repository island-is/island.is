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
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateIndictmentCountInput } from './dto/createIndictmentCount.input'
import { DeleteIndictmentCountInput } from './dto/deleteIndictmentCount.input'
import { UpdateIndictmentCountInput } from './dto/updateIndictmentCount.input'
import { DeleteResponse } from './models/delete.response'
import { IndictmentCount } from './models/indictmentCount.model'

@UseGuards(JwtGraphQlAuthUserGuard)
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
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<IndictmentCount> {
    const { caseId, ...createIndictmentCount } = input

    this.logger.debug(`Creating a new indictment count for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_INDICTMENT_COUNT,
      backendService.createIndictmentCount(caseId, createIndictmentCount),
      (theIndictmentCount) => theIndictmentCount.id,
    )
  }

  @Mutation(() => IndictmentCount, { nullable: true })
  updateIndictmentCount(
    @Args('input', { type: () => UpdateIndictmentCountInput })
    input: UpdateIndictmentCountInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<IndictmentCount> {
    const { caseId, indictmentCountId, ...updateIndictmentCount } = input

    this.logger.debug(
      `Updating indictment count ${indictmentCountId} for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_INDICTMENT_COUNT,
      backendService.updateIndictmentCount(
        caseId,
        indictmentCountId,
        updateIndictmentCount,
      ),
      indictmentCountId,
    )
  }

  @Mutation(() => DeleteResponse, { nullable: true })
  deleteIndictmentCount(
    @Args('input', { type: () => DeleteIndictmentCountInput })
    input: DeleteIndictmentCountInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteResponse> {
    const { caseId, indictmentCountId } = input

    this.logger.debug(
      `Deleting indictment count ${indictmentCountId} for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_INDICTMENT_COUNT,
      backendService.deleteIndictmentCount(caseId, indictmentCountId),
      indictmentCountId,
    )
  }
}
