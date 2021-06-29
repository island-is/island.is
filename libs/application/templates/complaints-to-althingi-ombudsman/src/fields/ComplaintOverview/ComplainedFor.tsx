import { ReviewGroup } from '@island.is/application/ui-components'
import React, { FC } from 'react'
import { complainedFor, complaintOverview } from '../../lib/messages'
import { ComplainedForTypes } from '../../shared'
import { ValueLine } from './ValueLine'

type Props = {
  complainedFor: ComplainedForTypes
  connection: string
}

const mapComplainedForToMessage = {
  [ComplainedForTypes.MYSELF]: complainedFor.decision.myselfLabel,
  [ComplainedForTypes.SOMEONEELSE]: complainedFor.decision.someoneelseLabel,
}

export const ComplainedFor: FC<Props> = ({ complainedFor, connection }) => (
  <ReviewGroup>
    <ValueLine
      label={complaintOverview.labels.complainedFor}
      value={mapComplainedForToMessage[complainedFor]}
    />
    {complainedFor === ComplainedForTypes.SOMEONEELSE && (
      <ValueLine
        label={complaintOverview.labels.complainedForConnection}
        value={connection}
      />
    )}
  </ReviewGroup>
)
