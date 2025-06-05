import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import {
  CREATE_APPLICANT,
  DELETE_APPLICANT,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { FormSystemFormApplicant } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { ApplicantTypesEnum } from '@island.is/form-system/enums'
import { removeTypename } from '../../../../lib/utils/removeTypename'
import { FormApplicantTypes } from './components/FormApplicantTypes'
import { applicantTypeGroups } from '../../../../lib/utils/applicantTypeGroups'

export const RelevantParties = () => {
  const [createApplicant] = useMutation(CREATE_APPLICANT)
  const [deleteApplicant] = useMutation(DELETE_APPLICANT)
  const { control, applicantTypes } = useContext(ControlContext)
  const { formatMessage } = useIntl()
  const { applicantTypes: applicants, id: formId } = control.form
  const [formApplicants, setFormApplicants] = useState<
    FormSystemFormApplicant[]
  >(
    applicants?.filter(
      (applicant): applicant is FormSystemFormApplicant => applicant !== null,
    ) ?? [],
  )

  const handleApplicantChange = async (
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
        setFormApplicants(
          formApplicants.filter(
            (applicant) =>
              applicant.applicantTypeId !== undefined &&
              applicant.applicantTypeId !== null &&
              !typesArray.includes(applicant.applicantTypeId),
          ),
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCheckboxChange = (index: number, checked: boolean) => {
    switch (index) {
      case 0:
        handleApplicantChange(applicantTypeGroups.individual, checked)
        break
      case 1:
        handleApplicantChange(applicantTypeGroups.individualDelegation, checked)
        break
      case 2:
        handleApplicantChange(
          applicantTypeGroups.legalEntityDelegation,
          checked,
        )
        break
      case 3:
        handleApplicantChange(applicantTypeGroups.procuration, checked)
        break
      default:
        break
    }
  }

  return (
    <Stack space={2}>
      <Box marginBottom={2}>
        <Text variant="h4">{formatMessage(m.selectIndividuals)}</Text>
      </Box>
      <Box padding={2}>
        <Stack space={2}>
          {applicantTypes?.map((applicant, index) => {
            if (index > 3) return null
            return (
              <Checkbox
                key={index}
                label={applicant?.description?.is}
                checked={formApplicants.some(
                  (a) => a.applicantTypeId === applicant?.id,
                )}
                onChange={(e) => handleCheckboxChange(index, e.target.checked)}
              />
            )
          })}
        </Stack>
      </Box>
      <FormApplicantTypes
        formApplicantsTypes={formApplicants}
        setFormApplicantTypes={setFormApplicants}
      />
    </Stack>
  )
}
