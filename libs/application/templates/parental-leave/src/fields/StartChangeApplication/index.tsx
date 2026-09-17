import { FC, useEffect, useRef } from 'react'
import { AlertMessage } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { ApplicationAction } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getSelectedChild } from '../../lib/parentalLeaveUtils'
import { useStartFollowUpApplication } from '../../hooks/useStartFollowUpApplication'

/**
 * The applicant picked a child they have already applied for. The application
 * currently open in prerequisites becomes the separate change application and
 * continues into the edit form; the approved application remains unchanged.
 */
const StartChangeApplication: FC<FieldBaseProps> = ({
  application,
  refetch,
}) => {
  const { formatMessage } = useLocale()
  const { start, error } = useStartFollowUpApplication(ApplicationAction.CHANGE)
  const hasStarted = useRef(false)

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const previousApplicationId = selectedChild?.existingApplicationId
  useEffect(() => {
    if (!previousApplicationId || hasStarted.current) {
      return
    }

    hasStarted.current = true

    start({
      previousApplicationId,
      applicationId: application.id,
      refetch,
    })
  }, [previousApplicationId, application.id, refetch, start])

  if (error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(
          parentalLeaveFormMessages.selectChild.startChangeErrorTitle,
        )}
        message={formatMessage(
          parentalLeaveFormMessages.selectChild.startChangeErrorMessage,
        )}
      />
    )
  }

  return null
}

export default StartChangeApplication
