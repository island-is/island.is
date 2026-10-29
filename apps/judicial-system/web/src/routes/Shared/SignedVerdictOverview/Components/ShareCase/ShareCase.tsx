import type { Dispatch, FC, SetStateAction } from 'react'
import { useContext } from 'react'
import type { SingleValue } from 'react-select'

import { Box, Button, Select } from '@island.is/island-ui/core'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContext,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import type { Institution } from '@island.is/judicial-system-web/src/graphql/schema'
import type { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

interface InstitutionSelectOption extends ReactSelectOption {
  institution: Institution
}

export type InstitutionOption = SingleValue<InstitutionSelectOption>

interface Props {
  selectedSharingInstitutionOption: InstitutionOption
  setSelectedSharingInstitutionOption: Dispatch<
    SetStateAction<InstitutionOption>
  >
  shareCaseWithAnotherInstitution: (institution?: Institution) => void
}

const ShareCase: FC<Props> = ({
  selectedSharingInstitutionOption,
  setSelectedSharingInstitutionOption,
  shareCaseWithAnotherInstitution,
}) => {
  const { workingCase } = useContext(FormContext)

  const { user } = useContext(UserContext)
  const { prosecutorsOffices } = useInstitution(!user?.id)

  return (
    <Box component="section">
      <SectionHeading
        title={m.sections.shareCase.title}
        tooltip={m.sections.shareCase.info}
      />
      <BlueBox>
        <Box display="flex">
          <Box flexGrow={1} marginRight={2}>
            <Select
              name="sharedWithProsecutorsOfficeId"
              label={m.sections.shareCase.label}
              placeholder={m.sections.shareCase.placeholder}
              size="sm"
              icon={
                workingCase.sharedWithProsecutorsOffice
                  ? 'checkmark'
                  : undefined
              }
              options={prosecutorsOffices
                .map((prosecutorsOffice) => ({
                  label: prosecutorsOffice.name ?? '',
                  value: prosecutorsOffice.id,
                  institution: prosecutorsOffice,
                }))
                .filter((t) => t.value !== user?.institution?.id)}
              value={
                workingCase.sharedWithProsecutorsOffice
                  ? {
                      label: workingCase.sharedWithProsecutorsOffice.name ?? '',
                      value: workingCase.sharedWithProsecutorsOffice.id,
                    }
                  : selectedSharingInstitutionOption
                  ? {
                      label: (
                        selectedSharingInstitutionOption as InstitutionSelectOption
                      ).label,
                      value: (
                        selectedSharingInstitutionOption as InstitutionSelectOption
                      ).value as string,
                    }
                  : null
              }
              onChange={(so) =>
                setSelectedSharingInstitutionOption(so as InstitutionOption)
              }
              isDisabled={Boolean(workingCase.sharedWithProsecutorsOffice)}
            />
          </Box>
          <Button
            size="small"
            disabled={
              !selectedSharingInstitutionOption &&
              !workingCase.sharedWithProsecutorsOffice
            }
            onClick={() =>
              shareCaseWithAnotherInstitution(
                selectedSharingInstitutionOption?.institution,
              )
            }
          >
            {workingCase.sharedWithProsecutorsOffice
              ? m.sections.shareCase.close
              : m.sections.shareCase.open}
          </Button>
        </Box>
      </BlueBox>
    </Box>
  )
}

export default ShareCase
