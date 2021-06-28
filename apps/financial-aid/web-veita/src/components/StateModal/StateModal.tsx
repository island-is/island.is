import React, { useContext } from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.treat'
import cn from 'classnames'

import { useMutation } from '@apollo/client'

import { UpdateApplicationMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { NavigationStatisticsContext } from '@island.is/financial-aid-web/veita/src/components/NavigationStatisticsProvider/NavigationStatisticsProvider'

import {
  getState,
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  applicationState: ApplicationState
  setApplicationState: (applicationState: ApplicationState) => void
  application: Application
}

interface SaveData {
  application: Application
}

const StateModal: React.FC<Props> = (props: Props) => {
  const {
    isVisible,
    setIsVisible,
    setApplicationState,
    applicationState,
    application,
  } = props

  const statusOptions = [
    ApplicationState.NEW,
    ApplicationState.INPROGRESS,
    ApplicationState.APPROVED,
    ApplicationState.REJECTED,
  ]

  const { statistics, setStatistics } = useContext(NavigationStatisticsContext)

  const overZeroCheck = (num: number) => {
    if (num === 0) {
      return false
    }
    return true
  }

  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const saveStateApplication = async (
    applicant: Application,
    state: ApplicationState,
  ) => {
    const prevState = applicant.state

    if (saveLoading === false && applicant) {
      await updateApplicationMutation({
        variables: {
          input: {
            id: applicant.id,
            state: state,
          },
        },
      })
    }
    setIsVisible(false)
    setApplicationState(state)

    if (statistics && setStatistics) {
      setStatistics((preState) => ({
        ...preState,
        [prevState]: statistics[prevState] - 1,
        [state]: statistics[state] + 1,
      }))
    }
  }

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          setIsVisible(visibility)
        }
      }}
      className={styles.modalBase}
    >
      {({
        closeModal,
      }: {
        closeModal: () => React.Dispatch<React.SetStateAction<boolean>>
      }) => (
        <Box onClick={closeModal} className={styles.modalContainer}>
          <Box
            position="relative"
            background="white"
            borderRadius="large"
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
            <Box padding={4}>
              {statusOptions.map((item, index) => {
                return (
                  <button
                    key={'statusoptions-' + index}
                    className={cn({
                      [`${styles.statusOptions}`]: true,
                      [`${styles.activeState}`]: item === applicationState,
                    })}
                    onClick={(e) => {
                      e.stopPropagation()
                      saveStateApplication(application, item)
                    }}
                  >
                    {getState[item]}
                  </button>
                )
              })}
            </Box>
          </Box>
        </Box>
      )}
    </ModalBase>
  )
}

export default StateModal
