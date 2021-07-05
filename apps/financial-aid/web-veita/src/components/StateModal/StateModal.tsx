import React, { useContext, useState } from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './StateModal.treat'
import cn from 'classnames'

import { useMutation } from '@apollo/client'

import { NumberInput } from '@island.is/financial-aid-web/veita/src/components'

import { UpdateApplicationMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { NavigationStatisticsContext } from '@island.is/financial-aid-web/veita/src/components/NavigationStatisticsProvider/NavigationStatisticsProvider'

import {
  getState,
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared'

interface Props {
  isVisible: boolean
  onVisiblityChange: React.Dispatch<React.SetStateAction<boolean>>
  onStateChange: (applicationState: ApplicationState) => void
  application: Application
}

interface SaveData {
  application: Application
}

const StateModal: React.FC<Props> = (props: Props) => {
  const { isVisible, onVisiblityChange, onStateChange, application } = props

  const statusOptions = [
    ApplicationState.NEW,
    ApplicationState.INPROGRESS,
    ApplicationState.DATANEEDED,
    ApplicationState.APPROVED,
    ApplicationState.REJECTED,
  ]

  const [showInput, setShowInput] = useState(false)

  const maximumInputLength = 6
  const [amount, setAmount] = useState<number>(0)

  const { statistics, setStatistics } = useContext(NavigationStatisticsContext)

  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const saveStateApplication = async (
    application: Application,
    state: ApplicationState,
    amount?: number,
  ) => {
    const prevState = application.state

    if (saveLoading === false && application) {
      await updateApplicationMutation({
        variables: {
          input: {
            id: application.id,
            state: state,
            amount: amount,
            comment: 'Testítest',
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
    if (!showInput) {
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
              [`${styles.showInput}`]: showInput,
            })}
          >
            <Box display="block" width="full" padding={4}>
              {statusOptions.map((item, index) => {
                return (
                  <button
                    key={'statusoptions-' + index}
                    className={cn({
                      [`${styles.statusOptions}`]: true,
                      [`${styles.activeState}`]: item === application.state,
                    })}
                    onClick={(e) => {
                      e.stopPropagation()

                      if (item === ApplicationState.APPROVED) {
                        setShowInput(true)
                      } else {
                        saveStateApplication(application, item)
                      }
                    }}
                  >
                    {getState[item]}
                  </button>
                )
              })}
            </Box>

            <Box display="block" width="full" padding={4}>
              <NumberInput
                placeholder="Skrifaðu upphæð útborgunar"
                onUpdate={setAmount}
                maximumInputLength={maximumInputLength}
              />

              <Box display="flex" justifyContent="spaceBetween" marginTop={5}>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInput(false)
                  }}
                >
                  Hætta við
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    saveStateApplication(
                      application,
                      ApplicationState.APPROVED,
                      amount,
                    )
                  }}
                >
                  Samþykkja
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default StateModal
