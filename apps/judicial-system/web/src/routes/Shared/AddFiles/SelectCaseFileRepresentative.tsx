import { Dispatch, SetStateAction, useContext } from 'react'
import { useIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'

import { Box, Select } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CaseRepresentativeType,
} from '@island.is/judicial-system/types'
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
  caseRepresentative: CaseRepresentative
  caseFileCategory: CaseFileCategory
}

const CASE_REPRESENTATIVE_PROPS_MAP: Map<
  CaseRepresentativeType,
  { title: string; caseFileCategory: CaseFileCategory }
> = new Map([
  [
    CaseRepresentativeType.PROSECUTOR,
    {
      title: 'Sækjandi',
      caseFileCategory: CaseFileCategory.PROSECUTOR_CASE_FILE,
    },
  ],
  [
    CaseRepresentativeType.DEFENDER,
    {
      title: 'Verjandi',
      caseFileCategory: CaseFileCategory.DEFENDANT_CASE_FILE,
    },
  ],
  [
    CaseRepresentativeType.DEFENDANT,
    {
      title: 'Ákærði',
      caseFileCategory: CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
    },
  ],
  [
    CaseRepresentativeType.CIVIL_CLAIMANT_SPOKESPERSON,
    {
      title: 'Réttargæslumaður',
      caseFileCategory: CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
    },
  ],
  [
    CaseRepresentativeType.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON,
    {
      title: 'Lögmaður',
      caseFileCategory:
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
    },
  ],
])

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
    const props = CASE_REPRESENTATIVE_PROPS_MAP.get(representative.type)
    return {
      label: `${representative.name} (${props?.title})`,
      value: representative.name,
      caseRepresentative: representative,
      caseFileCategory: props?.caseFileCategory,
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
