import * as s from './ButtonBar.css'
import { Box, Button } from '@island.is/island-ui/core'
import { buttonsMsgs as msg } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useDraftingState } from '../state/useDraftingState'

export const ButtonBar = () => {
  const { step, actions } = useDraftingState()
  const t = useLocale().formatMessage

  return (
    <Box className={s.wrapper} marginTop={[4, 4, 6]} paddingTop={3}>
      {actions.goForward && (
        <Box className={s.forward}>
          <Button
            onClick={actions.goForward}
            icon="arrowForward"
            iconType="outline"
          >
            {t(step.next === 'review' ? msg.prepShipping : msg.continue)}
          </Button>
        </Box>
      )}

      {step.name === 'review' && actions.propose && (
        <Box className={s.propose}>
          <Button
            onClick={actions.propose}
            preTextIcon="share"
            preTextIconType="outline"
          >
            {t(msg.propose)}
          </Button>
        </Box>
      )}

      {actions.goBack && (
        <Box className={s.back}>
          <Button
            onClick={actions.goBack}
            preTextIcon="arrowBack"
            preTextIconType="outline"
            variant="text"
            size="medium"
            colorScheme="light"
          >
            {t(msg.goBack)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
