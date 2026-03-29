import formatISO from 'date-fns/formatISO'
import isNil from 'lodash/isNil'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import {
  AppealCase,
  Case,
  UpdateCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

type ChildKeys = Pick<
  UpdateCaseInput,
  | 'courtId'
  | 'prosecutorId'
  | 'sharedWithProsecutorsOfficeId'
  | 'registrarId'
  | 'judgeId'
  | 'indictmentReviewerId'
  | 'mergeCaseId'
>

type AppealChildKeys = Pick<
  UpdateCaseInput,
  | 'appealAssistantId'
  | 'appealJudge1Id'
  | 'appealJudge2Id'
  | 'appealJudge3Id'
>

type AppealCaseKeys = Pick<
  UpdateCaseInput,
  | 'appealCaseNumber'
  | 'appealConclusion'
  | 'appealIsolationToDate'
  | 'appealRulingDecision'
  | 'appealRulingModifiedHistory'
  | 'appealValidToDate'
  | 'defendantStatementDate'
  | 'isAppealCustodyIsolation'
  | 'prosecutorStatementDate'
  | 'requestAppealRulingNotToBePublished'
>

export type UpdateCase = Omit<UpdateCaseInput, 'id'> & {
  force?: boolean
}

const isChildKey = (key: keyof UpdateCaseInput): key is keyof ChildKeys => {
  return [
    'courtId',
    'prosecutorId',
    'sharedWithProsecutorsOfficeId',
    'registrarId',
    'judgeId',
    'indictmentReviewerId',
    'mergeCaseId',
  ].includes(key)
}

const isAppealChildKey = (
  key: keyof UpdateCaseInput,
): key is keyof AppealChildKeys => {
  return [
    'appealAssistantId',
    'appealJudge1Id',
    'appealJudge2Id',
    'appealJudge3Id',
  ].includes(key)
}

const isAppealCaseKey = (
  key: keyof UpdateCaseInput,
): key is keyof AppealCaseKeys => {
  return [
    'appealCaseNumber',
    'appealConclusion',
    'appealIsolationToDate',
    'appealRulingDecision',
    'appealRulingModifiedHistory',
    'appealValidToDate',
    'defendantStatementDate',
    'isAppealCustodyIsolation',
    'prosecutorStatementDate',
    'requestAppealRulingNotToBePublished',
  ].includes(key)
}

const childof: { [Property in keyof ChildKeys]-?: keyof Case } = {
  courtId: 'court',
  prosecutorId: 'prosecutor',
  sharedWithProsecutorsOfficeId: 'sharedWithProsecutorsOffice',
  registrarId: 'registrar',
  judgeId: 'judge',
  indictmentReviewerId: 'indictmentReviewer',
  mergeCaseId: 'mergeCase',
}

const appealChildof: {
  [Property in keyof AppealChildKeys]-?: keyof AppealCase
} = {
  appealAssistantId: 'appealAssistant',
  appealJudge1Id: 'appealJudge1',
  appealJudge2Id: 'appealJudge2',
  appealJudge3Id: 'appealJudge3',
}

const overwrite = (update: UpdateCase): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, isUndefined)

  return validUpdates
}

const fieldHasValue = (workingCase: Case) => (value: unknown, key: string) => {
  const theKey = key as keyof UpdateCaseInput

  let currentValue: unknown

  if (isChildKey(theKey)) {
    currentValue = workingCase[childof[theKey]]
  } else if (isAppealChildKey(theKey)) {
    currentValue = workingCase.appealCase?.[appealChildof[theKey]]
  } else if (isAppealCaseKey(theKey)) {
    currentValue = workingCase.appealCase?.[theKey]
  } else {
    currentValue = workingCase[theKey]
  }

  if (isNil(currentValue)) {
    return value === undefined
  }

  return true
}

export const update = (update: UpdateCase, workingCase: Case): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, fieldHasValue(workingCase))

  return validUpdates
}

export const formatUpdates = (updates: UpdateCase[], workingCase: Case) => {
  const changes: UpdateCase[] = updates.map((entry) => {
    if (entry.force) {
      return overwrite(entry)
    }

    return update(entry, workingCase)
  })

  const newWorkingCase = changes.reduce<UpdateCase>(
    (currentUpdates, nextUpdates) => {
      return { ...currentUpdates, ...nextUpdates }
    },
    {} as UpdateCase,
  )

  return newWorkingCase
}

export const formatDateForServer = (date: Date) => {
  return formatISO(date, { representation: 'complete' })
}
