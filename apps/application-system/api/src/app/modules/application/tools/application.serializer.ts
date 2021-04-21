import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { classToPlain, plainToClass } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import {
  Application as BaseApplication,
  ApplicationTemplateHelper,
  ApplicationTypes,
} from '@island.is/application/core'
import {
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { IntlService } from '@island.is/api/domains/translations'
import { Locale } from '@island.is/shared/types'
import { getCurrentUser } from '@island.is/auth-nest-tools'

import { Application } from '../application.model'
import { ApplicationResponseDto } from '../dto/application.response.dto'
import { getCurrentLocale } from '../utils/currentLocale'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<unknown>> {
  constructor(private intlService: IntlService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const user = getCurrentUser(context)
    const locale = getCurrentLocale(context)

    return next.handle().pipe(
      map(async (res: Application | Array<Application>) => {
        const isArray = Array.isArray(res)
        return isArray
          ? Promise.all(
              (res as Application[]).map((item) =>
                this.serialize(item, user.nationalId, locale),
              ),
            )
          : this.serialize(res as Application, user.nationalId, locale)
      }),
    )
  }

  async serialize(model: Application, nationalId: string, locale: Locale) {
    const application = model.toJSON() as BaseApplication
    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)
    const stateInfo = helper.getApplicationStateInfo()
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)

    const dto = plainToClass(ApplicationResponseDto, {
      ...application,
      ...helper.getReadableAnswersAndExternalData(
        template.mapUserToRole(nationalId, application) ?? '',
      ),
      stateTitle: stateInfo.title ? intl.formatMessage(stateInfo.title) : null,
      stateDescription: stateInfo.description
        ? intl.formatMessage(stateInfo.description)
        : null,
      name: intl.formatMessage(template.name),
      progress: helper.getApplicationProgress(),
    })

    return classToPlain(dto)
  }
}
