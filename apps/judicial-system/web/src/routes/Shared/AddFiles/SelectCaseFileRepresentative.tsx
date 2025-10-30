import { FC, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { MultiValue, SingleValue } from 'react-select'

import { Box } from '@island.is/island-ui/core'
import { getRoleTitleFromCaseFileCategory } from '@island.is/judicial-system/formatters'
import {
  BaseSelect,
  BlueBox,
  DateTime,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseRepresentative,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { strings } from './AddFiles.strings'
import * as styles from './SelectCaseFileRepresentative.css'

type RepresentativeSelectOption = ReactSelectOption & {
  selectedCaseRepresentative: CaseRepresentative | null
}

interface SelectRepresentativeProps {
  submitterName?: string
  caseFileCategory?: CaseFileCategory
  updateRepresentative: (
    submitterName: string,
    caseFileCategory: CaseFileCategory,
  ) => void
  required?: boolean
  minimal?: boolean
}

export const SelectRepresentative: FC<SelectRepresentativeProps> = (props) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const {
    submitterName,
    caseFileCategory,
    updateRepresentative,
    required = true,
    minimal = false,
  } = props

  const options = useMemo(() => {
    const reps =
      workingCase.caseRepresentatives?.map((representative) => ({
        label: `${representative.name} (${getRoleTitleFromCaseFileCategory(
          representative.caseFileCategory,
        )})`,
        value: representative.name,
        selectedCaseRepresentative: representative,
      })) ?? []

    return [
      { label: 'Hreinsa val', value: null, selectedCaseRepresentative: null },
      ...reps,
    ]
  }, [workingCase.caseRepresentatives])

  const [representative, setRepresentative] = useState<
    RepresentativeSelectOption | undefined | null
  >(
    options.find((option) => {
      return (
        option.value === submitterName &&
        option.selectedCaseRepresentative?.caseFileCategory === caseFileCategory
      )
    }),
  )

  const handleChange = (
    selectedOption:
      | MultiValue<ReactSelectOption>
      | SingleValue<ReactSelectOption>,
  ) => {
    const representativeSelectOption =
      selectedOption as RepresentativeSelectOption

    if (
      !representativeSelectOption ||
      !representativeSelectOption.selectedCaseRepresentative
    ) {
      setRepresentative(null)
      return
    }

    setRepresentative(representativeSelectOption)
    updateRepresentative(
      representativeSelectOption.selectedCaseRepresentative.name,
      representativeSelectOption.selectedCaseRepresentative.caseFileCategory,
    )
  }

  return (
    <BaseSelect
      options={options}
      isLoading={false} // TODO
      placeholder={
        minimal
          ? 'Hver lagði fram?'
          : formatMessage(strings.caseRepresentativePlaceholder)
      }
      value={representative}
      onChange={handleChange}
    />
    // <Box className={minimal ? styles.selectNoBorderOuter : undefined}>
    //   <Box className={minimal ? styles.selectNoBorderInner : undefined}>
    //     <Select
    //       name="caseRepresentative"
    //       label={
    //         minimal ? undefined : formatMessage(strings.caseRepresentativeLabel)
    //       }
    //       placeholder={
    //         minimal
    //           ? 'Hver lagði fram?'
    //           : formatMessage(strings.caseRepresentativePlaceholder)
    //       }
    //       value={representative}
    //       options={options}
    //       onChange={(selectedOption) => {
    //         const representativeSelectOption =
    //           selectedOption as RepresentativeSelectOption
    //         setRepresentative(representativeSelectOption)
    //         updateRepresentative(
    //           representativeSelectOption.selectedCaseRepresentative.name,
    //           representativeSelectOption.selectedCaseRepresentative
    //             .caseFileCategory,
    //         )
    //       }}
    //       required={required}
    //       size={minimal ? 'xs' : undefined}
    //     />
    //   </Box>
    // </Box>
  )
}

interface SelectCaseFileRepresentativeProps {
  submitterName?: string
  caseFileCategory?: CaseFileCategory
  submissionDate: Date
  handleCaseFileRepresentativeUpdate: (update: {
    submitterName?: string
    caseFileCategory?: CaseFileCategory
    submissionDate?: Date
  }) => void
}

export const SelectCaseFileRepresentative: FC<
  SelectCaseFileRepresentativeProps
> = (props) => {
  const { formatMessage } = useIntl()

  const {
    submitterName,
    caseFileCategory,
    submissionDate,
    handleCaseFileRepresentativeUpdate,
  } = props

  const [currentSubmissionDate, setCurrentSubmissionDate] =
    useState(submissionDate)

  return (
    <div className={styles.selectCaseFileRepresentative}>
      <SectionHeading
        title={formatMessage(strings.uploadFilesRepresentativeSelectionTitle)}
      />
      <BlueBox>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <SelectRepresentative
            submitterName={submitterName}
            caseFileCategory={caseFileCategory}
            updateRepresentative={(submitterName, caseFileCategory) => {
              handleCaseFileRepresentativeUpdate({
                submitterName,
                caseFileCategory,
              })
            }}
          />
          <DateTime
            name="fileSubmissionDate"
            selectedDate={currentSubmissionDate}
            onChange={(selectedDate) => {
              if (!selectedDate) {
                return
              }

              setCurrentSubmissionDate(selectedDate)

              handleCaseFileRepresentativeUpdate({
                submissionDate: selectedDate,
              })
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
