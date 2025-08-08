import { Box, Checkbox } from '@island.is/island-ui/core'
import { RelevantParty } from './RelevantParty'
import { FormSystemFormApplicant } from '@island.is/api/schema'
import { Dispatch, SetStateAction, useContext } from 'react'
import { ControlContext } from 'libs/portals/admin/form-system/src/context/ControlContext'

interface Props {
  groupApplicantTypes: string[]
  label: string
  formApplicants: FormSystemFormApplicant[]
  handleCheckboxChange: (types: string[], checked: boolean) => void
  setFormApplicantTypes: Dispatch<SetStateAction<FormSystemFormApplicant[]>>
}

export const PartyType = ({
  groupApplicantTypes,
  label,
  formApplicants,
  handleCheckboxChange,
  setFormApplicantTypes,
}: Props) => {
  const { applicantTypes } = useContext(ControlContext)

  const getApplicantType = (type: string) => {
    return applicantTypes?.find((applicantType) => applicantType?.id === type)
  }

  return (
    <>
      <Box paddingTop={4}>
        <Checkbox
          label={label}
          checked={formApplicants.some(
            (a) =>
              typeof a.applicantTypeId === 'string' &&
              groupApplicantTypes.includes(a.applicantTypeId),
          )}
          onChange={(e) =>
            handleCheckboxChange(groupApplicantTypes, e.target.checked)
          }
        ></Checkbox>
      </Box>
      {formApplicants?.some(
        (a) =>
          typeof a.applicantTypeId === 'string' &&
          groupApplicantTypes.includes(a.applicantTypeId),
      ) && (
        <>
          {groupApplicantTypes.map((type) => {
            const applicantType = getApplicantType(type)
            const relevantApplicant = formApplicants.find(
              (a) => a.applicantTypeId === type,
            )
            if (!applicantType || !relevantApplicant) return null
            return (
              <RelevantParty
                key={type}
                applicantType={applicantType}
                relevantApplicant={relevantApplicant}
                setFormApplicantTypes={setFormApplicantTypes}
              />
            )
          })}
        </>
      )}
    </>
  )
}
