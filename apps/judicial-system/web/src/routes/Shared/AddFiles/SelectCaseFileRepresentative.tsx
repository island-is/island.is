import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select } from '@island.is/island-ui/core'
import {
  BlueBox,
  DateTime,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

import { strings } from './AddFiles.strings'
import * as styles from './SelectCaseFileRepresentative.css'

export const SelectCaseFileRepresentative = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { caseRepresentatives } = workingCase
  const options = caseRepresentatives?.map(({ name }) => ({
    label: name,
    value: name,
  }))

  const defaultCaseRepresentative = null
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
            value={defaultCaseRepresentative}
            options={options}
            // onChange={(selectedOption) =>
            //   setJudge((selectedOption as JudgeSelectOption).judge.id)
            // }
            required
            // isDisabled={usersLoading}
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
