import React, { useState } from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'
import format from 'date-fns/format'

import * as styles from './AppliedMonthModal.css'
import * as modalButtonStyles from '../ModalTypes/ModalTypes.css'
import cn from 'classnames'

import * as modalStyles from '../StateModal/StateModal.css'

import {
  Application,
  ApplicationEventType,
  getMonth,
} from '@island.is/financial-aid/shared/lib'
import { useApplicationState } from '@island.is/financial-aid-web/veita/src/utils/useApplicationState'

interface Props {
  headline: string
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  appliedDate: string
  createdDate: string
  applicationId: string
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
}

const AppliedMonthModal = ({
  headline,
  isVisible,
  onVisibilityChange,
  appliedDate,
  createdDate,
  applicationId,
  setApplication,
}: Props) => {
  const closeModal = (): void => {
    onVisibilityChange(false)
  }
  const currentAppliedMonth = new Date(appliedDate).getMonth()

  const [error, setError] = useState<boolean>(false)

  const getSurroundingMonths = (createdDate: string): Date[] => {
    const date = new Date(createdDate)

    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date')
    }

    const year = date.getFullYear()
    const month = date.getMonth()

    // Calculate the previous two months
    const prevMonth1 = new Date(year, month - 1)
    const prevMonth2 = new Date(year, month - 2)

    // Calculate the next month
    const nextMonth = new Date(year, month + 1)

    return [prevMonth2, prevMonth1, date, nextMonth]
  }

  const updateApplication = useApplicationState()

  const onClickUpdateAppliedMonth = async (newDate: Date) => {
    await updateApplication(
      applicationId,
      ApplicationEventType.DATECHANGED,
      undefined,
      newDate,
      undefined,
      `Tímabilið var breytt frá ${getMonth(currentAppliedMonth)} í ${getMonth(
        new Date(newDate).getMonth(),
      )}`,
    )
      .then((updatedApplication) => {
        setApplication(updatedApplication)
        onVisibilityChange(false)
      })
      .catch(() => {
        setError(true)
      })
  }

  return (
    <ModalBase
      baseId="appliedMonth"
      modalLabel="Change applied month modal"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={modalStyles.modalBase}
    >
      <Box className={modalStyles.closeModalBackground} onClick={closeModal} />

      <Box className={modalStyles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          <Box paddingLeft={4} paddingY={2} background="blue400">
            <Text fontWeight="semiBold" color="white">
              {headline}
            </Text>
          </Box>

          <Box padding={4}>
            <Box>
              {getSurroundingMonths(createdDate).map((surroundingMonth) => {
                const date = new Date(surroundingMonth)
                const isActive = date.getMonth() === currentAppliedMonth

                return (
                  <button
                    key={`date-${date}`}
                    disabled={isActive}
                    className={cn({
                      [`${modalButtonStyles.statusOptions}`]: true,
                      [`${modalButtonStyles.activeState}`]: isActive,
                    })}
                    onClick={() => onClickUpdateAppliedMonth(surroundingMonth)}
                  >
                    {getMonth(date.getMonth()) + format(date, ' y')}
                  </button>
                )
              })}
            </Box>
            <div
              className={cn({
                [`errorMessage`]: true,
                [`showErrorMessage`]: error,
              })}
            >
              <Text color="red600" fontWeight="semiBold" variant="small">
                Eitthvað misstókst, vinsamlegast reyndu aftur síðar
              </Text>
            </div>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AppliedMonthModal
