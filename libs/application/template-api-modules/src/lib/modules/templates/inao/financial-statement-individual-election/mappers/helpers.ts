import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  Client,
  DigitalSignee,
  PersonalElectionFinancialStatementValues,
  PersonalElectionSubmitInput,
} from '@island.is/clients/financial-statements-inao'
import { mapValuesToIndividualtype } from './mapValuesToUserTypes'

export enum FinancialElectionIncomeLimit {
  LESS = 'less',
  GREATER = 'greater',
}

export const getIndividualElectionValues = (answers: FormValue) => {
  const incomeLimit = getValueViaPath<string>(answers, 'incomeLimit.limit')
  const electionId = getValueViaPath<string>(answers, 'election.electionId')
  const clientName = getValueViaPath<string>(answers, 'about.fullName')
  const clientPhone = getValueViaPath<string>(answers, 'about.phoneNumber')
  const clientEmail = getValueViaPath<string>(answers, 'about.email')
  const noValueStatement = incomeLimit === FinancialElectionIncomeLimit.LESS

  return {
    noValueStatement,
    incomeLimit,
    electionId,
    clientName,
    clientPhone,
    clientEmail,
  }
}

export const getShouldGetFileName = (answers: FormValue) => {
  const incomeLimit = getValueViaPath<FinancialElectionIncomeLimit>(
    answers,
    'incomeLimit.limit',
  )
  return incomeLimit === FinancialElectionIncomeLimit.GREATER
}

export const getInput = (
  answers: FormValue,
  nationalId: string,
  fileName: string | undefined,
) => {
  const { incomeLimit, electionId, clientName, clientPhone, clientEmail } =
    getIndividualElectionValues(answers)

  const noValueStatement = incomeLimit === FinancialElectionIncomeLimit.LESS
  const client: Client = {
    nationalId,
    name: clientName,
    phone: clientPhone,
    email: clientEmail,
  }
  const digitalSignee: DigitalSignee = {
    email: clientEmail ?? '',
    phone: clientPhone ?? '',
  }
  const values: PersonalElectionFinancialStatementValues | undefined =
    noValueStatement ? undefined : mapValuesToIndividualtype(answers)
  const input: PersonalElectionSubmitInput = {
    client,
    actor: undefined,
    digitalSignee,
    electionId: electionId ?? '',
    noValueStatement,
    values,
    file: fileName,
  }

  const loggerInfo = `PostFinancialStatementForPersonalElection => clientNationalId: '${nationalId}', electionId: '${electionId}', noValueStatement: '${noValueStatement}', clientName: '${clientName}', values: '${JSON.stringify(
    values,
  )}', file length: '${fileName?.length}'`

  return { input, loggerInfo }
}
