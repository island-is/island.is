import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'

import {
  SdfApi,
  ExecuteActionDtoActionTypeEnum,
} from '../../gen/fetch'
import type { ScreenDto } from '../../gen/fetch'

import type { SdfValidateResponseShape } from './sdf.model'

@Injectable()
export class SdfService {
  constructor(private readonly sdfApi: SdfApi) {}

  private sdfApiWithAuth(auth: Auth) {
    return this.sdfApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getScreen(
    applicationId: string,
    step: number | undefined,
    locale: Locale,
    auth: Auth,
  ): Promise<ScreenDto> {
    return this.sdfApiWithAuth(auth).sdfControllerGetScreen({
      applicationId,
      step,
      locale,
    })
  }

  async executeAction(
    applicationId: string,
    actionType: string,
    answers: Record<string, unknown> | undefined,
    lastKnownPageIndex: number | undefined,
    locale: Locale,
    auth: Auth,
    fieldIds?: string[],
    event?: string,
    refetchTemplateApiActions?: string[],
  ): Promise<ScreenDto> {
    return this.sdfApiWithAuth(auth).sdfControllerExecuteAction({
      applicationId,
      executeActionDto: {
        actionType: actionType as ExecuteActionDtoActionTypeEnum,
        answers,
        locale,
        lastKnownPageIndex,
        fieldIds,
        event,
        refetchTemplateApiActions,
      },
    })
  }

  /**
   * Wraps the shared `/sdf/:id/action` endpoint in VALIDATE mode. Returns only
   * validation errors and live-computed display values for the current page —
   * no fresh screen snapshot is produced.
   */
  async validate(
    applicationId: string,
    answers: Record<string, unknown> | undefined,
    fieldIds: string[] | undefined,
    locale: Locale,
    auth: Auth,
  ): Promise<SdfValidateResponseShape> {
    const result = await this.sdfApiWithAuth(auth).sdfControllerExecuteAction({
      applicationId,
      executeActionDto: {
        actionType: 'VALIDATE' as ExecuteActionDtoActionTypeEnum,
        answers,
        locale,
        fieldIds,
      },
    })
    return result as unknown as SdfValidateResponseShape
  }
}
