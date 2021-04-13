import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common'
import { classToPlain, plainToClass } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import {
  Application as BaseApplication,
  ApplicationTemplateHelper,
  ApplicationTypes,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  IntlService,
  TranslationsService,
} from '@island.is/api/domains/translations'
import { getCurrentLocale } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'

import { Application } from '../application.model'
import { ApplicationResponseDto } from '../dto/application.response.dto'
import { getNationalIdFromToken } from '../utils/tokenUtils'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<unknown>> {
  constructor(
    private translationsService: TranslationsService,
    private intlService: IntlService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const locale = getCurrentLocale(context)
    let nationalId: string

    try {
      nationalId = getNationalIdFromToken(context)
    } catch (e) {
      throw new UnauthorizedException('You are not authenticated')
    }

    return next.handle().pipe(
      map(async (res: Application | Array<Application>) => {
        const isArray = Array.isArray(res)
        return isArray
          ? Promise.all(
              (res as Application[]).map((item) =>
                this.serialize(item, nationalId, locale),
              ),
            )
          : this.serialize(res as Application, nationalId, locale)
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

    // We load the core namespace for the application system + the ones defined in the application template
    const namespaces = ['application.system', ...(template?.translations ?? [])]

    await this.translationsService.fetchNamespaces(namespaces)

    this.intlService.setConfig({ namespaces, locale })

    const dto = plainToClass(ApplicationResponseDto, {
      ...application,
      ...helper.getReadableAnswersAndExternalData(
        template.mapUserToRole(nationalId, application) ?? '',
      ),
      stateTitle: stateInfo.title
        ? this.intlService.formatMessage(stateInfo.title)
        : null,
      stateDescription: stateInfo.description
        ? this.intlService.formatMessage(stateInfo.description)
        : null,
      name: this.intlService.formatMessage(template.name),
      progress: helper.getApplicationProgress(),
    })

    return classToPlain(dto)
  }
}
