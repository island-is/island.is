import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'
import ConversationBackButton from './ConversationBackButton'
import * as styles from '../HealthConversations.css'

interface Props {
  onClick: () => void
}

/**
 * Renders the back arrow above everything else on mobile (hidden at `sm`
 * and up, where the arrow instead renders inside the message card).
 */
export const ConversationMobileBackHeader = ({ onClick }: Props) => (
  <Hidden above="xs">
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12">
          <Box className={styles.backButton} marginBottom={4}>
            <ConversationBackButton onClick={onClick} />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  </Hidden>
)

export default ConversationMobileBackHeader
