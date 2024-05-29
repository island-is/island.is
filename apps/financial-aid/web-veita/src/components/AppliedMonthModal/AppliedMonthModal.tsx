import React from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'
import format from 'date-fns/format'

import * as styles from './AidAmountModal.css'
import * as modalButtonStyles from '../ModalTypes/ModalTypes.css'
import cn from 'classnames'

import * as modalStyles from '../StateModal/StateModal.css'

import { Application, getMonth } from '@island.is/financial-aid/shared/lib'

interface Props {
  headline: string
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  appliedDate: string
  createdDate: string
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
}

const AppliedMonthModal = ({
  headline,
  isVisible,
  onVisibilityChange,
  appliedDate,
  createdDate,
  setApplication,
}: Props) => {
  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  const getSurroundingMonths = (createdDate: string): Date[] => {
    const date = new Date(createdDate)

    if (isNaN(date.getTime())) {
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

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={modalStyles.modalBase}
    >
      <Box
        className={modalStyles.closeModalBackground}
        onClick={closeModal}
      ></Box>

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
              {getSurroundingMonths(createdDate).map((el) => {
                const date = new Date(el)
                const isActive =
                  date.getMonth() === new Date(appliedDate).getMonth()

                return (
                  <button
                    key={'date-' + date}
                    disabled={isActive}
                    className={cn({
                      [`${modalButtonStyles.statusOptions}`]: true,
                      [`${modalButtonStyles.activeState}`]: isActive,
                    })}
                    onClick={(e) => onClick(e, el)}
                  >
                    {getMonth(date.getMonth()) + format(date, ' y')}
                  </button>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AppliedMonthModal
