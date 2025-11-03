import { useState } from 'react'

import { Input } from '@island.is/island-ui/core'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import {
  CourtSessionResponse,
  CourtSessionString,
  CourtSessionStringType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { validateAndSetErrorMessage } from '@island.is/judicial-system-web/src/utils/formHelper'

export const CourtSessionMergeCaseEntries = ({
  courtSessionId,
  courtCaseNumber,
  value,
  courtSessionStrings,
  mergedCaseId,
  disabled,
  patchSession,
}: {
  courtSessionId: string
  courtCaseNumber: string
  value: string
  courtSessionStrings: CourtSessionString[]
  mergedCaseId: string
  disabled: boolean
  patchSession: (
    courtSessionId: string,
    updates: Partial<CourtSessionResponse>,
    {
      persist,
    }?: {
      persist?: boolean | undefined
    },
  ) => void
}) => {
  const [mergedEntriesErrorMessage, setMergedEntriesErrorMessage] =
    useState<string>('')

  const getUpdatedCourtSessionStrings = (updatedValue: string) =>
    courtSessionStrings.map((string) =>
      string.mergedCaseId === mergedCaseId &&
      string.courtSessionId === courtSessionId &&
      string.stringType === CourtSessionStringType.ENTRIES
        ? { ...string, value: updatedValue }
        : string,
    )
  return (
    <>
      <SectionHeading title={`Sameining ${courtCaseNumber}`} />
      <Input
        name="merged-case-entries"
        label={`Bókanir um sameiningu máls ${courtCaseNumber}`}
        value={value}
        placeholder=""
        onChange={(event) => {
          setMergedEntriesErrorMessage('')

          const updatedValue = event.target.value
          const updatedCourtSessionStrings =
            getUpdatedCourtSessionStrings(updatedValue)

          patchSession(courtSessionId, {
            courtSessionStrings: updatedCourtSessionStrings,
          })
        }}
        onBlur={(event) => {
          const updatedValue = event.target.value
          validateAndSetErrorMessage(
            ['empty'],
            updatedValue,
            setMergedEntriesErrorMessage,
          )

          const updatedCourtSessionStrings =
            getUpdatedCourtSessionStrings(updatedValue)

          patchSession(
            courtSessionId,
            { courtSessionStrings: updatedCourtSessionStrings },
            { persist: true },
          )
        }}
        hasError={mergedEntriesErrorMessage !== ''}
        errorMessage={mergedEntriesErrorMessage}
        rows={15}
        autoExpand={{ on: true, maxHeight: 300 }}
        disabled={disabled}
        textarea
        required
      />
    </>
  )
}
