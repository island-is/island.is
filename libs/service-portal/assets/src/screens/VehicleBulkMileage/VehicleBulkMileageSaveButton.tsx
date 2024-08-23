import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/service-portal/core'
import { useMemo } from 'react'
import { type SubmissionState } from './types'

interface Props {
  submissionState: SubmissionState
  onClick: () => void
  disabled?: boolean
}

export const VehicleBulkMileageSaveButton = ({
  submissionState,
  onClick,
}: Props) => {
  const { formatMessage } = useLocale()

  const tag = useMemo(() => {
    switch (submissionState) {
      case 'success':
      case 'waiting-success': {
        return {
          text: formatMessage(coreMessages.saved),
          icon: 'checkmarkCircle' as const,
        }
      }
      case 'waiting-failure':
      case 'failure': {
        return {
          text: formatMessage(coreMessages.errorTitle),
          icon: 'closeCircle' as const,
        }
      }
      default:
        return {
          text: formatMessage(coreMessages.save),
          icon: 'pencil' as const,
        }
    }
  }, [formatMessage, submissionState])

  return (
    <Button
      icon={tag.icon}
      size="small"
      type="button"
      variant="text"
      onClick={onClick}
    >
      {tag.text}
    </Button>
  )
}
