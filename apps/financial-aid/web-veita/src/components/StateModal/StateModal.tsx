import React, { useContext, useState, useMemo } from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.treat'
import cn from 'classnames'

import { useMutation } from '@apollo/client'

import {
  InputModal,
  OptionsModal,
} from '@island.is/financial-aid-web/veita/src/components'

import { UpdateApplicationMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { NavigationStatisticsContext } from '@island.is/financial-aid-web/veita/src/components/NavigationStatisticsProvider/NavigationStatisticsProvider'

import { Application, ApplicationState } from '@island.is/financial-aid/shared'

interface Props {
  isVisible: boolean
  onVisiblityChange: React.Dispatch<React.SetStateAction<boolean>>
  onStateChange: (applicationState: ApplicationState) => void
  application: Application
}

interface SaveData {
  application: Application
}

interface InputType {
  show: boolean
  type: ApplicationState | undefined
}

const StateModal: React.FC<Props> = ({
  isVisible,
  onVisiblityChange,
  onStateChange,
  application,
}) => {
  const [inputType, setInputType] = useState<InputType>({
    show: false,
    type: undefined,
  })

  const { statistics, setStatistics } = useContext(NavigationStatisticsContext)

  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const saveStateApplication = async (
    application: Application,
    state: ApplicationState,
    amount?: number,
    comment?: string,
  ) => {
    const prevState = application.state

    if (saveLoading === false && application) {
      await updateApplicationMutation({
        variables: {
          input: {
            id: application.id,
            state: state,
            amount: amount,
            comment: comment,
          },
        },
      })
    }

    onVisiblityChange(!isVisible)
    onStateChange(state)

    if (statistics && setStatistics) {
      setStatistics((preState) => ({
        ...preState,
        [prevState]: statistics[prevState] - 1,
        [state]: statistics[state] + 1,
      }))
    }
  }

  const closeModal = (): void => {
    if (!inputType.show) {
      onVisiblityChange(false)
    }
  }

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisiblityChange(visibility)
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
              Stöðubreyting
            </Text>
          </Box>

          <Box
            display="flex"
            className={cn({
              [`${styles.container}`]: true,
              [`${styles.showInput}`]: inputType.show,
            })}
          >
            <OptionsModal
              state={application.state}
              onClick={(e, stateOption) => {
                e.stopPropagation()
                if (
                  stateOption === ApplicationState.APPROVED ||
                  stateOption === ApplicationState.REJECTED
                ) {
                  setInputType({
                    show: !inputType.show,
                    type: stateOption,
                  })
                } else {
                  saveStateApplication(application, stateOption)
                }
              }}
            />

            <InputModal
              onShowInputChange={(e) => {
                e.stopPropagation()
                setInputType({
                  ...inputType,
                  show: false,
                })
              }}
              type={inputType.type}
              onSaveState={(e, amount, comment) => {
                e.stopPropagation()
                if (inputType.type) {
                  saveStateApplication(
                    application,
                    inputType.type,
                    amount,
                    comment,
                  )
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default StateModal
