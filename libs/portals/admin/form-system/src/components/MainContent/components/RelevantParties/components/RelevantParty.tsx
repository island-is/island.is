import { useMutation } from '@apollo/client'
import { FormSystemField, FormSystemFormApplicant } from '@island.is/api/schema'
import { UPDATE_FIELD } from '@island.is/form-system/graphql'
import { Box, GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import { useContext, useEffect, useState } from 'react'
import { m } from '@island.is/form-system/ui'
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
    </Box>
  )
}
