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
import ControlContext from '../../context/ControlContext'
import { FormSystemGroup, FormSystemStep } from '@island.is/api/schema'
import BaseSettings from './components/BaseSettings/BaseSettings'
import Premises from './components/Premises/Premises'
import InputContent from './components/InputContent/InputContent'
import PreviewStepOrGroup from './components/PreviewStepOrGroup/PreviewStepOrGroup'
import RelevantParties from './components/RelevantParties/RevelantParties'

export default function MainContent() {
  const { control, controlDispatch, updateActiveItem, setFocus, focus } =
    useContext(ControlContext)
  const { activeItem } = control
  const [openPreview, setOpenPreview] = useState(false)

  return (
    <Box padding={2}>
      {activeItem.type === 'Input' ? (
        <InputContent />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as FormSystemStep).type === 'BaseSetting' ? (
        <BaseSettings />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as FormSystemStep).type === 'Forsendur' ? (
        <Premises />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as FormSystemStep).type === 'Aðilar' ? (
        <RelevantParties />
      ) : openPreview ? (
        <PreviewStepOrGroup setOpenPreview={setOpenPreview} />
      ) : (
        <Stack space={2}>
          <Row>
            <Column span="10/10">
              <Input
                label="Heiti"
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
                label="Heiti (enska)"
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
                  label="Er fjölval"
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
                Skoða
              </Button>
            </Column>
          </Row>
        </Stack>
      )}
    </Box>
  )
}
