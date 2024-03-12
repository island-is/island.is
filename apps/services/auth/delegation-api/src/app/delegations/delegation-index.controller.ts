import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Headers,
  Put,
  UseGuards,
} from '@nestjs/common'
import * as kennitala from 'kennitala'
import {
  DelegationRecordDTO,
  DelegationsIndexService,
  CreateDelegationRecordInputDTO,
} from '@island.is/auth-api-lib'
import { AuthDelegationType } from '@island.is/shared/types'
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

const namespace = '@island.is/auth/delegation-api/delegation-index'

const parseDelegationInfo = (delegationInfo: string) => {
  const [type, toNationalId, fromNationalId] = delegationInfo.split('_')

  if (!type || !toNationalId || !fromNationalId) {
    throw new BadRequestException('Invalid delegation information')
  }

  if (!kennitala.isValid(toNationalId) || !kennitala.isValid(fromNationalId)) {
    throw new BadRequestException('Invalid national id')
  }

  return {
    type: type as AuthDelegationType,
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
    description: 'Create or update a delegation index item.',
    response: { status: 200, type: DelegationRecordDTO },
    request: requestDocumentation,
  })
  async createOrUpdateDelegationRecord(
    @CurrentAuth() auth: Auth,
    @Headers('X-Param-Id') delegationInfo: string,
    @Body() body: CreateDelegationRecordInputDTO,
  ) {
    if (!auth.delegationProvider) {
      throw new BadRequestException('Delegation provider missing')
    }

    const parsedDelegationInfo = parseDelegationInfo(delegationInfo)

    try {
      return await this.auditService.auditPromise<DelegationRecordDTO>(
        {
          auth: auth,
          action: 'createOrUpdateDelegationIndexItem',
          resources: [],
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
    } catch {
      throw new BadRequestException(
        'Invalid delegation type and provider combination',
      )
    }
  }

  @Delete('.id')
  @Documentation({
    description: 'Delete a delegation index item.',
    response: { status: 204 },
    request: requestDocumentation,
  })
  async removeDelegationRecord(
    @CurrentAuth() auth: Auth,
    @Headers('X-Param-Id') delegationInfo: string,
  ) {
    if (!auth.delegationProvider) {
      throw new BadRequestException('Delegation provider missing')
    }

    const parsedDelegationInfo = parseDelegationInfo(delegationInfo)

    try {
      await this.auditService.auditPromise(
        {
          auth: auth,
          action: 'removeDelegationIndexItem',
          meta: {
            ...parsedDelegationInfo,
          },
        },
        this.delegationIndexService.deletedDelegationRecord({
          ...parsedDelegationInfo,
          provider: auth.delegationProvider,
        }),
      )
    } catch {
      throw new BadRequestException(
        'Invalid delegation type and provider combination',
      )
    }
  }
}
