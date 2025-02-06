import { Box, Button, Inline, Select, Text } from '@island.is/island-ui/core'
import { ApplicationStatus } from './types'
import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'

interface Props {
  onApplicationStatusButtonChange: (status: ApplicationStatus) => void
  onTrStatusButtonChange: (status: SocialInsuranceIncomePlanStatus) => void
  onIsEligibleForChangeToggle: () => void
  currentEligibleForChangeStatus: string
}

export const DebugSelectors = ({
  onApplicationStatusButtonChange,
  onTrStatusButtonChange,
  onIsEligibleForChangeToggle,
  currentEligibleForChangeStatus,
}: Props) => {
  return (
    <Inline space={2}>
      <Select
        size="sm"
        label="Umsóknarkerfisstaða"
        onChange={(option) => {
          if (option?.value) {
            onApplicationStatusButtonChange(option.value)
          }
        }}
        options={[
          {
            label: 'Draft',
            value: 'draft' as ApplicationStatus,
          },
          {
            label: 'TryggingastofnunSubmitted',
            value: 'tryggingastofnunSubmitted' as ApplicationStatus,
          },
          {
            label: 'TryggingastofnunInReview',
            value: 'tryggingastofnunInReview' as ApplicationStatus,
          },
          {
            label: 'Completed',
            value: 'completed' as ApplicationStatus,
          },
        ]}
      />
      <Select
        size="sm"
        label="TR-staða"
        onChange={(option) => {
          if (option?.value) {
            onTrStatusButtonChange(option.value)
          }
        }}
        options={[
          {
            label: 'Accepted',
            value: SocialInsuranceIncomePlanStatus.ACCEPTED,
          },
          {
            label: 'Cancelled',
            value: SocialInsuranceIncomePlanStatus.CANCELLED,
          },
          {
            label: 'In progress',
            value: SocialInsuranceIncomePlanStatus.IN_PROGRESS,
          },
          {
            label: 'Unknown',
            value: SocialInsuranceIncomePlanStatus.UNKNOWN,
          },
        ]}
      />
      <Button size="small" onClick={() => onIsEligibleForChangeToggle()}>
        Má breyta umsókn?
      </Button>
      <Text textAlign="center">Staða: {currentEligibleForChangeStatus}</Text>
    </Inline>
  )
}
