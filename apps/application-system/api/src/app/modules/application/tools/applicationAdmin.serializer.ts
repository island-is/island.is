import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationTypes,
  Application as BaseApplication,
} from '@island.is/application/types'
import { IntlService } from '@island.is/cms-translations'
import { Locale } from '@island.is/shared/types'
import { getCurrentUser } from '@island.is/auth-nest-tools'

import {
  Application,
  TemplateService,
  ApplicationPaginatedResponse,
} from '@island.is/application/api/core'
import { ApplicationResponseDto } from '../dto/application.response.dto'

import { getCurrentLocale } from '../utils/currentLocale'
import {
  HistoryService,
  History,
  HistoryBuilder,
} from '@island.is/application/api/history'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { PaymentService } from '@island.is/application/api/payment'
import {
  getApplicantName,
  getApplicationNameTranslationString,
  getPaymentStatusForAdmin,
} from '../utils/application'
import { ApplicationListAdminResponseDto } from '../dto/applicationAdmin.response.dto'

@Injectable()
export class ApplicationAdminSerializer
  implements NestInterceptor<Application, Promise<unknown>>
{
  constructor(
    private intlService: IntlService,
    private historyService: HistoryService,
    private historyBuilder: HistoryBuilder,
    private featureFlagService: FeatureFlagService,
    private paymentService: PaymentService,
    private readonly templateService: TemplateService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const user = getCurrentUser(context)
    const locale = getCurrentLocale(context)

    return next.handle().pipe(
      map(
        async (
          res: Application | Array<Application> | ApplicationPaginatedResponse,
        ) => {
          const isArray = Array.isArray(res)

          const showHistory = await this.featureFlagService.getValue(
            Features.applicationSystemHistory,
            false,
            user,
          )
          if (isArray) {
            const applications = res as Application[]
            return this.serializeArray(
              applications,
              showHistory,
              user.nationalId,
              locale,
            )
          }
          if ((res as ApplicationPaginatedResponse).rows) {
            const data = res as ApplicationPaginatedResponse
            const applications = data.rows as Application[]

            data.rows = (await this.serializeArray(
              applications,
              showHistory,
              user.nationalId,
              locale,
            )) as Application[]
            return data
          }

          return this.serialize(res as Application, user.nationalId, locale)
        },
      ),
    )
  }

  async serialize(
    model: Application,
    nationalId: string,
    locale: Locale,
    historyModel: History[] = [],
    showHistory = true,
  ) {
    const application = model.toJSON() as BaseApplication
    const template = await this.templateService.getApplicationTemplate(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)
    const actionCardMeta = helper.getApplicationActionCardMeta()
    const namespaces =
      await this.templateService.getApplicationTranslationNamespaces(
        application,
      )
    const intl = await this.intlService.useIntl(namespaces, locale)

    const userRole = template.mapUserToRole(nationalId, application) ?? ''

    const roleInState = helper.getRoleInState(userRole)
    const actors =
      application.applicant === nationalId ? application.applicantActors : []

    const pendingAction = showHistory
      ? helper.getCurrentStatePendingAction(
          application,
          userRole,
          intl.formatMessage,
          nationalId,
        )
      : undefined

    const history = showHistory
      ? await this.historyBuilder.buildApplicationHistory(
          historyModel,
          intl.formatMessage,
          helper,
        )
      : undefined

    const payment = await this.paymentService.findPaymentByApplicationId(
      application.id,
    )

    const dto = plainToInstance(ApplicationListAdminResponseDto, {
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
        pendingAction,
        history,
        draftFinishedSteps: application.draftFinishedSteps,
        draftTotalSteps: application.draftTotalSteps,
      },
      name: getApplicationNameTranslationString(
        template,
        application,
        intl.formatMessage,
      ),
      institution: template.institution
        ? intl.formatMessage(template.institution)
        : null,
      progress: helper.getApplicationProgress(),
      answers: [],
      externalData: [],
      paymentStatus: getPaymentStatusForAdmin(payment),
      applicantName: getApplicantName(application),
    })
    return instanceToPlain(dto)
  }

  async serializeArray(
    applications: Application[],
    showHistory: boolean,
    nationalId: string,
    locale: Locale,
  ) {
    let histories: History[] = []
    if (showHistory) {
      histories = await this.historyService.getStateHistory(
        applications.map((item) => item.id),
      )
    }

    return Promise.all(
      applications.map((item) =>
        this.serialize(
          item,
          nationalId,
          locale,
          histories.filter((x) => x.application_id === item.id),
          showHistory,
        ),
      ),
    )
  }
}
