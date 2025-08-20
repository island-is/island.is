import { useContext, useEffect, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import {
  CREATE_APPLICANT,
  DELETE_APPLICANT,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import {
  FormSystemField,
  FormSystemFormApplicant,
  FormSystemScreen,
} from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { removeTypename } from '../../../../lib/utils/removeTypename'
import { applicantTypeGroups } from '../../../../lib/utils/applicantTypeGroups'
import { PartyType } from './components/PartyType'

export const RelevantParties = () => {
  const [createApplicant] = useMutation(CREATE_APPLICANT)
  const [deleteApplicant] = useMutation(DELETE_APPLICANT)
  const { control, controlDispatch } = useContext(ControlContext)
  const { formatMessage } = useIntl()
  const { id: formId, applicantTypes } = control.form
  const [formApplicants, setFormApplicants] = useState<
    FormSystemFormApplicant[]
  >(applicantTypes?.filter((a): a is FormSystemFormApplicant => !!a) ?? [])

  const [applicantScreens, setApplicantScreens] = useState<FormSystemScreen[]>(
    Array.isArray(control.form.screens)
      ? control.form.screens.filter((s): s is FormSystemScreen => !!s)
      : [],
  )

  const [applicantFields, setApplicantFields] = useState<FormSystemField[]>(
    Array.isArray(control.form.fields)
      ? control.form.fields.filter((f): f is FormSystemField => !!f)
      : [],
  )

  useEffect(() => {
    console.log('applicantScreens updated:', applicantScreens)
  }, [applicantScreens])

  const handleCheckboxChange = async (
    typesArray: string[],
    checked: boolean,
  ) => {
    console.log('applicantScreens', applicantScreens)
    console.log('applicantFields', applicantFields)
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
            console.log('createApplicant response:', newScreen)
            const maybeScreen = newScreen.data.createFormSystemApplicantType
            return maybeScreen ? removeTypename(maybeScreen) : null
          }),
        )
        if (createdScreens.length) {
          setApplicantScreens((prev) => [...prev, ...createdScreens])

          createdScreens.forEach((screen) => {
            controlDispatch({
              type: 'ADD_SCREEN',
              payload: { screen },
            })
            if (screen && screen.fields) {
              screen.fields.forEach((field: FormSystemField) => {
                if (field) {
                  setApplicantFields((prev) => [...prev, field])
                  controlDispatch({
                    type: 'ADD_FIELD',
                    payload: { field },
                  })
                }
              })
            }
          })
        }
      } else {
        await Promise.all(
          typesArray.map(async (applicantType) => {
            const applicant = formApplicants.find(
              (a) => a.applicantTypeId === applicantType,
            )
            if (applicant) {
              await deleteApplicant({
                variables: { input: { id: applicant.id } },
              })
            }
          }),
        )
        const updatedApplicants = formApplicants.filter(
          (applicant) =>
            applicant.applicantTypeId !== undefined &&
            applicant.applicantTypeId !== null &&
            !typesArray.includes(applicant.applicantTypeId),
        )
        setFormApplicants(updatedApplicants)
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
        formApplicants={formApplicants}
        formApplicantFields={applicantFields}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.individualDelegation}
        label={formatMessage(m.individualOnBehalfPerson)}
        formApplicants={formApplicants}
        formApplicantFields={applicantFields}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.legalEntityDelegation}
        label={formatMessage(m.individualOnBehalfLegalEntity)}
        formApplicants={formApplicants}
        formApplicantFields={applicantFields}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.procuration}
        label={formatMessage(m.individualWithPowerOfAttorney)}
        formApplicants={formApplicants}
        formApplicantFields={applicantFields}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />
    </Stack>
  )
}
