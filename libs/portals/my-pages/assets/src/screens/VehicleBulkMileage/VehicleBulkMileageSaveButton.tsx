import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/my-pages/core'
import { useMemo } from 'react'
import { type SubmissionStatus } from './types'

interface Props {
  onClick: () => void
  disabled?: boolean
  submissionStatus: SubmissionStatus
}

export const VehicleBulkMileageSaveButton = ({
  submissionStatus,
  onClick,
  disabled,
}: Props) => {
  const { formatMessage } = useLocale()

  const tag = useMemo(() => {
    switch (submissionStatus) {
      case 'success': {
        return {
          text: formatMessage(coreMessages.saved),
          icon: 'checkmarkCircle' as const,
        }
      }
      case 'error': {
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
  }, [formatMessage, submissionStatus])

  return (
    <Button
      icon={tag.icon}
      size="small"
      type="button"
      loading={submissionStatus === 'loading'}
      variant="text"
      onClick={onClick}
      disabled={disabled || submissionStatus === 'success'}
    >
      {tag.text}
    </Button>
  )
}
