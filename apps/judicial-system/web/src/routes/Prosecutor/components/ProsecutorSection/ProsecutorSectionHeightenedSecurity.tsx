import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Checkbox } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  BlueBox,
  FormContext,
  Modal,
  ProsecutorSelection,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import { strings } from './ProsecutorSectionHeightenedSecurity.strings'

const ProsecutorSectionHeightenedSecurity = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const [substituteProsecutorId, setSubstituteProsecutor] = useState<string>()
  const [isProsecutorAccessModalVisible, setIsProsecutorAccessModalVisible] =
    useState<boolean>(false)
  const { setAndSendCaseToServer, updateCase } = useCase()

  const setProsecutor = async (prosecutorId: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        prosecutorId: prosecutorId,
      })

      if (!updatedCase) {
        return
      }

      const prosecutor = updatedCase?.prosecutor

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        prosecutor,
      }))
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
    <Box component="section">
      <ProsecutorSectionHeading />
      <BlueBox className={grid({ gap: 2 })}>
        <ProsecutorSelection onChange={handleProsecutorChange} />
        <Checkbox
          name="isHeightenedSecurityLevel"
          label={formatMessage(strings.heightenSecurityLabel)}
          tooltip={formatMessage(strings.heightenSecurityInfo)}
          disabled={
            user?.id !== workingCase.creatingProsecutor?.id &&
            user?.id !== workingCase.prosecutor?.id
          }
          checked={Boolean(workingCase.isHeightenedSecurityLevel)}
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
          primaryButton={{
            text: formatMessage(strings.accessModalPrimaryButtonText),
            onClick: async () => {
              if (substituteProsecutorId) {
                await setProsecutor(substituteProsecutorId)
                router.push(getStandardUserDashboardRoute(user))
              }
            },
          }}
          secondaryButton={{
            text: formatMessage(strings.accessModalSecondaryButtonText),
            onClick: () => {
              setIsProsecutorAccessModalVisible(false)
            },
          }}
        />
      )}
    </Box>
  )
}

export default ProsecutorSectionHeightenedSecurity
