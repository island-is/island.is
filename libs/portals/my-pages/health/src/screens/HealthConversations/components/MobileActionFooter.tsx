import { Box } from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import * as styles from './MobileActionFooter.css'

interface Props {
  children: ReactNode
}

/**
 * Pins its children to the bottom of the viewport below the `sm` breakpoint,
 * rendering as a plain block above it. Used for the conversation
 * reply/compose actions on the Health Conversations mobile screens.
 */
export const MobileActionFooter = ({ children }: Props) => {
  return <Box className={styles.footer}>{children}</Box>
}

export default MobileActionFooter
