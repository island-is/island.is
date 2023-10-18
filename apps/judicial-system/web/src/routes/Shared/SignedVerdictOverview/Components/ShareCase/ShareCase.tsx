import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { SingleValue } from 'react-select'

import { Box, Button, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  selectedSharingInstitutionId: SingleValue<ReactSelectOption>
  setSelectedSharingInstitutionId: React.Dispatch<
    React.SetStateAction<SingleValue<ReactSelectOption>>
  >
  shareCaseWithAnotherInstitution: (
    institution?: SingleValue<ReactSelectOption>,
  ) => void
}

const ShareCase: React.FC<React.PropsWithChildren<Props>> = ({
  selectedSharingInstitutionId,
  setSelectedSharingInstitutionId,
  shareCaseWithAnotherInstitution,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const { user } = useContext(UserContext)
  const { prosecutorsOffices } = useInstitution(!user?.id)

  return (
    <Box marginBottom={9}>
      <Box marginBottom={3}>
        <Text variant="h3">
          {formatMessage(m.sections.shareCase.title)}{' '}
          <Tooltip text={formatMessage(m.sections.shareCase.info)} />
        </Text>
      </Box>
      <BlueBox>
        <Box display="flex">
          <Box flexGrow={1} marginRight={2}>
            <Select
              name="sharedWithProsecutorsOfficeId"
              label={formatMessage(m.sections.shareCase.label)}
              placeholder={formatMessage(m.sections.shareCase.placeholder)}
              size="sm"
              icon={
                workingCase.sharedWithProsecutorsOffice
                  ? 'checkmark'
                  : undefined
              }
              options={prosecutorsOffices
                .map((prosecutorsOffice) => ({
                  label: prosecutorsOffice.name,
                  value: prosecutorsOffice.id,
                }))
                .filter((t) => t.value !== user?.institution?.id)}
              value={
                workingCase.sharedWithProsecutorsOffice
                  ? {
                      label: workingCase.sharedWithProsecutorsOffice.name,
                      value: workingCase.sharedWithProsecutorsOffice.id,
                    }
                  : selectedSharingInstitutionId
                  ? {
                      label: (selectedSharingInstitutionId as ReactSelectOption)
                        .label,
                      value: (selectedSharingInstitutionId as ReactSelectOption)
                        .value as string,
                    }
                  : null
              }
              onChange={(so) => setSelectedSharingInstitutionId(so)}
              isDisabled={Boolean(workingCase.sharedWithProsecutorsOffice)}
            />
          </Box>
          <Button
            size="small"
            disabled={
              !selectedSharingInstitutionId &&
              !workingCase.sharedWithProsecutorsOffice
            }
            onClick={() =>
              shareCaseWithAnotherInstitution(selectedSharingInstitutionId)
            }
          >
            {workingCase.sharedWithProsecutorsOffice
              ? formatMessage(m.sections.shareCase.close)
              : formatMessage(m.sections.shareCase.open)}
          </Button>
        </Box>
      </BlueBox>
    </Box>
  )
}

export default ShareCase
