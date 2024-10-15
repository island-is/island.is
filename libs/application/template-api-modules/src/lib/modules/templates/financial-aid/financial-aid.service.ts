import { Injectable } from '@nestjs/common'

import {
  FinancialAidAnswers,
  ApproveOptions,
  ChildrenSchoolInfo,
  CurrentApplication,
  FinancialAidExternalData,
  findFamilyStatus,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationState,
  FileType,
  PersonalTaxReturn,
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
  Application,
  ApplicationAnswerFile,
  ApplicationTypes,
} from '@island.is/application/types'
import { FetchError } from '@island.is/clients/middlewares'
import { messages } from '@island.is/application/templates/financial-aid'
import { TemplateApiError } from '@island.is/nest/problem'
import { getValueViaPath } from '@island.is/application/core'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: Application
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
    const answersSchema = answers as FinancialAidAnswers
    const externalDataSchema =
      externalData as unknown as FinancialAidExternalData
    const currentApplicationId = getValueViaPath(
      externalData,
      'currentApplication.data.currentApplicationId',
    ) as string | undefined

    const childrenSchoolInfo = getValueViaPath(
      answers,
      'childrenSchoolInfo',
    ) as Array<ChildrenSchoolInfo>

    if (currentApplicationId) {
      return {
        currentApplicationId,
      }
    }
    const children = answers.childrenSchoolInfo
      ? childrenSchoolInfo.map((child) => {
          return {
            name: child.fullName,
            nationalId: child.nationalId,
            school: child.school,
            livesWithApplicant: child.livesWithApplicant,
            livesWithBothParents: child.livesWithBothParents,
          }
        })
      : []

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

    const personalTaxReturn = getValueViaPath(
      externalData,
      'taxData.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
    ) as PersonalTaxReturn | undefined

    const spouseTaxReturn = getValueViaPath(
      externalData,
      'taxDataSpouse.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
    ) as PersonalTaxReturn | undefined

    const spouseTaxFiles = () => {
      if (spouseTaxReturn == null) {
        return []
      }
      return [spouseTaxReturn]
    }

    const applicantTaxFiles = () => {
      if (personalTaxReturn == null) {
        return []
      }
      return [personalTaxReturn]
    }

    const directTaxPayments = () => {
      if (externalDataSchema?.taxDataSpouse?.data) {
        externalDataSchema?.taxData?.data?.municipalitiesDirectTaxPayments?.directTaxPayments.concat(
          externalDataSchema?.taxDataSpouse?.data
            .municipalitiesDirectTaxPayments?.directTaxPayments,
        )
      }
      return externalDataSchema?.taxData?.data?.municipalitiesDirectTaxPayments?.directTaxPayments.map(
        (d) => {
          d.userType = application.assignees.includes(auth.nationalId)
            ? UserType.SPOUSE
            : UserType.APPLICANT
          return d
        },
      )
    }

    const files = formatFiles(
      answersSchema?.taxReturnFiles ?? [],
      FileType.TAXRETURN,
    )
      .concat(formatFiles(answersSchema.incomeFiles ?? [], FileType.INCOME))
      .concat(
        formatFiles(
          answersSchema.spouseIncomeFiles ?? [],
          FileType.SPOUSEFILES,
        ),
      )
      .concat(
        formatFiles(
          answersSchema.spouseTaxReturnFiles ?? [],
          FileType.SPOUSEFILES,
        ),
      )
      .concat(formatFiles(spouseTaxFiles(), FileType.SPOUSEFILES))
      .concat(formatFiles(applicantTaxFiles(), FileType.TAXRETURN))
      .concat(
        formatFiles(answersSchema.childrenFiles ?? [], FileType.CHILDRENFILES),
      )

    const newApplication = {
      name: externalDataSchema.nationalRegistry.data.fullName,
      nationalId: externalDataSchema.nationalRegistry.data.nationalId,
      phoneNumber: answersSchema.contactInfo.phone,
      email: answersSchema.contactInfo.email,
      homeCircumstances: answersSchema.homeCircumstances.type,
      homeCircumstancesCustom: answersSchema.homeCircumstances.custom,
      student: Boolean(answersSchema.student.isStudent === ApproveOptions.Yes),
      studentCustom: answersSchema.student.custom,
      hasIncome: Boolean(answersSchema.income.type === ApproveOptions.Yes),
      usePersonalTaxCredit: Boolean(
        answersSchema.personalTaxCredit.type === ApproveOptions.Yes,
      ),
      bankNumber: answersSchema.bankInfo.accountNumber,
      ledger: answersSchema.bankInfo.accountNumber,
      accountNumber: answersSchema.bankInfo.accountNumber,
      employment: answersSchema.employment.type,
      employmentCustom: answersSchema.employment.custom,
      formComment: answersSchema.formComment,
      state: ApplicationState.NEW,
      files: files,
      children,
      childrenComment: answersSchema.childrenComment,
      spouseNationalId:
        externalDataSchema.nationalRegistrySpouse.data?.nationalId ||
        answersSchema.relationshipStatus?.spouseNationalId,
      spouseEmail:
        answersSchema.spouseContactInfo?.email ||
        answersSchema.spouse?.email ||
        answersSchema.relationshipStatus?.spouseEmail,
      spousePhoneNumber: answersSchema.spouseContactInfo?.phone,
      spouseName:
        externalDataSchema.nationalRegistrySpouse.data?.name ||
        answersSchema.spouseName,
      spouseFormComment: answersSchema.spouseFormComment,
      familyStatus: findFamilyStatus(answersSchema, externalData),
      streetName:
        externalDataSchema.nationalRegistry.data.address?.streetAddress,
      postalCode: externalDataSchema.nationalRegistry.data.address?.postalCode,
      city: externalDataSchema.nationalRegistry.data.address?.locality,
      municipalityCode:
        externalDataSchema.nationalRegistry.data.address?.municipalityCode,
      directTaxPayments: directTaxPayments(),
      hasFetchedDirectTaxPayment:
        externalDataSchema?.taxData?.data?.municipalitiesDirectTaxPayments
          ?.success,
      spouseHasFetchedDirectTaxPayment:
        externalDataSchema?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
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
    const municiplaityCode = getValueViaPath(
      application.externalData,
      'nationalRegistry.data.address.municipalityCode',
    ) as string
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
    const answersSchema = answers as unknown as FinancialAidAnswers
    const externalDataSchema =
      externalData as unknown as FinancialAidExternalData
    try {
      return await this.applicationApiWithAuth(
        auth,
      ).applicationControllerSendSpouseEmail({
        spouseEmailDto: {
          name: externalDataSchema.nationalRegistry.data.fullName,
          email: answersSchema.contactInfo.email,
          spouseName:
            externalDataSchema.nationalRegistrySpouse.data?.name ||
            answersSchema.spouseName ||
            '',
          spouseEmail:
            answersSchema.spouse?.email ||
            answersSchema.relationshipStatus.spouseEmail ||
            '',
          municipalityCode:
            externalDataSchema.municipality.data?.municipalityId || '',
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
