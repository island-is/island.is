import { Box, Input } from '@island.is/island-ui/core'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { CourtSessionString } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDebouncedField } from '@island.is/judicial-system-web/src/utils/hooks'

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
  // One instance per merged case, so the caller keys the row by merged case id
  // - otherwise a removed or reordered row would inherit this edit.
  const entriesField = useDebouncedField({
    value: courtSessionString?.value,
    validations: ['empty'],
    onChange: (value) =>
      patchCourtSessionStrings(courtSessionId, mergedCaseId, { value }),
    onSave: (value) =>
      patchCourtSessionStrings(
        courtSessionId,
        mergedCaseId,
        { value },
        { persist: true },
      ),
  })

  return (
    <Box paddingBottom={3}>
      <SectionHeading title={`Sameining ${courtCaseNumber}`} />
      <Input
        name="merged-case-entries"
        label={`Bókanir um sameiningu máls ${courtCaseNumber}`}
        value={entriesField.value}
        placeholder="Hér er hægt að bóka um sameiningu máls"
        onChange={(event) => entriesField.onChange(event.target.value)}
        onBlur={(event) => entriesField.onBlur(event.target.value)}
        hasError={entriesField.hasError}
        errorMessage={entriesField.errorMessage}
        rows={15}
        disabled={disabled}
        textarea
        required
      />
    </Box>
  )
}
