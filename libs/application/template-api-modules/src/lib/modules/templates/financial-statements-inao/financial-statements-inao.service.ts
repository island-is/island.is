import { Injectable } from '@nestjs/common'
import {
  CemeteryFinancialStatementValues,
  FinancialStatementsInaoClientService,
  PersonalElectionFinancialStatementValues,
  PoliticalPartyFinancialStatementValues,
} from '@island.is/clients/financial-statements-inao'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
import {
  mapValuesToIndividualtype,
  mapValuesToPartytype,
  mapValuesToCemeterytype,
} from './mappers/mapValuesToUsertype'
import { USERTYPE } from './types'

const LESS = 'less'

export const getCurrentUserType = (answers: any, externalData: any) => {
  const fakeUserType: any = getValueViaPath(answers, 'fakeData.options')
  const currentUserType: any = getValueViaPath(
    externalData,
    'getUserType.data.value',
  )
  return fakeUserType ? fakeUserType : currentUserType
}

export interface DataResponse {
  success: boolean
  message?: string
}
@Injectable()
export class FinancialStatementsInaoTemplateService {
  constructor(
    private financialStatementsClientService: FinancialStatementsInaoClientService,
  ) {}

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth

    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementsClientService.getClientType(
        'Einstaklingur',
      )
    } else {
      return this.financialStatementsClientService.getUserClientType(nationalId)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    const answers = application.answers
    const externalData = application.externalData
    const currentUserType = getCurrentUserType(answers, externalData)

    if (currentUserType === USERTYPE.INDIVIDUAL) {
      const values: PersonalElectionFinancialStatementValues = mapValuesToIndividualtype(
        answers,
      )

      const electionId = getValueViaPath(
        answers,
        'election.selectElection',
      ) as string
      const clientName = getValueViaPath(answers, 'about.fullName') as string
      const electionIncomeLimit = getValueViaPath(
        answers,
        'election.incomeLimit',
      ) as string

      const noValueStatement = electionIncomeLimit === LESS ? true : false

      // actor is undefined until we add the delegate functionality to the frontend
      const result: DataResponse = await this.financialStatementsClientService
        .postFinancialStatementForPersonalElection(
          nationalId,
          undefined,
          electionId,
          noValueStatement,
          clientName,
          values,
        )
        .then((data) => {
          if (data === true) {
            return { success: true }
          } else {
            return { success: false }
          }
        })
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else if (currentUserType === USERTYPE.PARTY) {
      const values: PoliticalPartyFinancialStatementValues = mapValuesToPartytype(
        answers,
      )
      const year = getValueViaPath(
        answers,
        'conditionalAbout.operatingYear',
      ) as string

      // default to comment to empty string, currently there's no comment field
      const comment = ''

      const result: DataResponse = await this.financialStatementsClientService
        .postFinancialStatementForPoliticalParty(
          nationalId,
          undefined,
          year,
          comment,
          values,
        )
        .then((data) => {
          if (data === true) {
            return { success: true }
          } else {
            return { success: false }
          }
        })
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    } else if (currentUserType === USERTYPE.CEMETRY) {
      const values: CemeteryFinancialStatementValues = mapValuesToCemeterytype(
        answers,
      )
      const year = getValueViaPath(
        answers,
        'conditionalAbout.operatingYear',
      ) as string

      // default to comment to empty string, currently there's no comment field
      const comment = ''

      const result: DataResponse = await this.financialStatementsClientService
        .postFinancialStatementForCemetery(
          nationalId,
          undefined,
          year,
          comment,
          values,
        )
        .then((data) => {
          if (data === true) {
            return { success: true }
          } else {
            return { success: false }
          }
        })
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })
      if (!result.success) {
        throw new Error(`Application submission failed`)
      }
      return { success: result.success }
    }
  }
}
