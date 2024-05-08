import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { isPublicProsecutor } from '@island.is/judicial-system/types'
import {
  BlueBox,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './AppealDecision.strings'
import * as styles from './AppealDecision.css'
interface Props {
  workingCase: Case
  setWorkingCase?: React.Dispatch<React.SetStateAction<Case>>
  onClose?: () => void
  onComplete?: () => void
}

export const AppealDecision: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, onClose, onComplete } = props

  const { user } = useContext(UserContext)
  const { formatMessage: fm } = useIntl()

  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  if (!isPublicProsecutor(user)) {
    return null
  }

  const options = [
    {
      label: fm(strings.appealToCourtOfAppeals),
      value: 0,
    },
    {
      label: fm(strings.acceptDecision),
      value: 1,
    },
  ]

  fm(strings.appealToCourtOfAppeals)

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
              <Box key={'radioButton-' + index}>
                <RadioButton
                  name={'options-' + index}
                  label={item.label}
                  value={item.value}
                  checked={false}
                  onChange={() => {
                    console.log(item.value)
                  }}
                  backgroundColor="white"
                  large
                />
              </Box>
            )
          })}
        </div>
      </BlueBox>

      {/* <BlueBox>
        
        <RadioButton
          id="appealDecision"
          name="appealDecision"
          label={fm(strings.appealToCourtOfAppeals)}
          value="Krafa um endurskoðun"
          checked={false}
          onChange={() => {
            console.log('Krafa um endurskoðun')
          }}
        />
        <RadioButton
          id="appealDecision"
          name="appealDecision"
          label={fm(strings.acceptDecision)}
          value="Krafa um endurskoðun"
          checked={false}
          onChange={() => {
            console.log('Krafa um endurskoðun')
          }}
        />
      </BlueBox> */}
    </Box>
  )
}
