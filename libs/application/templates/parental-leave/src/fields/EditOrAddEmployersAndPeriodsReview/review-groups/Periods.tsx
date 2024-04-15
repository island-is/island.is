import { Application } from '@island.is/application/types'
import { ReviewGroup } from '@island.is/application/ui-components'
import React, { FC } from 'react'
import { SummaryTimeline } from '../../components/SummaryTimeline/SummaryTimeline'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Periods: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  return (
    <ReviewGroup
      isEditable
      editAction={() => goToScreen?.('addPeriods')}
      isLast
    >
      <SummaryTimeline application={application} />
    </ReviewGroup>
  )
}

export default Periods
