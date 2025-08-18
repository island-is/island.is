import {
  Box,
  Button,
  DraftProgressMeter as DraftProgressMeterUI,
  ProgressMeter,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from '../ApplicationCard.css'
import { coreMessages } from '@island.is/application/core'
import { FormSystemApplication } from '@island.is/api/schema'
import { ApplicationStatus } from '@island.is/form-system/enums'
import { webMessages } from '../../../lib'

interface Props {
  application: FormSystemApplication
  onOpenApplication: () => void
  forceDefault?: boolean
  shouldShowCardButtons?: boolean
}

const DraftProgressMeter = ({
  application,
  onOpenApplication,
  shouldShowCardButtons = true,
}: Props) => {
  const { status } = application
  const { formatMessage } = useLocale()
  if (status !== ApplicationStatus.IN_PROGRESS) return null

  const draftFinishedSteps =
    application.sections?.filter((s) =>
      application.completed?.includes(s?.id ?? ''),
    ).length ?? 0
  const draftTotalSteps = (application.sections?.length ?? 1) - 1

  return (
    <Box
      width="full"
      paddingTop={[2, 2, 2, 3]}
      display="flex"
      flexGrow={1}
      flexShrink={0}
      alignItems={['stretch', 'stretch', 'flexEnd']}
      flexDirection={['column', 'column', 'row']}
    >
      <Box flexGrow={1} className={styles.draftProgressMeter}>
        <DraftProgressMeterUI
          variant="blue"
          draftTotalSteps={draftTotalSteps}
          draftFinishedSteps={draftFinishedSteps}
          progressMessage={formatMessage(coreMessages.draftProgressMeter, {
            draftFinishedSteps,
            draftTotalSteps,
          })}
        />
      </Box>
      {shouldShowCardButtons && (
        <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
          <Button variant="ghost" onClick={onOpenApplication} size="small">
            {formatMessage(webMessages.openApplication)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

const DefaultProgressMeter = ({
  application,
  onOpenApplication,
  shouldShowCardButtons = true,
}: Props) => {
  const { status } = application
  const { formatMessage } = useLocale()

  if (status === undefined) return null
  return (
    <Box
      width="full"
      paddingTop={[1, 1, 1, 0]}
      display="flex"
      alignItems={['flexStart', 'flexStart', 'flexEnd']}
      flexDirection={['column', 'column', 'row']}
    >
      <ProgressMeter
        variant="blue"
        progress={0}
        className={styles.progressMeter}
      />
      {shouldShowCardButtons && (
        <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
          <Button variant="ghost" onClick={onOpenApplication} size="small">
            {formatMessage(webMessages.openApplication)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export const ApplicationCardProgress = ({
  forceDefault = false,
  ...props
}: Props) => {
  return forceDefault ? (
    <DefaultProgressMeter {...props} />
  ) : (
    <DraftProgressMeter {...props} />
  )
}
