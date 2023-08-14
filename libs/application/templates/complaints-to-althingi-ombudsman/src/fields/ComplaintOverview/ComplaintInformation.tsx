import { ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import {
  complainee as complaineeMessages,
  complaintOverview,
} from '../../lib/messages'
import { ComplaineeTypes } from '../../shared'
import { ValueLine } from './ValueLine'

type Props = {
  type: ComplaineeTypes
  name: string
  description: string
  isEditable?: boolean
  onEdit: (id: string) => void
}

export const ComplaintInformation: FC<React.PropsWithChildren<Props>> = ({
  type,
  name,
  description,
  isEditable,
  onEdit,
}) => {
  const complainee =
    type === ComplaineeTypes.GOVERNMENT
      ? complaineeMessages.labels.governmentComplaint
      : complaineeMessages.labels.otherComplaint
  return (
    <ReviewGroup
      isEditable={isEditable}
      editAction={() => onEdit('section.complaintInformation')}
    >
      <GridRow>
        <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
          <ValueLine
            label={complaintOverview.labels.complainee}
            value={complainee}
          />
        </GridColumn>
        <GridColumn span={['9/12', '9/12', '9/12', '4/12']}>
          <ValueLine
            label={complaintOverview.labels.complaineeName}
            value={name}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="9/12">
          <ValueLine
            label={complaintOverview.labels.complaintDescription}
            value={description}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
