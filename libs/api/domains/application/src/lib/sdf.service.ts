import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'

import { SdfApi, ExecuteActionDtoActionTypeEnum } from '../../gen/fetch'
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
    screen: string | undefined,
    locale: Locale,
    auth: Auth,
  ): Promise<ScreenDto> {
    return this.sdfApiWithAuth(auth).sdfControllerGetScreen({
      applicationId,
      screen,
      locale,
    })
  }

  async executeAction(
    applicationId: string,
    actionType: string,
    answers: Record<string, unknown> | undefined,
    screen: string,
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
        screen,
        fieldIds,
        event,
        refetchTemplateApiActions,
      },
    })
  }

  /**
   * Wraps the shared `/sdf/:id/action` endpoint in VALIDATE mode. Returns only
   * validation errors and live-computed display values for the screen the
   * client is on — no fresh screen snapshot is produced.
   */
  async validate(
    applicationId: string,
    answers: Record<string, unknown> | undefined,
    fieldIds: string[] | undefined,
    locale: Locale,
    auth: Auth,
    screen: string,
  ): Promise<SdfValidateResponseShape> {
    const result = await this.sdfApiWithAuth(auth).sdfControllerExecuteAction({
      applicationId,
      executeActionDto: {
        actionType: 'VALIDATE' as ExecuteActionDtoActionTypeEnum,
        answers,
        locale,
        fieldIds,
        screen,
      },
    })
    return result as unknown as SdfValidateResponseShape
  }
}
