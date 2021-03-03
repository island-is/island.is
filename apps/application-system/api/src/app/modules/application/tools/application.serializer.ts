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
  applicationSystemMessages,
  TranslationsService,
} from '@island.is/application/translations'
import { Locale } from '@island.is/auth-nest-tools'

import { Application } from '../application.model'
import { ApplicationResponseDto } from '../dto/application.response.dto'
import { getNationalIdFromToken } from '../utils/tokenUtils'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<unknown>> {
  constructor(private readonly translationsService: TranslationsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const locale = context.switchToHttp().getRequest().headers.locale
    // console.log('-intercept headers', headers)
    // const locale = 'is' as any

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
    console.log('-/////// serialize', locale)
    const application = model.toJSON() as BaseApplication
    // console.log('-application', application)

    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
      this.translationsService.formatMessage,
    )

    // console.log(
    //   '-serialize template',
    //   template,
    //   '////////////////////////',
    //   locale,
    // )

    const message = this.translationsService.formatMessage(
      applicationSystemMessages.parentalLeave.name.defaultMessage,
      locale,
    )
    console.log('-message', message)

    const helper = new ApplicationTemplateHelper(application, template)
    const isApplicant = nationalId === application.applicant

    const dto = plainToClass(ApplicationResponseDto, {
      ...application,
      ...helper.getReadableAnswersAndExternalData(
        template.mapUserToRole(nationalId, application) ?? '',
      ),
      isApplicant,
      isAssignee:
        !isApplicant &&
        application.assignees.some((assignee) => assignee === nationalId),
      // name: template.name,
      name: message,
      progress: helper.getApplicationProgress(),
    })

    return classToPlain(dto)
  }
}
