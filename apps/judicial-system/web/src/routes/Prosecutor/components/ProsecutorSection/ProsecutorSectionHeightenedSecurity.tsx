import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Checkbox } from '@island.is/island-ui/core'
import { User } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  BlueBox,
  FormContext,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import ProsecutorSelection from './ProsecutorSelection'
import { strings } from './ProsecutorSectionHeightenedSecurity.strings'

const ProsecutorSectionHeightenedSecurity: React.FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const [substituteProsecutor, setSubstituteProsecutor] = useState<User>()
  const [
    isProsecutorAccessModalVisible,
    setIsProsecutorAccessModalVisible,
  ] = useState<boolean>(false)
  const { setAndSendToServer } = useCase()

  const setProsecutor = async (prosecutor: User) => {
    if (workingCase) {
      return setAndSendToServer(
        [
          {
            prosecutorId: prosecutor.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const handleProsecutorChange = (prosecutor: User) => {
    if (!workingCase) {
      return false
    }

    const isRemovingCaseAccessFromSelf =
      user?.id !== workingCase.creatingProsecutor?.id

    if (workingCase.isHeightenedSecurityLevel && isRemovingCaseAccessFromSelf) {
      setSubstituteProsecutor(prosecutor)
      setIsProsecutorAccessModalVisible(true)

      return false
    }

    setProsecutor(prosecutor)

    return true
  }

  return (
    <Box component="section" marginBottom={5}>
      <ProsecutorSectionHeading />
      <BlueBox>
        <Box marginBottom={2}>
          <ProsecutorSelection onChange={handleProsecutorChange} />
        </Box>
        <Checkbox
          name="isHeightenedSecurityLevel"
          label={formatMessage(strings.heightenSecurityLabel)}
          tooltip={formatMessage(strings.heightenSecurityInfo)}
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
      {isProsecutorAccessModalVisible && (
        <Modal
          title={formatMessage(strings.accessModalTitle)}
          text={formatMessage(strings.accessModalText)}
          primaryButtonText={formatMessage(
            strings.accessModalPrimaryButtonText,
          )}
          secondaryButtonText={formatMessage(
            strings.accessModalSecondaryButtonText,
          )}
          onPrimaryButtonClick={async () => {
            if (substituteProsecutor) {
              await setProsecutor(substituteProsecutor)
              router.push(constants.CASES_ROUTE)
            }
          }}
          onSecondaryButtonClick={() => {
            setIsProsecutorAccessModalVisible(false)
          }}
        />
      )}
    </Box>
  )
}

export default ProsecutorSectionHeightenedSecurity
