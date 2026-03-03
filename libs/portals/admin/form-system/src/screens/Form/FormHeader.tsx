import { SectionTypes } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  GridColumn as Column,
  GridRow as Row,
  Tabs,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Outlet } from 'react-router-dom'
import { ControlContext } from '../../context/ControlContext'
import { baseSettingsStep } from '../../lib/utils/getBaseSettingsSection'

type FormTabType = {
  id: 'settings' | 'step'
  label: string
}

const FORM_TABS: FormTabType[] = [
  {
    id: 'settings',
    label: 'GrunnStillingar',
  },
  {
    id: 'step',
    label: 'Skref',
  },
]

export const FormHeader = () => {
  const { formatMessage } = useIntl()
  const { control, controlDispatch, setInSettings, inSettings } =
    useContext(ControlContext)
  const { sections } = control.form

  const onTabChange = (tabId: string) => {
    if (tabId === 'settings') {
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
    } else {
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
    }
  }

  return (
    <Box>
      <Row>
        <Column offset="4/12" span="8/12">
          <Box
            style={{
              maxWidth: '1200px',
              width: '100%',
              position: 'relative',
            }}
          >
            <Tabs
              label="formTabs"
              tabs={FORM_TABS.map((tab) => ({
                id: tab.id,
                label: formatMessage(m[tab.id as keyof typeof m]),
                content: <Outlet />,
              }))}
              onChange={onTabChange}
              variant="default"
              selected={inSettings ? 'settings' : 'step'}
            />
          </Box>
        </Column>
      </Row>
    </Box>
  )
}
