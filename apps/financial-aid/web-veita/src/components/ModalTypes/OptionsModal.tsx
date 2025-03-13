import React from 'react'

import * as styles from './ModalTypes.css'
import cn from 'classnames'

import { getState, ApplicationState } from '@island.is/financial-aid/shared/lib'
import { motion } from 'motion/react'

interface Props {
  isModalVisable: boolean
  activeState: ApplicationState
  onClick(
    event: React.MouseEvent<HTMLButtonElement>,
    stateOption: ApplicationState,
  ): void
}

const OptionsModal = ({ activeState, onClick, isModalVisable }: Props) => {
  return (
    <>
      {isModalVisable && (
        <motion.div
          data-testid="optionsModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Object.values(ApplicationState).map((item, index) => {
            return (
              <button
                key={'statusoptions-' + index}
                disabled={item === activeState}
                className={cn({
                  [`${styles.statusOptions}`]: true,
                  [`${styles.activeState}`]: item === activeState,
                })}
                onClick={(e) => onClick(e, item)}
              >
                {getState[item]}
              </button>
            )
          })}
        </motion.div>
      )}
    </>
  )
}

export default OptionsModal
