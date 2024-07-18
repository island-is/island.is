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
import { ApplicationWithAttachments as Application } from '@island.is/application/types'

const LESS = 'less'
const GREATER = 'greater'

export const getIndividualElectionValues = (answers: FormValue) => {
  console.log('HÉR!!! answers: ', answers)

  const incomeLimit = getValueViaPath(answers, 'election.incomeLimit') as string
  const electionId = getValueViaPath(
    answers,
    'election.selectElection',
  ) as string
  const clientName = getValueViaPath(answers, 'about.fullName') as string
  const clientPhone = getValueViaPath(answers, 'about.phoneNumber') as string
  const clientEmail = getValueViaPath(answers, 'about.email') as string
  const noValueStatement = incomeLimit === LESS

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
  const incomeLimit = getValueViaPath(answers, 'election.incomeLimit') as string
  return incomeLimit === GREATER
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
  actor:
    | {
        nationalId: string
        scope: string[]
      }
    | undefined,
  nationalId: string,
  fileName: string | undefined,
) => {
  const { incomeLimit, electionId, clientName, clientPhone, clientEmail } =
    getIndividualElectionValues(answers)

  const noValueStatement = incomeLimit === LESS
  const client: Client = {
    nationalId,
    name: clientName,
    phone: clientPhone,
    email: clientEmail,
  }
  const actorContact = getActorContact(actor, clientName)
  const digitalSignee: DigitalSignee = {
    email: clientEmail,
    phone: clientPhone,
  }
  const values: PersonalElectionFinancialStatementValues | undefined =
    noValueStatement ? undefined : mapValuesToIndividualtype(answers)
  const input: PersonalElectionSubmitInput = {
    client,
    actor: actorContact,
    digitalSignee,
    electionId,
    noValueStatement,
    values,
    file: fileName,
  }

  const loggerInfo = `PostFinancialStatementForPersonalElection => clientNationalId: '${nationalId}', actorNationalId: '${
    actor?.nationalId
  }', electionId: '${electionId}', noValueStatement: '${noValueStatement}', clientName: '${clientName}', values: '${JSON.stringify(
    values,
  )}', file length: '${fileName?.length}'`

  return { input, loggerInfo }
}
