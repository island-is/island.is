import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import {
  CREATE_APPLICANT,
  DELETE_APPLICANT,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { FormSystemFormApplicantType } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { removeTypename } from '../../../../lib/utils/removeTypename'
import { FormApplicantTypes } from './components/FormApplicantTypes'
import { ApplicantTypesEnum } from '@island.is/form-system-dataTypes'

const applicantTypeGroups = {
  individual: [ApplicantTypesEnum.INDIVIDUAL],
  individualDelegation: [
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
  ],
  legalEntityDelegation: [
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    ApplicantTypesEnum.LEGAL_ENTITY,
  ],
  procuration: [
    ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    ApplicantTypesEnum.LEGAL_ENTITY,
  ],
}

export const RelevantParties = () => {
  const [createApplicant] = useMutation(CREATE_APPLICANT)
  const [deleteApplicant] = useMutation(DELETE_APPLICANT)
  const { control, applicantTypes } = useContext(ControlContext)
  const { formatMessage } = useIntl()
  const { applicantTypes: applicants, id: formId } = control.form
  const [formApplicants, setFormApplicants] = useState<
    FormSystemFormApplicantType[]
  >(
    applicants?.filter(
      (applicant): applicant is FormSystemFormApplicantType =>
        applicant !== null,
    ) ?? [],
  )

  const handleApplicantChange = async (
    typesArray: string[],
    checked: boolean,
  ) => {
    if (checked) {
      try {
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
            return removeTypename(newApplicant.data.formSystemCreateApplicant)
          }),
        )
        setFormApplicants([...formApplicants, ...newApplicants])
      } catch (e) {
        console.error('Apollo error:', e.message)
        if (e.networkError) {
          console.error('Network error:', e.networkError)
        }
        if (e.graphQLErrors) {
          console.error('GraphQL error:', e.graphQLErrors)
        }
      }
    } else {
      try {
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
      } catch (e) {
        console.error(e)
      }
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
        {
          if (checked) {
            if (
              formApplicants.some(
                (applicant) => applicant.id === ApplicantTypesEnum.LEGAL_ENTITY,
              )
            ) {
              handleApplicantChange(
                [
                  ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
                ],
                checked,
              )
            } else {
              handleApplicantChange(
                applicantTypeGroups.legalEntityDelegation,
                checked,
              )
            }
          } else {
            if (
              !formApplicants.some(
                (applicant) =>
                  applicant.id ===
                  ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
              )
            ) {
              handleApplicantChange(
                applicantTypeGroups.legalEntityDelegation,
                checked,
              )
            } else {
              handleApplicantChange(
                [
                  ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
                ],
                checked,
              )
            }
          }
        }
        break
      case 3:
        {
          if (checked) {
            if (
              formApplicants.some(
                (applicant) => applicant.id === ApplicantTypesEnum.LEGAL_ENTITY,
              )
            ) {
              handleApplicantChange(
                [ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION],
                checked,
              )
            } else {
              handleApplicantChange(applicantTypeGroups.procuration, checked)
            }
          } else {
            if (
              !formApplicants.some(
                (applicant) =>
                  applicant.id ===
                  ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
              )
            ) {
              handleApplicantChange(applicantTypeGroups.procuration, checked)
            } else {
              handleApplicantChange(
                [ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION],
                checked,
              )
            }
          }
        }
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
                // label={applicant?.description?.is}
                label="bara eitthvað"
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
