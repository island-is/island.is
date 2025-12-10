import { Box, Checkbox } from '@island.is/island-ui/core'
import { RelevantParty } from './RelevantParty'
import { FormSystemField } from '@island.is/api/schema'
import { useContext } from 'react'
import { ControlContext } from 'libs/portals/admin/form-system/src/context/ControlContext'
import { getFieldBySettings } from '../../../../../lib/utils/getField'

interface Props {
  groupApplicantTypes: string[]
  label: string
  formApplicantFields: FormSystemField[]
  handleCheckboxChange: (types: string[], checked: boolean) => void
}

export const PartyType = ({
  groupApplicantTypes,
  label,
  formApplicantFields,
  handleCheckboxChange,
}: Props) => {
  const { applicantTypes } = useContext(ControlContext)

  const getApplicantType = (type: string) => {
    return applicantTypes?.find((applicantType) => applicantType?.id === type)
  }

  const isGroupChecked = groupApplicantTypes.some((type) =>
    Boolean(getFieldBySettings('applicantType', type, formApplicantFields)),
  )

  return (
    <>
      <Box paddingTop={4}>
        <Checkbox
          label={label}
          checked={isGroupChecked}
          onChange={async (e) =>
            await handleCheckboxChange(groupApplicantTypes, e.target.checked)
          }
        ></Checkbox>
      </Box>
      {isGroupChecked && (
        <>
          {groupApplicantTypes.map((type) => {
            const applicantType = getApplicantType(type)
            const relevantApplicant = getFieldBySettings(
              'applicantType',
              type,
              formApplicantFields,
            )
            if (!applicantType || !relevantApplicant) return null
            return (
              <RelevantParty
                key={type}
                applicantType={applicantType}
                relevantApplicant={relevantApplicant}
              />
            )
          })}
        </>
      )}
    </>
  )
}
