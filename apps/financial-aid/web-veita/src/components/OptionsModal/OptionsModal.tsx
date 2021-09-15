import React from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './OptionsModal.treat'
import cn from 'classnames'

import { getState, ApplicationState } from '@island.is/financial-aid/shared/lib'

interface Props {
  state: ApplicationState
  onClick(
    event: React.MouseEvent<HTMLButtonElement>,
    stateOption: ApplicationState,
  ): void
}

const OptionsModal = ({ state, onClick }: Props) => {
  const statusOptions = [
    ApplicationState.NEW,
    ApplicationState.INPROGRESS,
    ApplicationState.DATANEEDED,
    ApplicationState.APPROVED,
    ApplicationState.REJECTED,
  ]

  return (
    <Box display="block" width="full" padding={4}>
      {statusOptions.map((item, index) => {
        return (
          <button
            key={'statusoptions-' + index}
            className={cn({
              [`${styles.statusOptions}`]: true,
              [`${styles.activeState}`]: item === state,
            })}
            onClick={(e) => onClick(e, item)}
          >
            {getState[item]}
          </button>
        )
      })}
    </Box>
  )
}

export default OptionsModal
