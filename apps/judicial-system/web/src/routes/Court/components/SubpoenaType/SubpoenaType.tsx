import { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import { SubpoenaType as SubpoenaTypeEnum } from '@island.is/judicial-system/types'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './SubpoenaType.strings'
import * as styles from '../../Indictments/Subpoena/Subpoena.css'

interface SubpoenaTypeProps {
  subpoenaItems: {
    defendant: Defendant
    disabled?: boolean
    children?: ReactNode
  }[]
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  updateDefendantState: (
    update: UpdateDefendantInput,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => void
  required?: boolean
}

const SubpoenaType: FC<SubpoenaTypeProps> = ({
  subpoenaItems,
  workingCase,
  setWorkingCase,
  updateDefendantState,
  required = true,
}) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <SectionHeading
        title={formatMessage(strings.title)}
        required={required}
      />
      {subpoenaItems.map((item, index) => (
        <Box
          key={item.defendant.id}
          marginBottom={
            index === subpoenaItems.length - 1 ? 0 : item.children ? 5 : 3
          }
        >
          <Box marginBottom={item.children ? 2 : 0}>
            <BlueBox>
              <Text as="h4" variant="h4" marginBottom={2}>
                {item.defendant.name}
              </Text>
              <Box className={styles.subpoenaTypeGrid}>
                <RadioButton
                  large
                  name="subpoenaType"
                  id={`subpoenaTypeAbsence${item.defendant.id}`}
                  backgroundColor="white"
                  label={formatMessage(strings.absence)}
                  checked={
                    item.defendant.subpoenaType === SubpoenaTypeEnum.ABSENCE
                  }
                  onChange={() => {
                    updateDefendantState(
                      {
                        caseId: workingCase.id,
                        defendantId: item.defendant.id,
                        subpoenaType: SubpoenaTypeEnum.ABSENCE,
                      },
                      setWorkingCase,
                    )
                  }}
                  disabled={item.disabled}
                />
                <RadioButton
                  large
                  name="subpoenaType"
                  id={`subpoenaTypeArrest${item.defendant.id}`}
                  backgroundColor="white"
                  label={formatMessage(strings.arrest)}
                  checked={
                    item.defendant.subpoenaType === SubpoenaTypeEnum.ARREST
                  }
                  onChange={() => {
                    updateDefendantState(
                      {
                        caseId: workingCase.id,
                        defendantId: item.defendant.id,
                        subpoenaType: SubpoenaTypeEnum.ARREST,
                      },
                      setWorkingCase,
                    )
                  }}
                  disabled={item.disabled}
                />
              </Box>
            </BlueBox>
          </Box>
          {item.children}
        </Box>
      ))}
    </>
  )
}

export default SubpoenaType
