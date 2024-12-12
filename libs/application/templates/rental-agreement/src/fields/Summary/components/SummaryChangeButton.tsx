import { Button } from '@island.is/island-ui/core'
import { changeButton } from '../summaryStyles.css'
import { summary } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

type Props = {
  editAction?: () => void
}

export const SummaryChangeButton = ({ editAction }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <div className={changeButton}>
      <Button variant="ghost" size="small" onClick={editAction}>
        {formatMessage(summary.changeSectionButtonLabel)}
      </Button>
    </div>
  )
}
