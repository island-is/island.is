import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Headers,
  Put,
  UseGuards,
} from '@nestjs/common'

import {
  DelegationRecordDTO,
  DelegationsIndexService,
  CreateDelegationRecordInputDTO,
} from '@island.is/auth-api-lib'

import { Documentation } from '@island.is/nest/swagger'
import {
  Auth,
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { ApiSecurity } from '@nestjs/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { DelegationRecordType } from '@island.is/auth-api-lib'

const namespace = '@island.is/auth/delegation-api/delegation-index'

const parseDelegationInfo = (id: string) => {
  const [type, toNationalId, fromNationalId] = id.split('_')

  if (!type || !toNationalId || !fromNationalId) {
    throw new BadRequestException('Invalid delegation information')
  }

  return {
    type: type as DelegationRecordType,
    toNationalId,
    fromNationalId,
  }
}

const requestDocumentation = {
  header: {
    'X-Param-Id': {
      required: true,
      description:
        'Delegation information delimited by an underscore e.g. delegationType_nationalIdTo_nationalIdFrom',
    },
  },
}

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.delegationIndexWrite)
@ApiSecurity('ias', [AuthScope.delegationIndexWrite])
@Controller({
  path: 'delegation-index',
})
@Audit({ namespace })
export class DelegationIndexController {
  constructor(
    private readonly delegationIndexService: DelegationsIndexService,
    private readonly auditService: AuditService,
  ) {}

  @Put('.id')
  @Documentation({
    description: 'Create or update a delegation index record.',
    response: { status: 200, type: DelegationRecordDTO },
    request: requestDocumentation,
  })
  async createOrUpdateDelegationRecord(
    @CurrentAuth() auth: Auth,
    @Headers('X-Param-Id') delegationIndexId: string,
    @Body() body: CreateDelegationRecordInputDTO,
  ): Promise<DelegationRecordDTO> {
    if (!auth.delegationProvider) {
      throw new BadRequestException('Delegation provider missing')
    }

    const parsedDelegationInfo = parseDelegationInfo(delegationIndexId)

    return await this.auditService.auditPromise<DelegationRecordDTO>(
      {
        auth: auth,
        action: 'createOrUpdateDelegationIndexItem',
        resources: delegationIndexId,
        meta: {
          ...parsedDelegationInfo,
        },
      },
      this.delegationIndexService.createOrUpdateDelegationRecord({
        ...parsedDelegationInfo,
        provider: auth.delegationProvider,
        validTo: body.validTo,
      }),
    )
  }

  @Delete('.id')
  @Documentation({
    description: 'Delete a delegation index record.',
    response: { status: 204 },
    request: requestDocumentation,
  })
  async removeDelegationRecord(
    @CurrentAuth() auth: Auth,
    @Headers('X-Param-Id') delegationIndexId: string,
  ) {
    if (!auth.delegationProvider) {
      throw new BadRequestException('Delegation provider missing')
    }

    const parsedDelegationInfo = parseDelegationInfo(delegationIndexId)

    await this.auditService.auditPromise(
      {
        auth: auth,
        action: 'removeDelegationIndexItem',
        resources: delegationIndexId,
        meta: {
          ...parsedDelegationInfo,
        },
      },
      this.delegationIndexService.removeDelegationRecord({
        ...parsedDelegationInfo,
        provider: auth.delegationProvider,
      }),
    )
  }
}
