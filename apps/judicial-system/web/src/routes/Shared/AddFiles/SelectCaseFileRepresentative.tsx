import { Dispatch, SetStateAction, useContext } from 'react'
import { useIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'

import { Box, Select } from '@island.is/island-ui/core'
import { getRoleTitleFromCaseFileCategory } from '@island.is/judicial-system/formatters'
import {
  BlueBox,
  DateTime,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseRepresentative } from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { strings } from './AddFiles.strings'
import * as styles from './SelectCaseFileRepresentative.css'

export type RepresentativeSelectOption = ReactSelectOption & {
  selectedCaseRepresentative: CaseRepresentative
}

export const SelectCaseFileRepresentative = ({
  fileRepresentative,
  setFileRepresentative,
  submittedDate,
  setSubmittedDate,
  handleCaseFileRepresentativeUpdate,
}: {
  fileRepresentative: RepresentativeSelectOption
  setFileRepresentative: Dispatch<SetStateAction<RepresentativeSelectOption>>
  submittedDate: Date
  setSubmittedDate: Dispatch<SetStateAction<Date>>
  handleCaseFileRepresentativeUpdate: (
    fileRepresentative?: RepresentativeSelectOption,
    submittedDate?: Date,
  ) => void
}) => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { caseRepresentatives } = workingCase

  const options = caseRepresentatives?.map((representative) => {
    return {
      label: `${representative.name} (${getRoleTitleFromCaseFileCategory(
        representative.caseFileCategory,
      )})`,
      value: representative.name,
      selectedCaseRepresentative: representative,
    }
  })

  return (
    <div className={styles.selectCaseFileRepresentative}>
      <SectionHeading
        title={formatMessage(strings.uploadFilesRepresentativeSelectionTitle)}
      />
      <BlueBox>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Select
            name="caseRepresentative"
            label={formatMessage(strings.caseRepresentativeLabel)}
            placeholder={formatMessage(strings.caseRepresentativePlaceholder)}
            value={
              !isEmpty(fileRepresentative) ? fileRepresentative : undefined
            }
            options={options}
            onChange={(selectedOption) => {
              const representativeSelectOption =
                selectedOption as RepresentativeSelectOption
              setFileRepresentative(representativeSelectOption)
              handleCaseFileRepresentativeUpdate(
                representativeSelectOption,
                submittedDate,
              )
            }}
            required
          />
          <DateTime
            name="fileSubmittedDate"
            selectedDate={submittedDate}
            onChange={(selectedDate) => {
              if (!selectedDate) return

              setSubmittedDate(selectedDate)
              handleCaseFileRepresentativeUpdate(
                fileRepresentative,
                selectedDate,
              )
            }}
            blueBox={false}
            datepickerLabel="Dagsetning móttöku"
            dateOnly
            required
          />
        </Box>
      </BlueBox>
    </div>
  )
}
