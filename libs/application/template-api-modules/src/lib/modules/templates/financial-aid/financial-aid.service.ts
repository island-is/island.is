import { Injectable } from '@nestjs/common'

import {
  ApproveOptions,
  FAApplication,
  findFamilyStatus,
} from '@island.is/application/templates/financial-aid'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationState, FileType } from '@island.is/financial-aid/shared/lib'
import { ApplicationApi } from '@island.is/clients/municipalities-financial-aid'
import { UploadFile } from '@island.is/island-ui/core'

import { TemplateApiModuleActionProps } from '../../../types'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: FAApplication
}

@Injectable()
export class FinancialAidService {
  constructor(private applicationApi: ApplicationApi) {}

  private applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private formatFiles(files: UploadFile[], type: FileType) {
    if (!files) {
      return []
    }
    return files.map((f) => {
      return {
        name: f.name ?? '',
        key: f.key ?? '',
        size: f.size ?? 0,
        type: type,
      }
    })
  }

  async createApplication({ application, auth }: Props) {
    const { id, answers, externalData } = application

    const files = this.formatFiles(answers.taxReturnFiles, FileType.TAXRETURN)
      .concat(this.formatFiles(answers.incomeFiles, FileType.INCOME))
      .concat(this.formatFiles(answers.spouseIncomeFiles, FileType.SPOUSEFILES))
      .concat(
        this.formatFiles(answers.spouseTaxReturnFiles, FileType.SPOUSEFILES),
      )
      .concat(
        this.formatFiles(
          [
            externalData?.taxDataFetchSpouse?.data
              ?.municipalitiesPersonalTaxReturn?.personalTaxReturn,
          ],
          FileType.SPOUSEFILES,
        ),
      )
      .concat(
        this.formatFiles(
          [
            externalData?.taxDataFetch?.data?.municipalitiesPersonalTaxReturn
              ?.personalTaxReturn,
          ],
          FileType.TAXRETURN,
        ),
      )

    const directTaxPayments = externalData?.taxDataFetchSpouse?.data
      ? [
          externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
            ?.directTaxPayments,
        ].concat([
          externalData?.taxDataFetchSpouse?.data.municipalitiesDirectTaxPayments
            ?.directTaxPayments,
        ])
      : [
          externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
            ?.directTaxPayments,
        ]

    const newApplication = {
      name: externalData.nationalRegistry.data.applicant.fullName,
      nationalId: externalData.nationalRegistry.data.applicant.nationalId,
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
        externalData.nationalRegistry.data.applicant.spouse?.nationalId ||
        answers.relationshipStatus?.spouseNationalId,
      spouseEmail:
        answers.spouseContactInfo?.email ||
        answers.spouse?.email ||
        answers.relationshipStatus?.spouseEmail,
      spousePhoneNumber: answers.spouseContactInfo?.phone,
      spouseName: externalData.nationalRegistry.data.applicant.spouse?.name,
      spouseFormComment: answers.spouseFormComment,
      familyStatus: findFamilyStatus(answers, externalData),
      streetName:
        externalData.nationalRegistry.data.applicant.address.streetName,
      postalCode:
        externalData.nationalRegistry.data.applicant.address.postalCode,
      city: externalData.nationalRegistry.data.applicant.address.city,
      municipalityCode:
        externalData.nationalRegistry.data.applicant.address.municipalityCode,
      directTaxPayments: directTaxPayments,
      hasFetchedDirectTaxPayment:
        externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
          ?.success,
      spouseHasFetchedDirectTaxPayment:
        externalData?.taxDataFetchSpouse?.data?.municipalitiesDirectTaxPayments
          ?.success,
      applicationSystemId: id,
    }

    return await this.applicationApiWithAuth(auth)
      .applicationControllerCreate({
        createApplicationDto: newApplication as any,
      })
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw error
      })
  }
}
