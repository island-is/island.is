import { useOpenApplication } from '@island.is/application/core'
import {
  Box,
  Button,
  DraftProgressMeter as DraftProgressMeterUI,
  ProgressMeter,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFeatureFlag } from '@island.is/react/feature-flags'
import * as styles from '../ApplicationCard.css'
import { ApplicationCardFields, DefaultCardData } from '../types'

interface Props {
  application: ApplicationCardFields
  defaultData: DefaultCardData
}

const DraftProgressMeter = ({ application, defaultData }: Props) => {
  const { progress, actionCard } = application
  const { formatMessage } = useLocale()
  const openApplication = useOpenApplication(application)

  if (progress === undefined) return null

  const draftFinishedSteps = actionCard?.draftFinishedSteps ?? 1
  const draftTotalSteps = actionCard?.draftTotalSteps ?? 1

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
          variant={defaultData.progress.variant}
          draftTotalSteps={draftTotalSteps}
          draftFinishedSteps={draftFinishedSteps}
        />
      </Box>
      <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
        <Button
          variant="ghost"
          onClick={openApplication}
          icon="arrowForward"
          size="small"
        >
          {formatMessage(defaultData.cta.label)}
        </Button>
      </Box>
    </Box>
  )
}

const DefaultProgressMeter = ({ application, defaultData }: Props) => {
  const { progress } = application
  const { formatMessage } = useLocale()
  const openApplication = useOpenApplication(application)

  if (progress === undefined) return null

  return (
    <Box
      width="full"
      paddingTop={[1, 1, 1, 0]}
      display="flex"
      alignItems={['flexStart', 'flexStart', 'flexEnd']}
      flexDirection={['column', 'column', 'row']}
    >
      <ProgressMeter
        variant={defaultData.progress.variant}
        progress={progress ?? 0}
        className={styles.progressMeter}
      />

      <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
        <Button
          variant="ghost"
          onClick={openApplication}
          icon="arrowForward"
          size="small"
        >
          {formatMessage(defaultData.cta.label)}
        </Button>
      </Box>
    </Box>
  )
}

export const ApplicationCardProgress = (props: Props) => {
  const { value: isDraftProgressBarEnabledForApplication } = useFeatureFlag(
    'isDraftProgressBarEnabledForApplication',
    false,
  )

  return isDraftProgressBarEnabledForApplication ? (
    <DraftProgressMeter {...props} />
  ) : (
    <DefaultProgressMeter {...props} />
  )
}
