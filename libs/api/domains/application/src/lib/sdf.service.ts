import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'

import {
  SdfApi,
  ExecuteActionDtoActionTypeEnum,
} from '../../gen/fetch'
import type { ScreenDto } from '../../gen/fetch'

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
    lastKnownPageIndex: number,
    locale: Locale,
    auth: Auth,
    fieldIds?: string[],
    event?: string,
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
      },
    })
  }
}
