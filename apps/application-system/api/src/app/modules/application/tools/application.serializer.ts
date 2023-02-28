import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import {
  ApplicationTemplateHelper,
  getValueViaPath,
} from '@island.is/application/core'
import {
  ApplicationTypes,
  Application as BaseApplication,
} from '@island.is/application/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { IntlService } from '@island.is/cms-translations'
import { Locale } from '@island.is/shared/types'
import { getCurrentUser } from '@island.is/auth-nest-tools'

import { Application } from '@island.is/application/api/core'
import {
  ApplicationListAdminResponseDto,
  ApplicationResponseDto,
} from '../dto/application.response.dto'
import { getCurrentLocale } from '../utils/currentLocale'
import isObject from 'lodash/isObject'
import { PaymentService } from '@island.is/application/api/payment'
import { ApplicationController } from '../application.controller'

@Injectable()
export class ApplicationSerializer
  implements NestInterceptor<Application, Promise<unknown>> {
  constructor(
    private intlService: IntlService,
    private paymentService: PaymentService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const user = getCurrentUser(context)
    const locale = getCurrentLocale(context)
    const handlerName = context.getHandler().name

    return next.handle().pipe(
      map(async (res: Application | Array<Application>) => {
        const isArray = Array.isArray(res)

        if (isArray) {
          return Promise.all(
            (res as Application[]).map((item) =>
              this.serialize(item, user.nationalId, locale, handlerName),
            ),
          )
        }

        return this.serialize(
          res as Application,
          user.nationalId,
          locale,
          handlerName,
        )
      }),
    )
  }

  async serialize(
    model: Application,
    nationalId: string,
    locale: Locale,
    handlerName: string,
  ) {
    const application = model.toJSON() as BaseApplication
    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)
    const actionCardMeta = helper.getApplicationActionCardMeta()
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)

    const userRole = template.mapUserToRole(nationalId, application) ?? ''

    const roleInState = helper.getRoleInState(userRole)
    const actors =
      application.applicant === nationalId ? application.applicantActors : []

    const getApplicationName = () => {
      if (typeof template.name === 'function') {
        const returnValue = template.name(application)
        if (
          isObject(returnValue) &&
          'value' in returnValue &&
          'name' in returnValue
        ) {
          return intl.formatMessage(returnValue.name, {
            value: returnValue.value,
          })
        }
        return intl.formatMessage(returnValue)
      }
      return intl.formatMessage(template.name)
    }

    const commonPropsDto = {
      ...application,
      ...helper.getReadableAnswersAndExternalData(userRole),
      applicationActors: actors,
      actionCard: {
        title: actionCardMeta.title
          ? intl.formatMessage(actionCardMeta.title)
          : null,
        description: actionCardMeta.description
          ? intl.formatMessage(actionCardMeta.description)
          : null,
        tag: {
          variant: actionCardMeta.tag.variant || null,
          label: actionCardMeta.tag.label
            ? intl.formatMessage(actionCardMeta.tag.label)
            : null,
        },
        deleteButton: roleInState?.delete,
        draftFinishedSteps: application.draftFinishedSteps,
        draftTotalSteps: application.draftTotalSteps,
      },
      name: getApplicationName(),
      institution: template.institution
        ? intl.formatMessage(template.institution)
        : null,
      progress: helper.getApplicationProgress(),
    }

    // Special case for admin list
    if (handlerName === ApplicationController.prototype.findAllAdmin.name) {
      const payment = await this.paymentService.findPaymentByApplicationId(
        application.id,
      )

      const getApplicantName = () => {
        if (application.externalData.nationalRegistry) {
          return getValueViaPath(
            application.externalData,
            'nationalRegistry.data.fullName',
          )
        }
        if (application.externalData.identity) {
          return getValueViaPath(
            application.externalData,
            'identity.data.fullName',
          )
        }
        return null
      }

      const getPaymentStatus = () => {
        if (payment?.fulfilled) {
          return 'paid'
        }
        if (payment?.created) {
          return 'unpaid'
        }
        return null
      }
      const dtoAdmin = plainToInstance(ApplicationListAdminResponseDto, {
        ...commonPropsDto,
        answers: [],
        externalData: [],
        paymentStatus: getPaymentStatus(),
        applicantName: getApplicantName(),
      })
      return instanceToPlain(dtoAdmin)
    } else {
      const dto = plainToInstance(ApplicationResponseDto, commonPropsDto)
      return instanceToPlain(dto)
    }
  }
}
