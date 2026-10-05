import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import type {
  DelegationConfirmationAuthenticationDTO,
  DelegationConfirmationDTO,
  DelegationConfirmationReceiptDTO,
  StartedDelegationConfirmationAuthenticationDTO,
} from '@island.is/clients/auth/delegation-api'
import {
  MeDelegationConfirmationsApi,
  StartDelegationConfirmationAuthenticationDTOMethodEnum,
} from '@island.is/clients/auth/delegation-api'

import {
  DelegationConfirmationStepUpMethod,
  type DelegationConfirmationInput,
  type StartDelegationConfirmationAuthenticationInput,
} from '../dto'

const toApiMethod: Record<
  DelegationConfirmationStepUpMethod,
  StartDelegationConfirmationAuthenticationDTOMethodEnum
> = {
  [DelegationConfirmationStepUpMethod.app]:
    StartDelegationConfirmationAuthenticationDTOMethodEnum.app,
  [DelegationConfirmationStepUpMethod.sim]:
    StartDelegationConfirmationAuthenticationDTOMethodEnum.sim,
}

@Injectable()
export class MeDelegationConfirmationsService {
  constructor(
    private delegationConfirmationsApi: MeDelegationConfirmationsApi,
  ) {}

  private apiWithAuth(auth: Auth) {
    return this.delegationConfirmationsApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  /**
   * The held scopes travel as an untyped JSON snapshot (that is the point — it
   * records exactly what the grantor was shown), so `validTo` arrives as an ISO
   * string. The GraphQL DateTime scalar only serialises Date instances, so
   * convert here, at the boundary, rather than weakening the schema to String.
   */
  private withParsedScopeDates<T extends { scopes: Array<object> }>(
    confirmation: T,
  ): T {
    return {
      ...confirmation,
      scopes: (confirmation.scopes ?? []).map((scope) => {
        const { validTo, ...rest } = scope as Record<string, unknown>
        return {
          ...rest,
          validTo: validTo ? new Date(validTo as string) : null,
        }
      }),
    }
  }

  async getConfirmations(user: User): Promise<DelegationConfirmationDTO[]> {
    const confirmations = await this.apiWithAuth(
      user,
    ).meDelegationConfirmationsControllerFindAll()

    return confirmations.map((c) => this.withParsedScopeDates(c))
  }

  async getConfirmation(
    user: User,
    { confirmationId }: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationDTO | null> {
    const request = await this.apiWithAuth(
      user,
    ).meDelegationConfirmationsControllerFindOneRaw({ confirmationId })

    if (request.raw.status === 204) {
      return null
    }

    return this.withParsedScopeDates(await request.value())
  }

  async getReceipt(
    user: User,
    { confirmationId }: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationReceiptDTO | null> {
    const request = await this.apiWithAuth(
      user,
    ).meDelegationConfirmationsControllerFindReceiptRaw({ confirmationId })

    if (request.raw.status === 204) {
      return null
    }

    return this.withParsedScopeDates(await request.value())
  }

  startAuthentication(
    user: User,
    { confirmationId, method }: StartDelegationConfirmationAuthenticationInput,
  ): Promise<StartedDelegationConfirmationAuthenticationDTO> {
    return this.apiWithAuth(
      user,
    ).meDelegationConfirmationsControllerStartAuthentication({
      confirmationId,
      startDelegationConfirmationAuthenticationDTO: {
        method: method && toApiMethod[method],
      },
    })
  }

  async getAuthentication(
    user: User,
    { confirmationId }: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationAuthenticationDTO> {
    const result = await this.apiWithAuth(
      user,
    ).meDelegationConfirmationsControllerGetAuthentication({ confirmationId })

    return {
      ...result,
      confirmation: this.withParsedScopeDates(result.confirmation),
    }
  }
}
