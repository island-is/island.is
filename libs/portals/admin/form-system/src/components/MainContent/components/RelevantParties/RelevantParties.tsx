import { useContext, useEffect, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import {
  CREATE_APPLICANT,
  DELETE_APPLICANT,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { FormSystemFormApplicant } from '@island.is/api/schema'
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

  useEffect(() => {
    controlDispatch({
      type: 'UPDATE_APPLICANT_TYPES',
      payload: { newValue: formApplicants },
    })
  }, [formApplicants])

  const handleCheckboxChange = async (
    typesArray: string[],
    checked: boolean,
  ) => {
    try {
      if (checked) {
        const newApplicants = await Promise.all(
          typesArray.map(async (applicantTypeId) => {
            const newApplicant = await createApplicant({
              variables: {
                input: {
                  createFormApplicantTypeDto: {
                    formId,
                    applicantTypeId,
                  },
                },
              },
            })
            return removeTypename(newApplicant.data.createFormSystemApplicant)
          }),
        )
        setFormApplicants([...formApplicants, ...newApplicants])
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
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.individualDelegation}
        label={formatMessage(m.individualOnBehalfPerson)}
        formApplicants={formApplicants}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.legalEntityDelegation}
        label={formatMessage(m.individualOnBehalfLegalEntity)}
        formApplicants={formApplicants}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />

      <PartyType
        groupApplicantTypes={applicantTypeGroups.procuration}
        label={formatMessage(m.individualWithPowerOfAttorney)}
        formApplicants={formApplicants}
        handleCheckboxChange={handleCheckboxChange}
        setFormApplicantTypes={setFormApplicants}
      />
    </Stack>
  )
}
