import { Box, Inline } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NavbarTab.css'
import { Dispatch, SetStateAction, useContext } from 'react'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { baseSettingsStep } from '../../../../utils/getBaseSettingsStep'

type Props = {
  inSettings: boolean
  setInSettings: Dispatch<SetStateAction<boolean>>
}

export default function NavbarTab({ inSettings, setInSettings }: Props) {
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  return (
    <Box display="flex" flexDirection="row">
      <Inline space={4}>
        <Box
          className={cn({
            [styles.notSelected]: inSettings,
            [styles.selected]: !inSettings,
          })}
          onClick={() => {
            listsDispatch({
              type: 'setActiveItem',
              payload: {
                type: 'Step',
                data: lists.steps[2],
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
            listsDispatch({
              type: 'setActiveItem',
              payload: {
                type: 'Step',
                data: baseSettingsStep,
              },
            })
            setInSettings(true)
          }}
        >
          Grunnstillingar
        </Box>
      </Inline>
    </Box>
  )
}
