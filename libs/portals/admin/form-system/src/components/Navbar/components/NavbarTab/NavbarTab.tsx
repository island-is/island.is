import { Box, Inline } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NavbarTab.css'
import { useContext } from 'react'
import { baseSettingsStep } from '../../../../utils/getBaseSettingsStep'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'
import { m } from '../../../../lib/messages'

export const NavbarTab = () => {
  const { control, controlDispatch, inSettings, setInSettings } =
    useContext(ControlContext)
  const { stepsList: steps } = control.form
  const { formatMessage } = useIntl()
  return (
    <Box display="flex" flexDirection="row">
      <Inline space={4}>
        <Box
          className={cn({
            [styles.notSelected]: inSettings,
            [styles.selected]: !inSettings,
          })}
          onClick={() => {
            const step = steps?.find((s) => s?.type === 'Input')
            controlDispatch({
              type: 'SET_ACTIVE_ITEM',
              payload: {
                activeItem: {
                  type: 'Step',
                  data: step,
                },
              },
            })
            setInSettings(false)
          }}
        >
          Skref
        </Box>
        <Box
          className={cn({
            [styles.notSelected]: !inSettings,
            [styles.selected]: inSettings,
          })}
          onClick={() => {
            controlDispatch({
              type: 'SET_ACTIVE_ITEM',
              payload: {
                activeItem: {
                  type: 'Step',
                  data: baseSettingsStep,
                },
              },
            })
            setInSettings(true)
          }}
        >
          {formatMessage(m.basicSettings)}
        </Box>
      </Inline>
    </Box>
  )
}
