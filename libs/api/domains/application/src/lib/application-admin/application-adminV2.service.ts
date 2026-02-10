import { Injectable } from '@nestjs/common'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'

import { ApplicationsApi, PaymentsApi } from '../../gen/fetch'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { ApplicationApplicationsInput } from './dto/applicationApplications.input'
import { ApplicationPayment } from './application.model'
import { AttachmentPresignedUrlInput } from './dto/AttachmentPresignedUrl.input'
import { DeleteApplicationInput } from './dto/deleteApplication.input'
import {
  ApplicationsSuperAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationsAdminFilters,
  ApplicationTypesInstitutionAdminInput,
} from './application-admin/dto/applications-admin-inputs'
import { ApplicationCard } from '../applicationV2.model'

@Injectable()
export class ApplicationAdminV2Service {
  constructor(
    private applicationApi: ApplicationsApi,
    private applicationPaymentApi: PaymentsApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async findAllSuperAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsSuperAdminFilters,
  ) {
    // TODOxy Veit ekki hvort við getum notað ApplicationCard, en það er notað á mínum síðum og væri nice að geta samnýtt.
    // Mínar síður útfæra samt ekki paging í dag svo líklegast þarf bæta við stuðningi við paging.

    let appSystemCards: ApplicationCard[] = []
    let formSystemCards: ApplicationCard[] = []
    const returnCards: ApplicationCard[] = []

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(user).adminControllerFindAllSuperAdmin({
        count: filters.count,
        page: filters.page,
        applicantNationalId: filters.applicantNationalId,
        locale,
        status: filters.status?.join(','),
        from: filters.from,
        to: filters.to,
        typeIdValue: filters.typeIdValue,
        searchStr: filters.searchStr,
      }),
      // TODOxy útfæra endapunkt í form-system
      this.formSystemApplicationsApiWithAuth(
        user,
      ).applicationsControllerFindAllByUser({
        locale,
      }),
    ])

    // Hér þarf mögulega að mappa einhver gögn svo þau passi við týpuna.
    appSystemCards = appSystemSettled.value
    formSystemCards = formSystemSettled.value

    returnCards.add(formSystemCards).add(appSystemCards)

    //TODOxy: Til að styðja við paging í báðum kerfum þurfum við bæði date og síðan id sem tie-breaker ef date er jafnt.
    //Það þarf þá að bæta við í graphql kallið að senda síðasta date og id sem var birt á síðunni til að geta notað
    //það sem upphafspunkt fyrir næstu blaðsíðu.
    //Smá galli í þessari útfærslu að það er basically ekki hægt að fara frá bls 1 yfir á bls 10.
    //Er samt með einhverjar pælingar um hvernig við gætum leyst það.
    returnCards.sort(this.applicationCardComparatorDesc)
    returnCards.slice(0, count)

    return returnCards
  }

  private applicationCardComparatorDesc = (
    a: ApplicationCard,
    b: ApplicationCard,
  ): number => {
    const createdDiff = b.created.getTime() - a.created.getTime()
    if (createdDiff !== 0) {
      return createdDiff
    }

    return a.id.localeCompare(b.id)
  }
}
