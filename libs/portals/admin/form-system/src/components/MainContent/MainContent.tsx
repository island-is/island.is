import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  GridColumn as Column,
  Input,
  GridRow as Row,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../context/ControlContext'
import { BaseSettings } from './components/BaseSettings/BaseSettings'
import { Completed } from './components/Completed/Completed'
import { FieldContent } from './components/FieldContent/FieldContent'
import { Lifetime } from './components/Lifetime/Lifetime'
import { Payment } from './components/Payment/Payment'
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
  const { activeItem, form, isReadOnly } = control
  const [openPreview, setOpenPreview] = useState(false)
  const { formatMessage } = useIntl()

  const showIdentifier =
    form.useValidate && (activeItem.data as FormSystemScreen)?.shouldValidate

  const activeScreen =
    activeItem.type === 'Screen'
      ? (activeItem.data as FormSystemScreen)
      : undefined

  const screenHasMultisetFields = useMemo(() => {
    if (!activeScreen?.id) return false

    return (
      form.fields?.some(
        (field) =>
          field?.screenId === activeScreen.id &&
          (field as FormSystemField)?.isPartOfMultiset === true,
      ) ?? false
    )
  }, [form.fields, activeScreen?.id])

  // 3) Disable only when checkbox is checked AND there are multiset fields
  const disableAllowMultiple =
    (activeScreen?.isMulti ?? false) && screenHasMultisetFields

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
      ) : activeItem.type === 'Section' &&
        (activeItem.data as FormSystemSection).id === 'Lifetime' ? (
        <Lifetime />
      ) : (activeItem.data as FormSystemSection).sectionType ===
        SectionTypes.PAYMENT ? (
        <Payment />
      ) : (
        <Stack space={2}>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.name)}
                name="name"
                value={activeItem?.data?.name?.is ?? ''}
                backgroundColor="blue"
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
            <>
              <Row>
                <Column span="3/12">
                  <Checkbox
                    name="multi"
                    disabled={isReadOnly || disableAllowMultiple}
                    tooltip={
                      disableAllowMultiple
                        ? 'Ekki er hægt að afmerkja skjá sem fjölval ef hann hefur reit sem er merktur sem hluti af fjölmenginu'
                        : undefined
                    }
                    label={formatMessage(m.allowMultiple)}
                    checked={
                      (activeItem.data as FormSystemScreen).isMulti ?? false
                    }
                    onChange={(e) => {
                      controlDispatch({
                        type: 'TOGGLE_IS_MULTI',
                        payload: {
                          checked: e.target.checked,
                          update: () => undefined,
                        },
                      })
                      const val = e.target.checked ? 2 : 0
                      controlDispatch({
                        type: 'CHANGE_MULTI_MAX',
                        payload: {
                          value: val,
                          update: updateActiveItem,
                        },
                      })
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column span="7/12">
                  {(activeItem.data as FormSystemScreen).isMulti && (
                    <Box marginTop={2}>
                      <Select
                        name="multiMax"
                        label={formatMessage(m.multiMax)}
                        isDisabled={isReadOnly}
                        backgroundColor="blue"
                        options={Array.from({ length: 35 - 2 + 1 }, (_, i) => {
                          const n = i + 2
                          return { label: String(n), value: String(n) }
                        })}
                        value={{
                          label: String(
                            (activeItem.data as FormSystemScreen).multiMax ?? 2,
                          ),
                          value: String(
                            (activeItem.data as FormSystemScreen).multiMax ?? 2,
                          ),
                        }}
                        onChange={(e) => {
                          controlDispatch({
                            type: 'CHANGE_MULTI_MAX',
                            payload: {
                              value: Number(e?.value),
                              update: updateActiveItem,
                            },
                          })
                        }}
                      />
                    </Box>
                  )}
                </Column>
              </Row>
              <Row>
                <Column span="12/12">
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
                      {showIdentifier && (
                        <Box marginTop={4}>
                          <Input
                            label="identifier"
                            name="identifier"
                            value={
                              (activeItem.data as FormSystemScreen)
                                .identifier ?? ''
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
            </>
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
