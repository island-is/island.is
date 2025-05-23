import { Box, Button, GridRow as Row } from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { SectionTypes } from '@island.is/form-system/enums'
import { baseSettingsStep } from '../../lib/utils/getBaseSettingsSection'

export const FormHeader = () => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { control, controlDispatch, setInSettings } = useContext(ControlContext)
  const { sections } = control.form

  return (
    <Box marginBottom={4} marginLeft={2}>
      <Row>
        <Box marginRight={4}>
          <Button
            variant="ghost"
            size="default"
            onClick={async () => {
              navigate(FormSystemPaths.FormSystemRoot)
            }}
          >
            {formatMessage(m.back)}
          </Button>
        </Box>
        <Box marginLeft={4}>
          <Button
            variant="ghost"
            size="default"
            onClick={() => {
              controlDispatch({
                type: 'SET_ACTIVE_ITEM',
                payload: {
                  activeItem: {
                    type: 'Section',
                    data: baseSettingsStep,
                  },
                },
              })
              setInSettings(true)
            }}
          >
            {formatMessage(m.settings)}
          </Button>
        </Box>
        <Box marginLeft={2}>
          <Button
            variant="ghost"
            size="default"
            onClick={() => {
              const section = sections?.find(
                (s) => s?.sectionType === SectionTypes.INPUT,
              )
              controlDispatch({
                type: 'SET_ACTIVE_ITEM',
                payload: {
                  activeItem: {
                    type: 'Section',
                    data: section,
                  },
                },
              })
              setInSettings(false)
            }}
          >
            {formatMessage(m.step)}
          </Button>
        </Box>
      </Row>
    </Box>
  )
}
