import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  IndictmentCaseReviewDecision,
  isPublicProsecutor,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './ReviewDecision.strings'
import * as styles from './ReviewDecision.css'
interface Props {
  workingCase: Case
  selectedOption?: IndictmentCaseReviewDecision
  onSelect: (decision: IndictmentCaseReviewDecision) => void
}

export const AppealDecision: React.FC<Props> = (props) => {
  const { workingCase, onSelect, selectedOption } = props

  const { user } = useContext(UserContext)
  const { formatMessage: fm } = useIntl()

  if (!isPublicProsecutor(user)) {
    return null
  }

  const options = [
    {
      label: fm(strings.appealToCourtOfAppeals),
      value: IndictmentCaseReviewDecision.APPEAL,
    },
    {
      label: fm(strings.acceptDecision),
      value: IndictmentCaseReviewDecision.ACCEPT,
    },
  ]

  return (
    <Box marginBottom={5}>
      <SectionHeading
        title={fm(strings.title)}
        description={
          <Text variant="eyebrow">
            {fm(strings.subtitle, {
              indictmentAppealDeadline: formatDate(
                workingCase.indictmentAppealDeadline,
                'P',
              ),
            })}
          </Text>
        }
      />
      <BlueBox>
        <div className={styles.gridRow}>
          {options.map((item, index) => {
            return (
              <Box key={`radioButton--${index}`}>
                <RadioButton
                  name={`reviewOption-${index}`}
                  label={item.label}
                  value={item.value}
                  checked={selectedOption === item.value}
                  onChange={() => {
                    onSelect(item.value)
                  }}
                  backgroundColor="white"
                  large
                />
              </Box>
            )
          })}
        </div>
      </BlueBox>
    </Box>
  )
}
