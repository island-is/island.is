import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Checkbox } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  BlueBox,
  FormContext,
  Modal,
  ProsecutorSelection,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import { strings } from './ProsecutorSectionHeightenedSecurity.strings'

const ProsecutorSectionHeightenedSecurity: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const [substituteProsecutorId, setSubstituteProsecutor] = useState<string>()
  const [isProsecutorAccessModalVisible, setIsProsecutorAccessModalVisible] =
    useState<boolean>(false)
  const { setAndSendCaseToServer } = useCase()

  const setProsecutor = async (prosecutorId: string) => {
    if (workingCase) {
      return setAndSendCaseToServer(
        [
          {
            prosecutorId: prosecutorId,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const handleProsecutorChange = (prosecutorId: string) => {
    if (!workingCase) {
      return false
    }

    const isRemovingCaseAccessFromSelf =
      user?.id !== workingCase.creatingProsecutor?.id

    if (workingCase.isHeightenedSecurityLevel && isRemovingCaseAccessFromSelf) {
      setSubstituteProsecutor(prosecutorId)
      setIsProsecutorAccessModalVisible(true)

      return false
    }

    setProsecutor(prosecutorId)

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
            setAndSendCaseToServer(
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
            if (substituteProsecutorId) {
              await setProsecutor(substituteProsecutorId)
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
