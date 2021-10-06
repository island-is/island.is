import React, { useState } from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.treat'

import {
  OptionsModal,
  RejectModal,
  AcceptModal,
  DataNeededModal,
  InputModal,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { useApplicationState } from '../../utils/useApplicationState'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  applicationId: string
  currentState: ApplicationState
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const StateModal = ({
  isVisible,
  onVisibilityChange,
  applicationId,
  currentState,
  setApplication,
  setIsLoading,
}: Props) => {
  const [selected, setSelected] = useState<ApplicationState | undefined>()

  const changeApplicationState = useApplicationState()

  const saveStateApplication = async (
    applicationId: string,
    state: ApplicationState,
    amount?: number,
    rejection?: string,
    comment?: string,
  ) => {
    setIsLoading(true)
    onVisibilityChange((isVisible) => !isVisible)

    await changeApplicationState(
      applicationId,
      state,
      amount,
      rejection,
      comment,
    )
      .then((updatedApplication) => {
        setIsLoading(false)
        setApplication(updatedApplication)
      })
      .catch(() => {
        //TODO ERROR STATE
        setIsLoading(false)
      })
  }

  const closeModal = (): void => {
    if (selected === undefined) {
      onVisibilityChange(false)
    }
  }

  const onClickCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setSelected(undefined)
  }

  const stateNeedInput = [
    {
      state: ApplicationState.REJECTED,
      modalHeader: 'Synja umsókn',
    },
    {
      state: ApplicationState.APPROVED,
      modalHeader: 'Samþykkja umsókn',
    },
    {
      state: ApplicationState.DATANEEDED,
      modalHeader: 'Vantar gögn',
    },
  ]

  const headingText = (state?: ApplicationState): string => {
    const header = stateNeedInput.find((item) => state === item.state)
      ?.modalHeader

    return header ?? 'Stöðubreyting'
  }

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={styles.modalBase}
    >
      <Box onClick={closeModal} className={styles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          <Box
            paddingLeft={4}
            paddingY={2}
            background="blue400"
            className={styles.modalHeadline}
          >
            <Text fontWeight="semiBold" color="white">
              {headingText(selected)}
            </Text>
          </Box>
          <Box display="block" width="full" padding={4}>
            {selected === undefined && (
              <OptionsModal
                activeState={currentState}
                onClick={(e, stateOption) => {
                  e.stopPropagation()

                  const goToNextWindow = stateNeedInput.find(
                    (item) => stateOption === item.state,
                  )
                  if (goToNextWindow) {
                    setSelected(stateOption)
                    return
                  }

                  saveStateApplication(applicationId, stateOption)
                }}
              />
            )}

            {selected === ApplicationState.DATANEEDED && (
              <DataNeededModal
                onCancel={onClickCancel}
                onSaveApplication={(comment?: string) => {
                  if (!comment) {
                    setSelected(undefined)
                    return
                  }
                  saveStateApplication(
                    applicationId,
                    selected,
                    undefined,
                    undefined,
                    comment,
                  )
                }}
              />
            )}

            {selected === ApplicationState.APPROVED && (
              <AcceptModal onCancel={onClickCancel} />
            )}

            {selected === ApplicationState.REJECTED && (
              <RejectModal onCancel={onClickCancel} />
            )}
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default StateModal
