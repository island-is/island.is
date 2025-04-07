import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  Client,
  ContactType,
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
  const incomeLimit = getValueViaPath(answers, 'incomeLimit.limit') as string
  const electionId = getValueViaPath(answers, 'election.electionId') as string
  const clientName = getValueViaPath(answers, 'about.fullName') as string
  const clientPhone = getValueViaPath(answers, 'about.phoneNumber') as string
  const clientEmail = getValueViaPath(answers, 'about.email') as string
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
  const incomeLimit = getValueViaPath(
    answers,
    'incomeLimit.limit',
  ) as FinancialElectionIncomeLimit
  return incomeLimit === FinancialElectionIncomeLimit.GREATER
}

export const getActorContact = (
  actor:
    | {
        nationalId: string
        scope: string[]
      }
    | undefined,
  clientName: string,
) => {
  return actor
    ? {
        nationalId: actor.nationalId,
        name: clientName,
        contactType: ContactType.Actor,
      }
    : undefined
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
    email: clientEmail,
    phone: clientPhone,
  }
  const values: PersonalElectionFinancialStatementValues | undefined =
    noValueStatement ? undefined : mapValuesToIndividualtype(answers)
  const input: PersonalElectionSubmitInput = {
    client,
    actor: undefined,
    digitalSignee,
    electionId,
    noValueStatement,
    values,
    file: fileName,
  }

  const loggerInfo = `PostFinancialStatementForPersonalElection => clientNationalId: '${nationalId}', electionId: '${electionId}', noValueStatement: '${noValueStatement}', clientName: '${clientName}', values: '${JSON.stringify(
    values,
  )}', file length: '${fileName?.length}'`

  return { input, loggerInfo }
}
