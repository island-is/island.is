import formatISO from 'date-fns/formatISO'
import isNil from 'lodash/isNil'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { UpdateCaseInput } from '@island.is/judicial-system-web/src/graphql/schema'

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

const childof: { [Property in keyof ChildKeys]-?: keyof WorkingCase } = {
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

const fieldHasValue =
  (workingCase: WorkingCase) => (value: unknown, key: string) => {
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

export const update = (
  update: UpdateCase,
  workingCase: WorkingCase,
): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, fieldHasValue(workingCase))

  return validUpdates
}

export const formatUpdates = (
  updates: UpdateCase[],
  workingCase: WorkingCase,
) => {
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
