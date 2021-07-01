import { ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { ComplaintsToAlthingiOmbudsman } from '../../lib/dataSchema'
import {
  complainedFor as complainedForMessages,
  complaintOverview,
} from '../../lib/messages'
import { ComplainedForTypes } from '../../shared'
import { ValueLine } from './ValueLine'

type Props = {
  complainedForType: ComplainedForTypes
  complainedFor: ComplaintsToAlthingiOmbudsman['complainedFor']
  connection: string
}

const mapComplainedForToMessage = {
  [ComplainedForTypes.MYSELF]: complainedForMessages.decision.myselfLabel,
  [ComplainedForTypes.SOMEONEELSE]:
    complainedForMessages.decision.someoneelseLabel,
}

export const ComplainedFor: FC<Props> = ({
  complainedFor,
  connection,
  complainedForType,
}) => (
  <>
    <ReviewGroup>
      <ValueLine
        label={complaintOverview.labels.complainedFor}
        value={mapComplainedForToMessage[complainedForType]}
      />
      {complainedForType === ComplainedForTypes.SOMEONEELSE && (
        <>
          <ValueLine
            label={complaintOverview.labels.complainedForConnection}
            value={connection}
          />
        </>
      )}
    </ReviewGroup>
    {complainedForType === ComplainedForTypes.SOMEONEELSE && (
      <ReviewGroup>
        <GridRow>
          <GridColumn span={'4/12'}>
            <ValueLine
              value={complainedFor.name}
              label={complainedForMessages.labels.name}
            />
          </GridColumn>
          <GridColumn span={'6/12'}>
            <ValueLine
              value={complainedFor.ssn}
              label={complainedForMessages.labels.ssn}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'4/12'}>
            <ValueLine
              value={complainedFor.address}
              label={complainedForMessages.labels.address}
            />
          </GridColumn>
          <GridColumn span={'6/12'}>
            <ValueLine
              value={complainedFor.city}
              label={complainedForMessages.labels.city}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'4/12'}>
            <ValueLine
              value={complainedFor.postcode}
              label={complainedForMessages.labels.postcode}
            />
          </GridColumn>
          <GridColumn span={'6/12'}>
            <ValueLine
              value={complainedFor.phone}
              label={complainedForMessages.labels.phone}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'4/12'}>
            <ValueLine
              value={complainedFor.email}
              label={complainedForMessages.labels.email}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )}
  </>
)
