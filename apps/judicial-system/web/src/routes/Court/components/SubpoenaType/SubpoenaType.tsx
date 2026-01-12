import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseState,
  Defendant,
  SubpoenaType as SubpoenaTypeEnum,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './SubpoenaType.strings'
import * as styles from '../../Indictments/Subpoena/Subpoena.css'

interface SubpoenaTypeProps {
  subpoenaItems: {
    defendant: Defendant
    onUpdate: (update: UpdateDefendantInput) => void
    alternativeServiceDescriptionDisabled?: boolean
    subpoenaDisabled?: boolean
    children?: ReactNode
    toggleNewAlternativeService?: () => void
  }[]
  workingCase: Case
  required?: boolean
}

const SubpoenaType: FC<SubpoenaTypeProps> = ({
  subpoenaItems,
  workingCase,
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
              <Box marginBottom={2}>
                <Checkbox
                  id={`alternativeService-${item.defendant.id}`}
                  label={strings.alternativeService}
                  checked={Boolean(item.defendant.isAlternativeService)}
                  onChange={() => {
                    const { id: defendantId } = item.defendant
                    const { id: caseId } = workingCase
                    const isAlternativeService =
                      !item.defendant.isAlternativeService

                    item.toggleNewAlternativeService &&
                      item.toggleNewAlternativeService()

                    item.onUpdate({ caseId, defendantId, isAlternativeService })
                  }}
                  tooltip={strings.alternativeServiceTooltip}
                  disabled={workingCase.state === CaseState.CORRECTING}
                  backgroundColor="white"
                  large
                  filled
                />
              </Box>
              {item.defendant.isAlternativeService && (
                <Box marginBottom={2}>
                  <Input
                    name="alternativeServiceDescription"
                    label={strings.alternativeServiceDescriptionLabel}
                    autoComplete="off"
                    value={item.defendant.alternativeServiceDescription ?? ''}
                    placeholder={
                      strings.alternativeServiceDescriptionPlaceholder
                    }
                    onChange={(evt) => {
                      const { id: defendantId } = item.defendant
                      const { id: caseId } = workingCase
                      const alternativeServiceDescription = evt.target.value

                      item.onUpdate({
                        caseId,
                        defendantId,
                        alternativeServiceDescription,
                      })
                    }}
                    disabled={
                      item.alternativeServiceDescriptionDisabled ||
                      workingCase.state === CaseState.CORRECTING
                    }
                    required
                  />
                </Box>
              )}
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
                    const { id: defendantId } = item.defendant
                    const { id: caseId } = workingCase
                    const subpoenaType = SubpoenaTypeEnum.ABSENCE

                    item.onUpdate({ caseId, defendantId, subpoenaType })
                  }}
                  disabled={
                    item.subpoenaDisabled ||
                    workingCase.state === CaseState.CORRECTING
                  }
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
                    const { id: defendantId } = item.defendant
                    const { id: caseId } = workingCase
                    const subpoenaType = SubpoenaTypeEnum.ARREST

                    item.onUpdate({ caseId, defendantId, subpoenaType })
                  }}
                  disabled={
                    item.subpoenaDisabled ||
                    workingCase.state === CaseState.CORRECTING
                  }
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
