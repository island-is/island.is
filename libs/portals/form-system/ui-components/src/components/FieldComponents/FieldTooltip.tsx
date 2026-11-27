import { Box, Icon, Tooltip } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '../../lib/messages'
import * as styles from './FieldTooltip.css'

interface Props {
  text?: string | null
}

export const FieldTooltip = ({ text }: Props) => {
  const { formatMessage } = useIntl()
  const tooltipText = text?.trim()
  if (!tooltipText) return null

  return (
    <Box marginLeft={2} className={styles.tooltipContainer}>
      <Tooltip text={tooltipText} renderInPortal={false}>
        <button
          type="button"
          className={styles.tooltipButton}
          aria-label={formatMessage(m.tooltip)}
          onClick={(event) => event.stopPropagation()}
        >
          <Icon icon="informationCircle" color="dark200" size="small" />
        </button>
      </Tooltip>
    </Box>
  )
}
