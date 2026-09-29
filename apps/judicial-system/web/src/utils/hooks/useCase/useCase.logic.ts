import formatISO from 'date-fns/formatISO'
import isNil from 'lodash/isNil'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import { isIndictmentCase } from '@island.is/judicial-system/types'
import type {
  Case,
  CreateCaseInput,
  Defendant,
  UpdateCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { normalizeBlankStrings } from '../../formatters'

type ChildKeys = Pick<
  UpdateCaseInput,
  | 'courtId'
  | 'prosecutorId'
  | 'sharedWithProsecutorsOfficeId'
  | 'registrarId'
  | 'judgeId'
  | 'indictmentReviewerId'
  | 'indictmentApproverId'
  | 'mergeCaseId'
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
    'indictmentApproverId',
    'mergeCaseId',
  ].includes(key)
}

const childof: { [Property in keyof ChildKeys]-?: keyof Case } = {
  courtId: 'court',
  prosecutorId: 'prosecutor',
  sharedWithProsecutorsOfficeId: 'sharedWithProsecutorsOffice',
  registrarId: 'registrar',
  judgeId: 'judge',
  indictmentReviewerId: 'indictmentReviewer',
  indictmentApproverId: 'indictmentApprover',
  mergeCaseId: 'mergeCase',
}

const overwrite = (update: UpdateCase): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, isUndefined)

  return validUpdates
}

const fieldHasValue = (workingCase: Case) => (value: unknown, key: string) => {
  const theKey = key as keyof UpdateCaseInput

  let currentValue: unknown

  if (theKey === 'defendantEventLogDecisions') {
    return false
  } else if (isChildKey(theKey)) {
    currentValue = workingCase[childof[theKey]]
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

// The fields a prosecutor can enter for a defendant before the case exists.
// A blank national id is sent as null, since the server validates the length
// of any string it receives.
const toCreateCaseDefendantInput = (defendant: Defendant) =>
  normalizeBlankStrings({
    noNationalId: defendant.noNationalId,
    nationalId: defendant.nationalId || null,
    name: defendant.name,
    gender: defendant.gender,
    address: defendant.address,
    citizenship: defendant.citizenship,
  })

// Indictments collect their defendants before the case exists, so they are
// sent with the case and created in the same transaction: the case is created
// whole or not at all. Request cases are created before their defendant is
// entered, so nothing is sent for them and the server starts them from an
// empty defendant. Undefined when the case is missing what it takes to be created.
export const createCaseInput = (theCase: Case): CreateCaseInput | undefined => {
  if (!theCase.type || !theCase.policeCaseNumbers) {
    return undefined
  }

  const defendants =
    isIndictmentCase(theCase.type) && theCase.defendants?.length
      ? theCase.defendants.map(toCreateCaseDefendantInput)
      : undefined

  return {
    type: theCase.type,
    indictmentSubtypes: theCase.indictmentSubtypes,
    description: theCase.description,
    policeCaseNumbers: theCase.policeCaseNumbers,
    defenderName: theCase.defenderName,
    defenderNationalId: theCase.defenderNationalId,
    defenderEmail: theCase.defenderEmail,
    defenderPhoneNumber: theCase.defenderPhoneNumber,
    requestSharedWithDefender: theCase.requestSharedWithDefender,
    leadInvestigator: theCase.leadInvestigator,
    crimeScenes: theCase.crimeScenes,
    prosecutorId: theCase.prosecutor?.id,
    ...(defendants ? { defendants } : {}),
  }
}
