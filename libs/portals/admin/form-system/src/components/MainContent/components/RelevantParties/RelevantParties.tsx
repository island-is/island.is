import { useContext, useState } from "react"
import { ControlContext } from "../../../../context/ControlContext"
import { Stack, Checkbox, Box, Text } from "@island.is/island-ui/core"
import { m } from "@island.is/form-system/ui"
import { useIntl } from "react-intl"
import { CREATE_APPLICANT, DELETE_APPLICANT } from "@island.is/form-system/graphql"
import { useMutation } from "@apollo/client"
import { FormSystemFormApplicant, FormSystemApplicantTypeEnum } from "@island.is/api/schema"
import { removeTypename } from "../../../../lib/utils/removeTypename"
import { FormApplicantTypes } from "./components/FormApplicantTypes"

const applicantTypeCheckboxsLabel = [
  "Einstaklingur (innskráður)",
  "Einstaklingur í umboði annars einstaklings",
  "Einstaklingur í umboði lögaðila",
  "Einstaklingur með prókúru",
]

const applicantTypeGroups = {
  individual: [FormSystemApplicantTypeEnum.Individual],
  individualDelegation: [
    FormSystemApplicantTypeEnum.IndividualWithDelegationFromIndividual,
    FormSystemApplicantTypeEnum.IndividualGivingDelegation,
  ],
  legalEntityDelegation: [
    FormSystemApplicantTypeEnum.IndividualWithDelegationFromLegalEntity,
    FormSystemApplicantTypeEnum.LegalEntity,
  ],
  procuration: [
    FormSystemApplicantTypeEnum.IndividualWithProcuration,
    FormSystemApplicantTypeEnum.LegalEntity,
  ],
}

export const RelevantParties = () => {
  const { control } = useContext(ControlContext)
  const { formatMessage } = useIntl()
  const [createApplicant] = useMutation(CREATE_APPLICANT)
  const [deleteApplicant] = useMutation(DELETE_APPLICANT)
  const { applicants, id: formId } = control.form
  const [formApplicants, setFormApplicants] = useState<FormSystemFormApplicant[]>(
    applicants?.filter((applicant): applicant is FormSystemFormApplicant => applicant !== null) ?? []
  )

  const handleApplicantChange = async (typesArray: FormSystemApplicantTypeEnum[], checked: boolean) => {
    if (checked) {
      try {
        const newApplicants = await Promise.all(
          typesArray.map(async (applicantType) => {
            const newApplicant = await createApplicant({
              variables: {
                input: {
                  createFormApplicantDto: {
                    formId,
                    applicantType,
                  },
                },
              },
            })
            return removeTypename(newApplicant.data.formSystemCreateApplicant)
          })
        )
        setFormApplicants([...formApplicants, ...newApplicants])
      } catch (e) {
        console.error(e)
      }
    } else {
      try {
        await Promise.all(
          typesArray.map(async (applicantType) => {
            const applicant = formApplicants.find(
              (a) => a.applicantType === applicantType
            )
            if (applicant) {
              await deleteApplicant({
                variables: { input: { id: applicant.id } },
              })
            }
          })
        )
        setFormApplicants(
          formApplicants.filter(
            (applicant) =>
              applicant.applicantType !== undefined && applicant.applicantType !== null && !typesArray.includes(applicant.applicantType)
          )
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
      case 2: {
        if (checked) {
          if (formApplicants.some(applicant => applicant.applicantType === FormSystemApplicantTypeEnum.LegalEntity)) {
            handleApplicantChange([FormSystemApplicantTypeEnum.IndividualWithDelegationFromLegalEntity], checked)
          } else {
            handleApplicantChange(applicantTypeGroups.legalEntityDelegation, checked)
          }
        } else {
          if (!formApplicants.some(applicant => applicant.applicantType === FormSystemApplicantTypeEnum.IndividualWithProcuration)) {
            handleApplicantChange(applicantTypeGroups.legalEntityDelegation, checked)
          } else {
            handleApplicantChange([FormSystemApplicantTypeEnum.IndividualWithDelegationFromLegalEntity], checked)
          }
        }
      }
        break
      case 3: {
        if (checked) {
          if (formApplicants.some(applicant => applicant.applicantType === FormSystemApplicantTypeEnum.LegalEntity)) {
            handleApplicantChange([FormSystemApplicantTypeEnum.IndividualWithProcuration], checked)
          } else {
            handleApplicantChange(applicantTypeGroups.procuration, checked)
          }
        } else {
          if (!formApplicants.some(applicant => applicant.applicantType === FormSystemApplicantTypeEnum.IndividualWithDelegationFromLegalEntity)) {
            handleApplicantChange(applicantTypeGroups.procuration, checked)
          } else {
            handleApplicantChange([FormSystemApplicantTypeEnum.IndividualWithProcuration], checked)
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
          {applicantTypeCheckboxsLabel.map((label, index) => (
            <Checkbox
              key={index}
              label={label}
              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
            />
          ))}
        </Stack>
      </Box>
      <FormApplicantTypes
        formApplicantsTypes={formApplicants}
        setFormApplicantTypes={setFormApplicants}
      />
    </Stack>
  )
}
