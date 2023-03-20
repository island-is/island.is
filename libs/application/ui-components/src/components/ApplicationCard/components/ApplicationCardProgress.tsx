import {
  Box,
  Button,
  DraftProgressMeter as DraftProgressMeterUI,
  ProgressMeter,
} from '@island.is/island-ui/core'
import { ApplicationCardProps } from '../ApplicationCard'
import * as styles from '../ApplicationCard.css'

interface Props {
  progressMeter: ApplicationCardProps['progressMeter']
  cta: ApplicationCardProps['cta']
  hasDate?: boolean
  renderDraftStatusBar?: boolean
}

const DraftProgressMeter = ({ progressMeter, cta, hasDate }: Props) => {
  if (!progressMeter) return null

  const { variant, draftFinishedSteps, draftTotalSteps } = progressMeter

  return (
    <Box
      width="full"
      paddingTop={[2, 2, 2, 3]}
      display="flex"
      flexGrow={1}
      flexShrink={0}
      alignItems={['stretch', 'stretch', hasDate ? 'flexEnd' : 'center']}
      flexDirection={['column', 'column', 'row']}
    >
      <Box flexGrow={1} className={styles.draftProgressMeter}>
        <DraftProgressMeterUI
          variant={variant}
          draftTotalSteps={draftTotalSteps ?? 1}
          draftFinishedSteps={draftFinishedSteps ?? 1}
        />
      </Box>
      <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
        <Button
          variant={cta.variant}
          onClick={cta.onClick}
          icon="arrowForward"
          size={cta.size}
        >
          {cta.label}
        </Button>
      </Box>
    </Box>
  )
}

const DefaultProgressMeter = ({ progressMeter, hasDate, cta }: Props) => {
  if (!progressMeter) return null
  const { variant, progress } = progressMeter

  return (
    <Box
      width="full"
      paddingTop={[1, 1, 1, hasDate ? 0 : 1]}
      display="flex"
      alignItems={['flexStart', 'flexStart', hasDate ? 'flexEnd' : 'center']}
      flexDirection={['column', 'column', 'row']}
    >
      <ProgressMeter
        variant={variant}
        progress={progress ?? 0}
        className={styles.progressMeter}
      />

      <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
        <Button
          variant={cta.variant}
          onClick={cta.onClick}
          icon="arrowForward"
          size={cta.size}
        >
          {cta.label}
        </Button>
      </Box>
    </Box>
  )
}

export const ApplicationCardProgress = ({
  renderDraftStatusBar,
  ...props
}: Props) => {
  return renderDraftStatusBar ? (
    <DraftProgressMeter {...props} />
  ) : (
    <DefaultProgressMeter {...props} />
  )
}
