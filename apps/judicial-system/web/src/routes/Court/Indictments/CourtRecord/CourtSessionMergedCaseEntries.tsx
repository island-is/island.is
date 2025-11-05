import { useState } from 'react'

import { Box, Input } from '@island.is/island-ui/core'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { CourtSessionString } from '@island.is/judicial-system-web/src/graphql/schema'
import { validateAndSetErrorMessage } from '@island.is/judicial-system-web/src/utils/formHelper'

export const CourtSessionMergedCaseEntries = ({
  courtSessionId,
  courtCaseNumber,
  courtSessionString,
  mergedCaseId,
  disabled,
  patchCourtSessionStrings,
}: {
  courtSessionId: string
  courtCaseNumber: string
  courtSessionString?: CourtSessionString
  mergedCaseId: string
  disabled: boolean
  patchCourtSessionStrings: (
    courtSessionId: string,
    mergedCaseId: string,
    updatedCourtSessionString: Pick<CourtSessionString, 'value'>,
    {
      persist,
    }?: {
      persist?: boolean | undefined
    },
  ) => void
}) => {
  const [mergedEntriesErrorMessage, setMergedEntriesErrorMessage] =
    useState<string>('')

  return (
    <Box paddingBottom={3}>
      <SectionHeading title={`Sameining ${courtCaseNumber}`} />
      <Input
        name="merged-case-entries"
        label={`Bókanir um sameiningu máls ${courtCaseNumber}`}
        value={courtSessionString?.value ?? ''}
        placeholder="Hér er hægt að bóka um sameiningu máls"
        onChange={(event) => {
          setMergedEntriesErrorMessage('')

          const updatedValue = event.target.value
          const updatedCaseSessionString = {
            value: updatedValue,
          }

          patchCourtSessionStrings(
            courtSessionId,
            mergedCaseId,
            updatedCaseSessionString,
          )
        }}
        onBlur={(event) => {
          const updatedValue = event.target.value
          validateAndSetErrorMessage(
            ['empty'],
            updatedValue,
            setMergedEntriesErrorMessage,
          )

          const updatedCaseSessionString = {
            value: updatedValue,
          }

          patchCourtSessionStrings(
            courtSessionId,
            mergedCaseId,
            updatedCaseSessionString,
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
    </Box>
  )
}
