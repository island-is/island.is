import React, { Dispatch, FC, SetStateAction } from 'react'
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
  defendants: Defendant[]
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  updateDefendantState: (
    update: UpdateDefendantInput,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => void
  required?: boolean
}

const SubpoenaType: FC<SubpoenaTypeProps> = ({
  defendants,
  workingCase,
  setWorkingCase,
  updateDefendantState,
  required = true,
}) => {
  const { formatMessage } = useIntl()
  const isArraignmentDone = Boolean(workingCase.indictmentDecision)
  return (
    <>
      <SectionHeading
        title={formatMessage(strings.title)}
        required={required}
      />
      {defendants.map((defendant, index) => (
        <Box
          key={defendant.id}
          marginBottom={index === defendants.length ? 0 : 3}
        >
          <BlueBox>
            <Text as="h4" variant="h4" marginBottom={2}>
              {defendant.name}
            </Text>
            <Box className={styles.subpoenaTypeGrid}>
              <RadioButton
                large
                name="subpoenaType"
                id={`subpoenaTypeAbsence${defendant.id}`}
                backgroundColor="white"
                label={formatMessage(strings.absence)}
                checked={defendant.subpoenaType === SubpoenaTypeEnum.ABSENCE}
                onChange={() => {
                  updateDefendantState(
                    {
                      caseId: workingCase.id,
                      defendantId: defendant.id,
                      subpoenaType: SubpoenaTypeEnum.ABSENCE,
                    },
                    setWorkingCase,
                  )
                }}
                disabled={isArraignmentDone}
              />
              <RadioButton
                large
                name="subpoenaType"
                id={`subpoenaTypeArrest${defendant.id}`}
                backgroundColor="white"
                label={formatMessage(strings.arrest)}
                checked={defendant.subpoenaType === SubpoenaTypeEnum.ARREST}
                onChange={() => {
                  updateDefendantState(
                    {
                      caseId: workingCase.id,
                      defendantId: defendant.id,
                      subpoenaType: SubpoenaTypeEnum.ARREST,
                    },
                    setWorkingCase,
                  )
                }}
                disabled={isArraignmentDone}
              />
            </Box>
          </BlueBox>
        </Box>
      ))}
    </>
  )
}

export default SubpoenaType
