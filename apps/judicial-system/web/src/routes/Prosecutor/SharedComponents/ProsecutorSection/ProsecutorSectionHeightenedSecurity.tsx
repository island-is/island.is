import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox } from '@island.is/island-ui/core'
import { User } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import ProsecutorSelection from './ProsecutorSelection'
import { strings } from './ProsecutorSectionHeightenedSecurity.strings'

interface Props {
  onChange: (prosecutor: User) => boolean
}

const ProsecutorSectionHeightenedSecurity: React.FC<Props> = (props) => {
  const { onChange } = props

  const { formatMessage } = useIntl()

  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { setAndSendToServer } = useCase()

  return (
    <Box component="section" marginBottom={5}>
      <ProsecutorSectionHeading />
      <BlueBox>
        <Box marginBottom={2}>
          <ProsecutorSelection onChange={onChange} />
        </Box>
        <Checkbox
          name="isHeightenedSecurityLevel"
          label={formatMessage(strings.heightenSecurityLevelLabel)}
          tooltip={formatMessage(strings.heightenSecurityLevelInfo)}
          disabled={
            user?.id !== workingCase.creatingProsecutor?.id &&
            user?.id !== workingCase.prosecutor?.id
          }
          checked={workingCase.isHeightenedSecurityLevel}
          onChange={(event) =>
            setAndSendToServer(
              [
                {
                  isHeightenedSecurityLevel: event.target.checked,
                  force: true,
                },
              ],
              workingCase,
              setWorkingCase,
            )
          }
          large
          filled
        />
      </BlueBox>
    </Box>
  )
}

export default ProsecutorSectionHeightenedSecurity
