import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import cn from 'classnames'
import * as styles from './MessageActions.css'

interface Props {
  onClick: () => void
}

export const ConversationBackButton = ({ onClick }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      className={cn(styles.filterActionButtons, styles.circleActionButtons)}
    >
      <Button
        circle
        icon="arrowBack"
        iconType="filled"
        colorScheme="light"
        aria-label={formatMessage(m.goBack)}
        onClick={onClick}
      />
    </Box>
  )
}

export default ConversationBackButton
