import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
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

type RepresentativeSelectOption = ReactSelectOption & {
  caseRepresentative: CaseRepresentative
}

export const SelectCaseFileRepresentative = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { caseRepresentatives } = workingCase
  const options = caseRepresentatives?.map((representative) => ({
    label: `${representative.name} (${capitalize(representative.title)})`,
    value: representative.name,
    caseRepresentative: representative,
  }))
  const [caseFileRepresentative, setCaseFileRepresentative] = useState(
    {} as RepresentativeSelectOption,
  )

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
            value={caseFileRepresentative}
            options={options}
            onChange={(selectedOption) =>
              setCaseFileRepresentative(
                selectedOption as RepresentativeSelectOption,
              )
            }
            required
          />
          <DateTime
            name="fileSubmittedDate"
            selectedDate={new Date()}
            onChange={() => {
              return new Date()
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
