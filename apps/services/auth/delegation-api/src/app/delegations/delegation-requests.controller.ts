import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  CreateDelegationRequestDTO,
  DelegationDirection,
  DelegationRequestDTO,
  DelegationRequestService,
  FulfillDelegationRequestDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { delegationScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import type { DocumentationParamOptions } from '@island.is/nest/swagger'
import { isDefined } from '@island.is/shared/utils'

const namespace = '@island.is/auth/delegation-api/me/delegation-requests'

const requestId: DocumentationParamOptions = {
  required: true,
  type: 'string',
  format: 'uuid',
  description: 'The id of the delegation request.',
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...delegationScopes)
@ApiSecurity('ias', delegationScopes)
@ApiTags('me/delegation-requests')
@Controller({
  path: 'me/delegation-requests',
  version: ['1'],
})
@Audit({ namespace })
export class DelegationRequestsController {
  constructor(
    private readonly delegationRequestService: DelegationRequestService,
  ) {}

  @Get()
  @Documentation({
    response: { status: 200, type: [DelegationRequestDTO] },
    request: {
      query: {
        direction: {
          description:
            'Direction of the requests. "outgoing" = requests you sent; "incoming" = requests addressed to you (or the company you represent). Defaults to outgoing.',
          required: false,
          schema: {
            enum: [DelegationDirection.OUTGOING, DelegationDirection.INCOMING],
            default: DelegationDirection.OUTGOING,
          },
        },
      },
    },
  })
  @Audit<DelegationRequestDTO[]>({
    resources: (requests) => requests.map((r) => r?.id).filter(isDefined),
  })
  findAll(
    @CurrentUser() user: User,
    @Query('direction')
    direction: DelegationDirection = DelegationDirection.OUTGOING,
  ): Promise<DelegationRequestDTO[]> {
    switch (direction) {
      case DelegationDirection.INCOMING:
        return this.delegationRequestService.findAllIncoming(user)
      case DelegationDirection.OUTGOING:
        return this.delegationRequestService.findAllOutgoing(user)
      default:
        throw new BadRequestException(
          `direction must be either 'incoming' or 'outgoing'.`,
        )
    }
  }

  @Get(':requestId')
  @Documentation({
    response: { status: 200, type: DelegationRequestDTO },
    request: { params: { requestId } },
  })
  @Audit<DelegationRequestDTO>({
    resources: (request) => request?.id ?? undefined,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestService.findById(user, requestId)
  }

  @Post()
  @Documentation({
    response: { status: 201, type: DelegationRequestDTO },
  })
  @Audit<DelegationRequestDTO>({
    resources: (request) => request?.id ?? undefined,
    meta: (request) => ({
      scopes: request.scopes?.map((s) => s.scopeName),
    }),
  })
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateDelegationRequestDTO,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestService.createRequest(user, dto)
  }

  @Post(':requestId/reject')
  @Documentation({
    response: { status: 200, type: DelegationRequestDTO },
    request: { params: { requestId } },
  })
  @Audit<DelegationRequestDTO>({
    resources: (request) => request?.id ?? undefined,
  })
  reject(
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestService.reject(user, requestId)
  }

  @Post(':requestId/cancel')
  @Documentation({
    response: { status: 200, type: DelegationRequestDTO },
    request: { params: { requestId } },
  })
  @Audit<DelegationRequestDTO>({
    resources: (request) => request?.id ?? undefined,
  })
  cancel(
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestService.cancel(user, requestId)
  }

  @Post(':requestId/fulfill')
  @Documentation({
    response: { status: 200, type: DelegationRequestDTO },
    request: { params: { requestId } },
  })
  @Audit<DelegationRequestDTO>({
    resources: (request) => request?.id ?? undefined,
    meta: (request) => ({ delegationId: request.resolvedDelegationId }),
  })
  fulfill(
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
    @Body() dto: FulfillDelegationRequestDTO,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestService.markFulfilled(
      user,
      requestId,
      dto.delegationId,
    )
  }
}
