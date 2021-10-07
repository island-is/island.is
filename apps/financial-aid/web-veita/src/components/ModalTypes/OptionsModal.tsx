import React from 'react'

import * as styles from './ModalTypes.treat'
import cn from 'classnames'

import { getState, ApplicationState } from '@island.is/financial-aid/shared/lib'

interface Props {
  activeState: ApplicationState
  onClick(
    event: React.MouseEvent<HTMLButtonElement>,
    stateOption: ApplicationState,
  ): void
}

const OptionsModal = ({ activeState, onClick }: Props) => {
  const statusOptions = [
    ApplicationState.NEW,
    ApplicationState.INPROGRESS,
    ApplicationState.DATANEEDED,
    ApplicationState.APPROVED,
    ApplicationState.REJECTED,
  ]

  return (
    <>
      {statusOptions.map((item, index) => {
        return (
          <button
            key={'statusoptions-' + index}
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
    </>
  )
}

export default OptionsModal
