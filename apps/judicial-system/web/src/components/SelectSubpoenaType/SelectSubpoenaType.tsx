import React from 'react'
import { useIntl } from 'react-intl'

import { RadioButton } from '@island.is/island-ui/core'
import { SubpoenaType } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import BlueBox from '../BlueBox/BlueBox'
import { selectSubpoenaType as strings } from './SelectSubpoenaType.strings'
import * as styles from './SelectSubpoenaType.css'

interface Props {
  workingCase: Case
  onChange: (subpoenaType: SubpoenaType) => void
}

const SelectSubpoenaType: React.FC<Props> = (props) => {
  const { workingCase, onChange } = props
  const { formatMessage } = useIntl()

  return (
    <BlueBox>
      <div className={styles.container}>
        <RadioButton
          name="subpoenaType"
          id="subpoenaTypeAbsenceSummons"
          checked={workingCase.subpoenaType === SubpoenaType.ABSENCE_SUMMONS}
          label={formatMessage(strings.absenceSummons)}
          backgroundColor="white"
          onChange={() => onChange(SubpoenaType.ABSENCE_SUMMONS)}
          large
        />
        <RadioButton
          name="subpoenaType"
          id="subpoenaTypeArrestSummons"
          checked={workingCase.subpoenaType === SubpoenaType.ARREST_SUMMONS}
          label={formatMessage(strings.arrestSummons)}
          backgroundColor="white"
          onChange={() => onChange(SubpoenaType.ARREST_SUMMONS)}
          large
        />
      </div>
    </BlueBox>
  )
}

export default SelectSubpoenaType
