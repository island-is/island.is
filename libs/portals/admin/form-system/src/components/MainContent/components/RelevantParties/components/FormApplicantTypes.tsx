import { FormSystemFormApplicant } from "@island.is/api/schema"
import { Dispatch, SetStateAction, useContext } from "react"
import {
  Box,
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from "react-intl"
import { m } from '@island.is/form-system/ui'
import { ControlContext } from "../../../../../context/ControlContext"
import { useMutation } from "@apollo/client"
import { UPDATE_APPLICANT } from "@island.is/form-system/graphql"

interface Props {
  formApplicantsTypes: FormSystemFormApplicant[]
  setFormApplicantTypes: Dispatch<SetStateAction<FormSystemFormApplicant[]>>
}

enum FormSystemApplicantTypeEnum {
  Individual = 'Individual',
  IndividualWithDelegationFromIndividual = 'IndividualWithDelegationFromIndividual',
  IndividualWithDelegationFromLegalEntity = 'IndividualWithDelegationFromLegalEntity',
  IndividualWithProcuration = 'IndividualWithProcuration',
  IndividualGivingDelegation = 'IndividualGivingDelegation',
  LegalEntity = 'LegalEntity',
}

const applicantTypeLabelMap: Record<FormSystemApplicantTypeEnum, string> = {
  [FormSystemApplicantTypeEnum.Individual]: 'Einstaklingur (innskráður)',
  [FormSystemApplicantTypeEnum.IndividualWithDelegationFromIndividual]: 'Einstaklingur í umboði annars einstaklings',
  [FormSystemApplicantTypeEnum.IndividualWithDelegationFromLegalEntity]: 'Einstaklingur í umboði lögaðila',
  [FormSystemApplicantTypeEnum.IndividualWithProcuration]: 'Einstaklingur með prókúru',
  [FormSystemApplicantTypeEnum.IndividualGivingDelegation]: 'Umboðsveitandi (einstaklingur)',
  [FormSystemApplicantTypeEnum.LegalEntity]: 'Lögaðili',
}

const getApplicantTypeLabel = (type?: FormSystemApplicantTypeEnum) => {
  if (!type) return ''
  return applicantTypeLabelMap[type]
}

export const FormApplicantTypes = ({ formApplicantsTypes, setFormApplicantTypes }: Props) => {
  const { formatMessage } = useIntl()
  const { focus, setFocus } = useContext(ControlContext)
  const [updateApplicant] = useMutation(UPDATE_APPLICANT)

  const onBlurHandler = (currentString: string, applicant: FormSystemFormApplicant) => {
    if (currentString !== focus) {
      updateApplicant({
        variables: {
          input: {
            id: applicant.id,
            updateFormApplicantDto: {
              name: applicant.name
            }
          }
        }
      })
      setFocus('')
    }
  }

  return (
    <Stack space={5}>
      {formApplicantsTypes.map((applicantType, index) => {
        return (
          <Box key={index}>
            <Row>
              <Column>
                <Box marginBottom={1}>
                  <Text variant="h4">{getApplicantTypeLabel(applicantType?.applicantType ?? undefined)}</Text>
                </Box>
              </Column>
            </Row>
            <Row>
              <Column span="5/10">
                <Input
                  label={formatMessage(m.name)}
                  name="name"
                  value={applicantType?.name?.is ?? ''}
                  backgroundColor="blue"
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => onBlurHandler(e.target.value, applicantType)}
                  onChange={(e) => {
                    const updatedFormApplicantTypes = [...formApplicantsTypes]
                    updatedFormApplicantTypes[index] = {
                      ...updatedFormApplicantTypes[index],
                      name: {
                        ...updatedFormApplicantTypes[index].name,
                        is: e.target.value,
                      },
                    }
                    setFormApplicantTypes(updatedFormApplicantTypes)
                  }}
                />
              </Column>
              <Column span="5/10">
                <Input
                  label={formatMessage(m.nameEnglish)}
                  name="nameEn"
                  value={applicantType?.name?.en ?? ''}
                  backgroundColor="blue"
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => onBlurHandler(e.target.value, applicantType)}
                  onChange={(e) => {
                    const updatedFormApplicantTypes = [...formApplicantsTypes]
                    updatedFormApplicantTypes[index] = {
                      ...updatedFormApplicantTypes[index],
                      name: {
                        ...updatedFormApplicantTypes[index].name,
                        en: e.target.value,
                      },
                    }
                    setFormApplicantTypes(updatedFormApplicantTypes)
                  }}
                />
              </Column>
            </Row>
          </Box>
        )
      })}
    </Stack>
  )
}
