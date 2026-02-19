import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  GridColumn as Column,
  Input,
  GridRow as Row,
  Stack,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../context/ControlContext'
import { BaseSettings } from './components/BaseSettings/BaseSettings'
import { Completed } from './components/Completed/Completed'
import { FieldContent } from './components/FieldContent/FieldContent'
import { Premises } from './components/Premises/Premises'
import { PreviewStepOrGroup } from './components/PreviewStepOrGroup/PreviewStepOrGroup'
import { RelevantParties } from './components/RelevantParties/RelevantParties'
import { Urls } from './components/Urls/Urls'

export const MainContent = () => {
  const {
    control,
    controlDispatch,
    updateActiveItem,
    setFocus,
    focus,
    getTranslation,
  } = useContext(ControlContext)
  const { activeItem, form } = control
  const [openPreview, setOpenPreview] = useState(false)
  const { formatMessage } = useIntl()

  const showIdentifier =
    (form.useValidate &&
      (activeItem.data as FormSystemScreen)?.shouldValidate) ||
    (form.usePopulate && (activeItem.data as FormSystemScreen)?.shouldPopulate)

  return (
    <Box>
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
      ) : (activeItem.data as FormSystemSection).sectionType ===
        SectionTypes.COMPLETED ? (
        <Completed />
      ) : activeItem.type === 'Section' &&
        (activeItem.data as FormSystemSection).id === 'Urls' ? (
        <Urls />
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
              <Column span="12/12">
                {/* <Checkbox
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
                /> */}
                {form.submissionServiceUrl !== 'zendesk' && (
                  <>
                    {form.useValidate && (
                      <Box marginTop={2}>
                        <Checkbox
                          name="validate"
                          label={formatMessage(m.screenValidate)}
                          checked={
                            (activeItem.data as FormSystemScreen)
                              .shouldValidate ?? false
                          }
                          onChange={(e) =>
                            controlDispatch({
                              type: 'TOGGLE_SHOULD_VALIDATE',
                              payload: {
                                checked: e.target.checked,
                                update: updateActiveItem,
                              },
                            })
                          }
                        />
                      </Box>
                    )}
                    {form.usePopulate && (
                      <Box marginTop={2}>
                        <Checkbox
                          name="populate"
                          label={formatMessage(m.screenPopulate)}
                          checked={
                            (activeItem.data as FormSystemScreen)
                              .shouldPopulate ?? false
                          }
                          onChange={(e) =>
                            controlDispatch({
                              type: 'TOGGLE_SHOULD_POPULATE',
                              payload: {
                                checked: e.target.checked,
                                update: updateActiveItem,
                              },
                            })
                          }
                        />
                      </Box>
                    )}
                    {showIdentifier && (
                      <Box marginTop={4}>
                        <Input
                          label="identifier"
                          name="identifier"
                          value={
                            (activeItem.data as FormSystemScreen).identifier ??
                            ''
                          }
                          backgroundColor="blue"
                          onFocus={(e) => setFocus(e.target.value)}
                          readOnly
                        />
                      </Box>
                    )}
                  </>
                )}
              </Column>
            </Row>
          )}
          <Row>
            <Column>
              <Box marginTop={4}>
                <Button variant="ghost" onClick={() => setOpenPreview(true)}>
                  {formatMessage(m.preview)}
                </Button>
              </Box>
            </Column>
          </Row>
        </Stack>
      )}
    </Box>
  )
}
