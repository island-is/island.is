import { Box, Button, GridRow as Row, GridColumn as Column, Tabs } from '@island.is/island-ui/core'
import { Outlet, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { SectionTypes } from '@island.is/form-system/enums'
import { baseSettingsStep } from '../../lib/utils/getBaseSettingsSection'

type FormTabType = {
  id: 'settings' | 'step',
  label: string
}

const FORM_TABS: FormTabType[] = [
  {
    id: 'settings',
    label: 'GrunnStillingar',
  },
  {
    id: 'step',
    label: 'Skref'
  }
]

export const FormHeader = () => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { control, controlDispatch, setInSettings, inSettings } = useContext(ControlContext)
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
    <Box marginBottom={4}>
      <Row>
        <Column span="3/12">
          <Button
            variant="text"
            size="small"
            onClick={async () => {
              navigate(FormSystemPaths.FormSystemRoot)
            }}
            preTextIcon="arrowBack"
          >
            {formatMessage(m.back)}
          </Button>
        </Column>
        <Column span="9/12">
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
                content: <Outlet />
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
