import { Injectable } from '@nestjs/common'

import {
  ApproveOptions,
  CurrentApplication,
  FAApplication,
  findFamilyStatus,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationState,
  FileType,
  UserType,
} from '@island.is/financial-aid/shared/lib'
import {
  ApplicationApi,
  MunicipalityApi,
  MunicipalityModel,
  PersonalTaxReturnApi,
} from '@island.is/clients/municipalities-financial-aid'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationAnswerFile,
  ApplicationTypes,
} from '@island.is/application/types'
import { FetchError } from '@island.is/clients/middlewares'
import { messages } from '@island.is/application/templates/financial-aid'
import { TemplateApiError } from '@island.is/nest/problem'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: FAApplication
}

@Injectable()
export class FinancialAidService extends BaseTemplateApiService {
  constructor(
    private applicationApi: ApplicationApi,
    private municipalityApi: MunicipalityApi,
    private personalTaxReturnApi: PersonalTaxReturnApi,
  ) {
    super(ApplicationTypes.FINANCIAL_AID)
  }

  private applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private municipalityApiWithAuth(auth: Auth) {
    return this.municipalityApi.withMiddleware(new AuthMiddleware(auth))
  }

  personalTaxReturnApiWithAuth(auth: Auth) {
    return this.personalTaxReturnApi.withMiddleware(new AuthMiddleware(auth))
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return null
    }
    throw new TemplateApiError(
      {
        title: messages.serviceErrors.veita.title,
        summary: messages.serviceErrors.veita.summary,
      },
      500,
    )
  }

  async createApplication({
    application,
    auth,
  }: Props): Promise<CurrentApplication> {
    const { id, answers, externalData } = application

    if (externalData.currentApplication.data?.currentApplicationId) {
      return {
        currentApplicationId:
          externalData.currentApplication.data.currentApplicationId,
      }
    }

    const formatFiles = (files: ApplicationAnswerFile[], type: FileType) => {
      if (!files || files.length <= 0) {
        return []
      }
      return files.map((f) => {
        return {
          name: f.name ?? '',
          key: f.key ?? '',
          size: 0,
          type: type,
        }
      })
    }

    const spouseTaxFiles = () => {
      if (
        externalData?.taxDataSpouse?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn == null
      ) {
        return []
      }
      return [
        externalData?.taxDataSpouse?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn,
      ]
    }

    const applicantTaxFiles = () => {
      if (
        externalData?.taxData?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn == null
      ) {
        return []
      }
      return [
        externalData?.taxData?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn,
      ]
    }

    const directTaxPayments = () => {
      if (externalData?.taxDataSpouse?.data) {
        return externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.directTaxPayments.concat(
          externalData?.taxDataSpouse?.data.municipalitiesDirectTaxPayments
            ?.directTaxPayments,
        )
      }
      return externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.directTaxPayments.map(
        (d) => {
          d.userType = application.assignees.includes(auth.nationalId)
            ? UserType.SPOUSE
            : UserType.APPLICANT
          return d
        },
      )
    }

    const files = formatFiles(answers.taxReturnFiles, FileType.TAXRETURN)
      .concat(formatFiles(answers.incomeFiles, FileType.INCOME))
      .concat(formatFiles(answers.spouseIncomeFiles, FileType.SPOUSEFILES))
      .concat(formatFiles(answers.spouseTaxReturnFiles, FileType.SPOUSEFILES))
      .concat(formatFiles(spouseTaxFiles(), FileType.SPOUSEFILES))
      .concat(formatFiles(applicantTaxFiles(), FileType.TAXRETURN))

    const newApplication = {
      name: externalData.nationalRegistry.data.fullName,
      nationalId: externalData.nationalRegistry.data.nationalId,
      phoneNumber: answers.contactInfo.phone,
      email: answers.contactInfo.email,
      homeCircumstances: answers.homeCircumstances.type,
      homeCircumstancesCustom: answers.homeCircumstances.custom,
      student: Boolean(answers.student.isStudent === ApproveOptions.Yes),
      studentCustom: answers.student.custom,
      hasIncome: Boolean(answers.income === ApproveOptions.Yes),
      usePersonalTaxCredit: Boolean(
        answers.personalTaxCredit === ApproveOptions.Yes,
      ),
      bankNumber: answers.bankInfo.bankNumber,
      ledger: answers.bankInfo.ledger,
      accountNumber: answers.bankInfo.accountNumber,
      employment: answers.employment.type,
      employmentCustom: answers.employment.custom,
      formComment: answers.formComment,
      state: ApplicationState.NEW,
      files: files,
      spouseNationalId:
        externalData.nationalRegistrySpouse.data?.nationalId ||
        answers.relationshipStatus?.spouseNationalId,
      spouseEmail:
        answers.spouseContactInfo?.email ||
        answers.spouse?.email ||
        answers.relationshipStatus?.spouseEmail,
      spousePhoneNumber: answers.spouseContactInfo?.phone,
      spouseName:
        externalData.nationalRegistrySpouse.data?.name || answers.spouseName,
      spouseFormComment: answers.spouseFormComment,
      familyStatus: findFamilyStatus(answers, externalData),
      streetName: externalData.nationalRegistry.data.address?.streetAddress,
      postalCode: externalData.nationalRegistry.data.address?.postalCode,
      city: externalData.nationalRegistry.data.address?.locality,
      municipalityCode:
        externalData.nationalRegistry.data.address?.municipalityCode,
      directTaxPayments: directTaxPayments(),
      hasFetchedDirectTaxPayment:
        externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.success,
      spouseHasFetchedDirectTaxPayment:
        externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
          ?.success,
      applicationSystemId: id,
    }

    return await this.applicationApiWithAuth(auth)
      .applicationControllerCreate({
        createApplicationDto: newApplication as any,
      })
      .then((res) => {
        return { currentApplicationId: res.id }
      })
      .catch(() => {
        throw new TemplateApiError(
          {
            title: messages.serviceErrors.createApplication.title,
            summary: messages.serviceErrors.createApplication.summary,
          },
          500,
        )
      })
  }

  async currentApplication({
    auth,
  }: Props): Promise<CurrentApplication | null> {
    const currentApplicationId = await this.applicationApiWithAuth(auth)
      .applicationControllerGetCurrentApplication()
      .catch(this.handle404)
    return currentApplicationId
      ? {
          currentApplicationId: currentApplicationId,
        }
      : null
  }

  async municipality({
    auth,
    application,
  }: Props): Promise<MunicipalityModel | null> {
    const municiplaityCode =
      application.externalData.nationalRegistry.data.address?.municipalityCode
    if (municiplaityCode == null) {
      return null
    }

    return await this.municipalityApiWithAuth(auth)
      .municipalityControllerGetById({ id: municiplaityCode })
      .catch(this.handle404)
  }

  async taxData({ auth, application }: Props): Promise<TaxData> {
    try {
      const personalTaxReturn = await this.personalTaxReturnApiWithAuth(
        auth,
      ).personalTaxReturnControllerMunicipalitiesPersonalTaxReturn({
        id: application.id,
      })
      const directTaxPayments = await this.personalTaxReturnApiWithAuth(
        auth,
      ).personalTaxReturnControllerMunicipalitiesDirectTaxPayments()

      return {
        municipalitiesPersonalTaxReturn:
          personalTaxReturn as TaxData['municipalitiesPersonalTaxReturn'],
        municipalitiesDirectTaxPayments:
          directTaxPayments as TaxData['municipalitiesDirectTaxPayments'],
      }
    } catch {
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.tax.title,
          summary: messages.serviceErrors.tax.summary,
        },
        500,
      )
    }
  }

  async sendSpouseEmail({
    auth,
    application,
  }: Props): Promise<{ success: boolean }> {
    const { answers, externalData } = application
    try {
      return await this.applicationApiWithAuth(
        auth,
      ).applicationControllerSendSpouseEmail({
        spouseEmailDto: {
          name: externalData.nationalRegistry.data.fullName,
          email: answers.contactInfo.email,
          spouseName:
            externalData.nationalRegistrySpouse.data?.name ||
            answers.spouseName ||
            '',
          spouseEmail:
            answers.spouse?.email ||
            answers.relationshipStatus.spouseEmail ||
            '',
          municipalityCode:
            externalData.municipality.data?.municipalityId || '',
          created: application.created,
          applicationSystemId: application.id,
        },
      })
    } catch {
      return {
        success: false,
      }
    }
  }
}
