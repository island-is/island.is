import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import {
  CREATE_APPLICANT,
  DELETE_APPLICANT,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { removeTypename } from '../../../../lib/utils/removeTypename'
import { applicantTypeGroups } from '../../../../lib/utils/applicantTypeGroups'
import { PartyType } from './components/PartyType'

export const RelevantParties = () => {
  const [createApplicant] = useMutation(CREATE_APPLICANT)
  const [deleteApplicant] = useMutation(DELETE_APPLICANT)
  const { control, controlDispatch } = useContext(ControlContext)
  const { formatMessage } = useIntl()
  const { id: formId } = control.form

  const [applicantFields, setApplicantFields] = useState<FormSystemField[]>(
    Array.isArray(control.form.fields)
      ? control.form.fields.filter((f): f is FormSystemField => !!f)
      : [],
  )

  const handleCheckboxChange = async (
    typesArray: string[],
    checked: boolean,
  ) => {
    try {
      if (checked) {
        const createdScreens = await Promise.all(
          typesArray.map(async (applicantTypeId) => {
            const newScreen = await createApplicant({
              variables: {
                input: {
                  createFormApplicantTypeDto: {
                    formId,
                    applicantTypeId,
                  },
                },
              },
            })
            const maybeScreen = newScreen.data.createFormSystemApplicantType
            return maybeScreen ? removeTypename(maybeScreen) : null
          }),
        )
        if (createdScreens.length) {
          createdScreens.forEach((screen) => {
            controlDispatch({
              type: 'ADD_SCREEN',
              payload: { screen, isApplicant: true },
            })
            if (screen && screen.fields) {
              screen.fields.forEach((field: FormSystemField) => {
                if (field) {
                  setApplicantFields((prev) => [...prev, field])
                  controlDispatch({
                    type: 'ADD_FIELD',
                    payload: { field, isApplicant: true },
                  })
                }
              })
            }
          })
        }
      } else {
        const deletedScreens = await Promise.all(
          typesArray.map(async (applicantTypeId) => {
            const deletedScreen = await deleteApplicant({
              variables: {
                input: {
                  deleteFormApplicantTypeDto: {
                    formId,
                    applicantTypeId,
                  },
                },
              },
            })
            const maybeScreen = deletedScreen.data.deleteFormSystemApplicantType
            return maybeScreen ? removeTypename(maybeScreen) : null
          }),
        )
        if (deletedScreens.length) {
          deletedScreens.forEach((screen) => {
            controlDispatch({
              type: 'REMOVE_SCREEN',
              payload: { id: screen.id, isApplicant: true },
            })
            if (screen && screen.fields) {
              screen.fields.forEach((field: FormSystemField) => {
                if (field) {
                  setApplicantFields((prev) =>
                    prev.filter((f) => f.id !== field.id),
                  )
                  controlDispatch({
                    type: 'REMOVE_FIELD',
                    payload: { id: field.id, isApplicant: true },
                  })
                }
              })
            }
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Stack space={2}>
      <Text variant="h4">{formatMessage(m.selectIndividuals)}</Text>

      <PartyType
        groupApplicantTypes={applicantTypeGroups.individual}
        label={formatMessage(m.individual)}
        formApplicantFields={applicantFields.filter(
          (f) => f.fieldType === 'APPLICANT',
        )}
        handleCheckboxChange={handleCheckboxChange}
      />

      {/* <PartyType
        groupApplicantTypes={applicantTypeGroups.individualDelegation}
        label={formatMessage(m.individualOnBehalfPerson)}
        formApplicantFields={applicantFields.filter(
          (f) => f.fieldType === 'APPLICANT',
        )}
        handleCheckboxChange={handleCheckboxChange}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.legalEntityDelegation}
        label={formatMessage(m.individualOnBehalfLegalEntity)}
        formApplicantFields={applicantFields.filter(
          (f) => f.fieldType === 'APPLICANT',
        )}
        handleCheckboxChange={handleCheckboxChange}
      /> */}

      <PartyType
        groupApplicantTypes={applicantTypeGroups.procuration}
        label={formatMessage(m.individualWithPowerOfAttorney)}
        formApplicantFields={applicantFields.filter(
          (f) => f.fieldType === 'APPLICANT',
        )}
        handleCheckboxChange={handleCheckboxChange}
      />
    </Stack>
  )
}
