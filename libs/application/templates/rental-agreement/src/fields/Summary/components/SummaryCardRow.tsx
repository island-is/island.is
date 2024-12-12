import { ReactNode } from 'react'
import { useLocale } from '@island.is/localization'
import { Button, GridRow } from '@island.is/island-ui/core'
import { Divider } from '../Divider'
import { gridRow, changeButton } from '../summaryStyles.css'
import { summary } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

interface SummaryCardProps {
  children: ReactNode
  editAction?: (id: string) => void
  route: Routes
  isChangeButton?: boolean
  isLast?: boolean
}

export const SummaryCardRow = ({
  children,
  isChangeButton = true,
  editAction,
  route,
  isLast,
}: SummaryCardProps) => {
  const { formatMessage } = useLocale()

  console.log('editAction', editAction)
  console.log('route', route)

  return (
    <>
      <GridRow className={gridRow}>
        {children}
        {isChangeButton && (
          <div className={changeButton}>
            <Button
              variant="ghost"
              size="small"
              onClick={() => editAction?.(route)}
            >
              {formatMessage(summary.changeSectionButtonLabel)}
            </Button>
          </div>
        )}
      </GridRow>
      {!isLast && <Divider />}
    </>
  )
}
