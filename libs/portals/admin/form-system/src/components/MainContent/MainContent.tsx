import {
  Box,
  Input,
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Button,
  Checkbox,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { FormSystemGroup, FormSystemStep } from '@island.is/api/schema'
import { BaseSettings } from './components/BaseSettings/BaseSettings'
import { Premises } from './components/Premises/Premises'
import { InputContent } from './components/InputContent/InputContent'
import { PreviewStepOrGroup } from './components/PreviewStepOrGroup/PreviewStepOrGroup'
import { RelevantParties } from './components/RelevantParties/RevelantParties'
import { useIntl } from 'react-intl'
import { m } from '../../lib/messages'

export const MainContent = () => {
  const { control, controlDispatch, updateActiveItem, setFocus, focus } =
    useContext(ControlContext)
  const { activeItem } = control
  const [openPreview, setOpenPreview] = useState(false)
  const { formatMessage } = useIntl()

  return (
    <Box padding={2}>
      {activeItem.type === 'Input' ? (
        <InputContent />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as FormSystemStep).type === 'BaseSetting' ? (
        <BaseSettings />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as FormSystemStep).type === 'Premises' ? (
        <Premises />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as FormSystemStep).type === 'Parties' ? (
        <RelevantParties />
      ) : openPreview ? (
        <PreviewStepOrGroup setOpenPreview={setOpenPreview} />
      ) : (
        <Stack space={2}>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.name)}
                name="name"
                value={activeItem?.data?.name?.is ?? ''}
                backgroundColor="blue"
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_NAME',
                    payload: {
                      lang: 'is',
                      newValue: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.nameEnglish)}
                name="nameEn"
                value={activeItem?.data?.name?.en ?? ''}
                backgroundColor="blue"
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_NAME',
                    payload: {
                      lang: 'en',
                      newValue: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
          {activeItem.type === 'Group' && (
            <Row>
              <Column>
                <Checkbox
                  name="multi"
                  label={formatMessage(m.allowMultiple)}
                  checked={(activeItem.data as FormSystemGroup).multiSet !== 0}
                  onChange={(e) =>
                    controlDispatch({
                      type: 'TOGGLE_MULTI_SET',
                      payload: {
                        checked: e.target.checked,
                        update: updateActiveItem,
                      },
                    })
                  }
                />
              </Column>
            </Row>
          )}
          <Row>
            <Column>
              <Button variant="ghost" onClick={() => setOpenPreview(true)}>
                {formatMessage(m.preview)}
              </Button>
            </Column>
          </Row>
        </Stack>
      )}
    </Box>
  )
}
