import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Headers,
  Put,
} from '@nestjs/common'
import {
  CreateDelegationIndexItemDTO,
  DelegationsIndexService,
} from '@island.is/auth-api-lib'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/delegation-api/me/delegation-index'

const parseDelegationInfo = (delegationInfo: string) => {
  const [type, toNationalId, fromNationalId] = delegationInfo.split('_')

  if (!type || !toNationalId || !fromNationalId) {
    throw new BadRequestException('Invalid delegation information')
  }

  return {
    type: type as AuthDelegationType,
    toNationalId,
    fromNationalId,
  }
}

@Controller({
  path: 'delegation-index',
})
export class DelegationIndexController {
  constructor(
    private readonly delegationIndexService: DelegationsIndexService,
  ) {}

  @Put('.id')
  @Documentation({
    description: 'Create or update a delegation index item.',
    response: { status: 200 },
    request: {
      header: {
        'X-Param-Id': {
          required: true,
          description:
            'Delegation information delimited by an underscore e.g. delegationType_nationalIdTo_nationalIdFrom',
        },
      },
    },
  })
  async createOrUpdateDelegationIndexItem(
    @Headers('X-Param-Id') delegationInfo: string,
    @Body() body: CreateDelegationIndexItemDTO,
  ) {
    const parsedDelegationInfo = parseDelegationInfo(delegationInfo)

    try {
      await this.delegationIndexService.addOrUpdateDelegationIndexItem({
        ...parsedDelegationInfo,
        provider: AuthDelegationProvider.NationalRegistry,
        validTo: body.validTo,
      })
    } catch {
      throw new BadRequestException(
        'Invalid delegation type and provider combination',
      )
    }
  }

  @Delete('.id')
  @Documentation({
    description: 'Delete a delegation index item.',
    response: { status: 200 },
    request: {
      header: {
        'X-Param-Id': {
          required: true,
          description:
            'Delegation information delimited by an underscore e.g. delegationType_nationalIdTo_nationalIdFrom',
        },
      },
    },
  })
  async removeDelegationIndexItem(
    @Headers('X-Param-Id') delegationInfo: string,
  ) {
    const parsedDelegationInfo = parseDelegationInfo(delegationInfo)

    try {
      await this.delegationIndexService.deletedDelegationIndexItem({
        ...parsedDelegationInfo,
        provider: AuthDelegationProvider.NationalRegistry,
      })
    } catch {
      throw new BadRequestException(
        'Invalid delegation type and provider combination',
      )
    }
  }
}
