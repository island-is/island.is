import { useContext, useState } from 'react'
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
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import { strings } from './ProsecutorSectionHeightenedSecurity.strings'

const ProsecutorSectionHeightenedSecurity = () => {
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
      <BlueBox className={stack({ gap: 2 })}>
        <ProsecutorSelection onChange={handleProsecutorChange} />
        <Checkbox
          name="isHeightenedSecurityLevel"
          label={strings.heightenSecurityLabel}
          tooltip={strings.heightenSecurityInfo}
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
          title={strings.accessModalTitle}
          text={strings.accessModalText}
          buttons={[
            {
              text: strings.accessModalSecondaryButtonText,
              onClick: () => {
                setIsProsecutorAccessModalVisible(false)
              },
              variant: 'ghost',
            },
            {
              text: strings.accessModalPrimaryButtonText,
              onClick: async () => {
                if (substituteProsecutorId) {
                  await setProsecutor(substituteProsecutorId)
                  router.push(getStandardUserDashboardRoute(user))
                }
              },
            },
          ]}
        />
      )}
    </Box>
  )
}

export default ProsecutorSectionHeightenedSecurity
