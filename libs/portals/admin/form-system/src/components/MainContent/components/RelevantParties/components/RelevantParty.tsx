import { useMutation } from '@apollo/client'
import { FormSystemField, FormSystemFormApplicant } from '@island.is/api/schema'
import {
  CREATE_FORM_DELEGATION,
  DELETE_FORM_DELEGATION,
  UPDATE_FIELD,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../context/ControlContext'

interface Props {
  applicantType: FormSystemFormApplicant
  relevantApplicant: FormSystemField
}

export const RelevantParty = ({ applicantType, relevantApplicant }: Props) => {
  const { formatMessage } = useIntl()
  const {
    setFocus,
    focus,
    getTranslation,
    controlDispatch,
    control,
    organizationDelegations,
  } = useContext(ControlContext)
  const { isReadOnly } = control
  const hasZendeskSettings = control.form.submissionServiceUrl === 'zendesk'

  const [updateField] = useMutation(UPDATE_FIELD)
  const [createFormDelegationMutation] = useMutation(CREATE_FORM_DELEGATION)
  const [deleteFormDelegationMutation] = useMutation(DELETE_FORM_DELEGATION)

  const [currentApplicant, setCurrentApplicant] =
    useState<FormSystemField>(relevantApplicant)
  const selectedDelegations = control.form.delegations ?? []
  const formRef = useRef(control.form)
  const selectedDelegationsRef = useRef(selectedDelegations)
  const saveQueueRef = useRef(Promise.resolve())

  useEffect(() => {
    const updated = (control.form.fields ?? []).find(
      (f): f is FormSystemField => !!f && f.id === relevantApplicant.id,
    )
    if (updated) {
      setCurrentApplicant(updated)
    }
  }, [control.form.fields, relevantApplicant.id])

  useEffect(() => {
    formRef.current = control.form
    selectedDelegationsRef.current = selectedDelegations
  }, [control.form, selectedDelegations])

  const handleDelegationChange = async (
    delegation: string,
    checked: boolean,
  ) => {
    const formId = control.form.id

    if (!formId) {
      return
    }

    const saveDelegationChange = async () => {
      const mutation = checked
        ? createFormDelegationMutation
        : deleteFormDelegationMutation

      await mutation({
        variables: {
          input: {
            updateFormDelegationDto: {
              formId,
              delegation,
            },
          },
        },
      })

      const delegations = checked
        ? [...new Set([...selectedDelegationsRef.current, delegation])]
        : selectedDelegationsRef.current.filter(
            (selectedDelegation) => selectedDelegation !== delegation,
          )

      const form = {
        ...formRef.current,
        delegations,
      }

      formRef.current = form
      selectedDelegationsRef.current = delegations

      controlDispatch({
        type: 'SET_FORM',
        payload: {
          form,
        },
      })
    }

    const queuedSave = saveQueueRef.current.then(saveDelegationChange)
    saveQueueRef.current = queuedSave.catch(() => undefined)

    await queuedSave
  }

  return (
    <Box paddingLeft={4} paddingTop={2}>
      {(currentApplicant.fieldSettings?.applicantType ===
        'INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL' ||
        currentApplicant.fieldSettings?.applicantType ===
          'INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY') && (
        <GridRow marginBottom={1}>
          <GridColumn span="5/10">
            <Text variant="medium">
              Veldu þau umboð sem umboðsaðilar þurfa að hafa til að sækja um
              þessa umsókn. <br /> ATH. Umboð til einstaklinga eru veitt í
              gegnum umboðskerfið á mínum síðum.
              <br /> Ef umboðið sem þú vilt nota í þessari umsókn er ekki í
              listanum hér til hliðar getur þú haft samband við island.is til að
              fá því bætt við.
            </Text>
          </GridColumn>
          <GridColumn span="5/10">
            <Stack space={1}>
              {organizationDelegations.map((delegation) => (
                <Checkbox
                  key={delegation}
                  name={delegation}
                  label={delegation}
                  value={delegation}
                  checked={selectedDelegations.includes(delegation)}
                  disabled={isReadOnly}
                  onChange={(event) =>
                    void handleDelegationChange(
                      delegation,
                      event.target.checked,
                    )
                  }
                />
              ))}
            </Stack>
          </GridColumn>
          <Box marginBottom={4} />
        </GridRow>
      )}

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
      <GridRow marginBottom={1} marginTop={1}>
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
        {currentApplicant?.fieldSettings?.isAddressRequired !== undefined &&
          currentApplicant.fieldSettings?.isAddressRequired !== null && (
            <GridColumn span="4/12">
              <Checkbox
                label="Krefjast heimilisfangs"
                checked={currentApplicant.fieldSettings?.isAddressRequired}
                disabled={isReadOnly}
                onChange={(e) => {
                  controlDispatch({
                    type: 'SET_APPLICANT_FIELD_SETTINGS',
                    payload: {
                      field: currentApplicant,
                      property: 'isAddressRequired',
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
                            isAddressRequired: e.target.checked,
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
      {currentApplicant?.fieldSettings?.fetchEmailFromMyPages !== undefined &&
        currentApplicant?.fieldSettings?.fetchEmailFromMyPages !== null && (
          <GridRow marginBottom={1}>
            <GridColumn span="12/12">
              <Checkbox
                label="Sækja persónulegt netfang af Mínum síðum innskráðs notanda"
                checked={currentApplicant.fieldSettings?.fetchEmailFromMyPages}
                disabled={isReadOnly}
                onChange={(e) => {
                  controlDispatch({
                    type: 'SET_APPLICANT_FIELD_SETTINGS',
                    payload: {
                      field: currentApplicant,
                      property: 'fetchEmailFromMyPages',
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
                            fetchEmailFromMyPages: e.target.checked,
                          },
                        },
                      },
                    },
                  })
                }}
              />
            </GridColumn>
          </GridRow>
        )}
    </Box>
  )
}
