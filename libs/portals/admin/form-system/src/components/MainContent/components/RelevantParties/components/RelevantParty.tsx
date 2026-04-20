import { useMutation } from '@apollo/client'
import { FormSystemField, FormSystemFormApplicant } from '@island.is/api/schema'
import { UPDATE_FIELD } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
} from '@island.is/island-ui/core'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../context/ControlContext'

interface Props {
  applicantType: FormSystemFormApplicant
  relevantApplicant: FormSystemField
}

export const RelevantParty = ({ applicantType, relevantApplicant }: Props) => {
  const { formatMessage } = useIntl()
  const { setFocus, focus, getTranslation, controlDispatch, control } =
    useContext(ControlContext)
  const { isReadOnly } = control
  const hasZendeskSettings = control.form.submissionServiceUrl === 'zendesk'

  const [updateField] = useMutation(UPDATE_FIELD)

  const [currentApplicant, setCurrentApplicant] =
    useState<FormSystemField>(relevantApplicant)

  useEffect(() => {
    const updated = (control.form.fields ?? []).find(
      (f): f is FormSystemField => !!f && f.id === relevantApplicant.id,
    )
    if (updated) {
      setCurrentApplicant(updated)
    }
  }, [control.form.fields, relevantApplicant.id])

  return (
    <Box paddingLeft={4} paddingTop={2}>
      <GridRow>
        <GridColumn span="5/10">
          <Input
            label={applicantType.description?.is ?? ''}
            name={currentApplicant.fieldSettings?.applicantType ?? ''}
            backgroundColor="blue"
            readOnly={isReadOnly}
            value={currentApplicant.name?.is ?? ''}
            onFocus={(e) => setFocus(e.target.value)}
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_APPLICANT_NAME',
                payload: {
                  lang: 'is',
                  newValue: e.target.value,
                  id: currentApplicant.id,
                },
              })
            }}
            onBlur={async (e) =>
              e.target.value !== focus &&
              updateField({
                variables: {
                  input: {
                    id: currentApplicant.id,
                    updateFieldDto: {
                      name: {
                        is: e.target.value,
                        en: currentApplicant.name?.en ?? undefined,
                      },
                    },
                  },
                },
              })
            }
          />
        </GridColumn>
        <GridColumn span="5/10">
          <Input
            label={formatMessage(m.englishTranslation)}
            name={'en-' + (currentApplicant.fieldSettings?.applicantType ?? '')}
            backgroundColor="blue"
            readOnly={isReadOnly}
            value={currentApplicant.name?.en ?? ''}
            onFocus={async (e) => {
              if (!currentApplicant.name?.en && currentApplicant.name?.is) {
                const translation = await getTranslation(
                  currentApplicant.name.is,
                )
                controlDispatch({
                  type: 'CHANGE_APPLICANT_NAME',
                  payload: {
                    lang: 'en',
                    newValue: translation.translation,
                    id: currentApplicant.id,
                  },
                })
              }
              setFocus(e.target.value)
            }}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_APPLICANT_NAME',
                payload: {
                  lang: 'en',
                  newValue: e.target.value,
                  id: currentApplicant.id,
                },
              })
            }
            onBlur={(e) =>
              e.target.value !== focus &&
              updateField({
                variables: {
                  input: {
                    id: currentApplicant.id,
                    updateFieldDto: {
                      name: {
                        ...currentApplicant.name,
                        en: e.target.value,
                      },
                    },
                  },
                },
              })
            }
          />
        </GridColumn>
      </GridRow>
      <GridRow marginBottom={4} marginTop={1}>
        {currentApplicant?.fieldSettings?.isEmailRequired !== undefined &&
          currentApplicant.fieldSettings?.isEmailRequired !== null && (
            <GridColumn span="4/12">
              <Checkbox
                label="Krefjast netfangs"
                checked={currentApplicant.fieldSettings?.isEmailRequired}
                disabled={isReadOnly || hasZendeskSettings}
                tooltip={
                  hasZendeskSettings
                    ? 'Netfang þarf að vera krafist þegar Zendesk er valið sem þjónustuaðili fyrir innsendingar.'
                    : undefined
                }
                onChange={(e) => {
                  controlDispatch({
                    type: 'SET_APPLICANT_FIELD_SETTINGS',
                    payload: {
                      field: currentApplicant,
                      property: 'isEmailRequired',
                      value: e.target.checked,
                    },
                  })
                  updateField({
                    variables: {
                      input: {
                        id: currentApplicant.id,
                        updateFieldDto: {
                          fieldSettings: {
                            ...currentApplicant.fieldSettings,
                            isEmailRequired: e.target.checked,
                          },
                        },
                      },
                    },
                  })
                }}
              />
            </GridColumn>
          )}
        {currentApplicant?.fieldSettings?.isPhoneRequired !== undefined &&
          currentApplicant.fieldSettings?.isPhoneRequired !== null && (
            <GridColumn span="4/12">
              <Checkbox
                label="Krefjast símanúmers"
                checked={currentApplicant.fieldSettings?.isPhoneRequired}
                disabled={isReadOnly}
                onChange={(e) => {
                  controlDispatch({
                    type: 'SET_APPLICANT_FIELD_SETTINGS',
                    payload: {
                      field: currentApplicant,
                      property: 'isPhoneRequired',
                      value: e.target.checked,
                    },
                  })
                  updateField({
                    variables: {
                      input: {
                        id: currentApplicant.id,
                        updateFieldDto: {
                          fieldSettings: {
                            ...currentApplicant.fieldSettings,
                            isPhoneRequired: e.target.checked,
                          },
                        },
                      },
                    },
                  })
                }}
              />
            </GridColumn>
          )}
      </GridRow>
    </Box>
  )
}
