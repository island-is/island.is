import { ReactNode } from 'react'
import { useLocale } from '@island.is/localization'
import { Button, GridRow } from '@island.is/island-ui/core'
import { Routes } from '../../../utils/enums'
import { Divider } from './Divider'
import {
  gridRow,
  changeButton,
  gridRowChangeButton,
} from '../summaryStyles.css'
import { summary } from '../../../lib/messages'

interface SummaryCardProps {
  children: ReactNode
  editAction?: (id: string) => void
  route?: Routes
  hasChangeButton: boolean
  isLast?: boolean
}

export const SummaryCardRow = ({
  children,
  hasChangeButton = true,
  editAction,
  route,
  isLast = false,
}: SummaryCardProps) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow
        className={`${gridRow} ${hasChangeButton ? gridRowChangeButton : ''}`}
      >
        {children}
        {hasChangeButton && editAction && route && (
          <div className={changeButton}>
            <Button
              variant="ghost"
              size="small"
              icon="pencil"
              onClick={() => editAction?.(route)}
            >
              {formatMessage(summary.changeSectionButtonLabel)}
            </Button>
          </div>
        )}
      </GridRow>
      <Divider strong={isLast} />
    </>
  )
}
