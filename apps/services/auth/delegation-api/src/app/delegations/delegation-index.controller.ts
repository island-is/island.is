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
  CreateDelegationIndexItemDTO,
  DelegationsIndexService,
} from '@island.is/auth-api-lib'
import { AuthDelegationType } from '@island.is/shared/types'
import { Documentation } from '@island.is/nest/swagger'
import { Auth, CurrentAuth, IdsUserGuard } from '@island.is/auth-nest-tools'

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

@UseGuards(IdsUserGuard)
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
    response: { status: 204 },
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
    @CurrentAuth() auth: Auth,
    @Headers('X-Param-Id') delegationInfo: string,
    @Body() body: CreateDelegationIndexItemDTO,
  ) {
    if (!auth.delegationProvider) {
      throw new BadRequestException('Delegation provider missing')
    }

    const parsedDelegationInfo = parseDelegationInfo(delegationInfo)

    try {
      await this.delegationIndexService.createOrUpdateDelegationIndexItem({
        ...parsedDelegationInfo,
        provider: auth.delegationProvider,
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
    response: { status: 204 },
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
    @CurrentAuth() auth: Auth,
    @Headers('X-Param-Id') delegationInfo: string,
  ) {
    if (!auth.delegationProvider) {
      throw new BadRequestException('Delegation provider missing')
    }

    const parsedDelegationInfo = parseDelegationInfo(delegationInfo)

    try {
      await this.delegationIndexService.deletedDelegationIndexItem({
        ...parsedDelegationInfo,
        provider: auth.delegationProvider,
      })
    } catch {
      throw new BadRequestException(
        'Invalid delegation type and provider combination',
      )
    }
  }
}
