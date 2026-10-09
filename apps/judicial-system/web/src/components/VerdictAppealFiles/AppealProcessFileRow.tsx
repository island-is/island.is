import type { FC, ReactNode } from 'react'

import type { IconMapIcon } from '@island.is/island-ui/core'
import { Box } from '@island.is/island-ui/core'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import ContextMenu from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'
import PdfButton from '@island.is/judicial-system-web/src/components/PdfButton/PdfButton'

import * as styles from './AppealProcessFileRow.css'

interface Props {
  title: string
  titleIcon?: IconMapIcon
  titleIconTooltip?: string
  onOpen?: () => void
  disabled?: boolean
  meta?: ReactNode
  action?: ReactNode
  menuItems: ContextMenuItem[]
  menuAriaLabel: string
}

/**
 * One appeal-process document row: the PdfButton title, optional meta on the
 * right, an optional primary action (e.g. Staðfesta), and the ellipsis menu.
 */
const AppealProcessFileRow: FC<Props> = ({
  title,
  titleIcon,
  titleIconTooltip,
  onOpen,
  disabled,
  meta,
  action,
  menuItems,
  menuAriaLabel,
}) => (
  <PdfButton
    renderAs="row"
    title={title}
    titleIcon={titleIcon}
    titleIconTooltip={titleIconTooltip}
    disabled={disabled}
    handleClick={onOpen}
    className={styles.flushPdfRow}
  >
    <Box display="flex" alignItems="center" justifyContent="flexEnd">
      {meta && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flexEnd"
          textAlign="right"
        >
          {meta}
        </Box>
      )}
      {action && <Box marginLeft={3}>{action}</Box>}
      {menuItems.length > 0 && (
        <Box marginLeft={3}>
          <ContextMenu
            items={menuItems}
            render={
              <IconButton
                icon="ellipsisVertical"
                colorScheme="transparent"
                ariaLabel={menuAriaLabel}
                disabled={disabled}
                onClick={(evt) => {
                  evt.stopPropagation()
                }}
              />
            }
          />
        </Box>
      )}
    </Box>
  </PdfButton>
)

export default AppealProcessFileRow
