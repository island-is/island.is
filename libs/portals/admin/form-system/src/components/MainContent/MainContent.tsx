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
import { FormSystemSection, FormSystemScreen } from '@island.is/api/schema'
import { BaseSettings } from './components/BaseSettings/BaseSettings'
import { Premises } from './components/Premises/Premises'
import { FieldContent } from './components/FieldContent/FieldContent'
import { PreviewStepOrGroup } from './components/PreviewStepOrGroup/PreviewStepOrGroup'
import { useIntl } from 'react-intl'
import { RelevantParties } from './components/RelevantParties/RelevantParties'
import { m } from '@island.is/form-system/ui'
import { SectionTypes } from '@island.is/form-system/enums'

export const MainContent = () => {
  const {
    control,
    controlDispatch,
    updateActiveItem,
    setFocus,
    focus,
    getTranslation,
  } = useContext(ControlContext)
  const { activeItem } = control
  const [openPreview, setOpenPreview] = useState(false)
  const { formatMessage } = useIntl()
  return (
    <Box padding={2}>
      {activeItem.type === 'Field' ? (
        <FieldContent />
      ) : activeItem.type === 'Section' &&
        (activeItem.data as FormSystemSection).id === 'BaseSettings' ? (
        <BaseSettings />
      ) : activeItem.type === 'Section' &&
        (activeItem.data as FormSystemSection).sectionType ===
          SectionTypes.PREMISES ? (
        <Premises />
      ) : activeItem.type === 'Section' &&
        (activeItem.data as FormSystemSection).sectionType ===
          SectionTypes.PARTIES ? (
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
                onFocus={async (e) => {
                  if (
                    !activeItem?.data?.name?.en &&
                    activeItem?.data?.name?.is !== ''
                  ) {
                    const translation = await getTranslation(
                      activeItem?.data?.name?.is ?? '',
                    )
                    controlDispatch({
                      type: 'CHANGE_NAME',
                      payload: {
                        lang: 'en',
                        newValue: translation.translation,
                      },
                    })
                  }
                  setFocus(e.target.value)
                }}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
          {activeItem.type === 'Screen' && (
            <Row>
              <Column>
                <Checkbox
                  name="multi"
                  label={formatMessage(m.allowMultiple)}
                  checked={
                    (activeItem.data as FormSystemScreen).multiset !== 0 &&
                    (activeItem.data as FormSystemScreen).multiset !== null
                  }
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
