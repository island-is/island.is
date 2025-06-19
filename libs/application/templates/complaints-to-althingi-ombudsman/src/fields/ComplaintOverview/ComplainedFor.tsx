import { ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { ComplaintsToAlthingiOmbudsman } from '../../lib/dataSchema'
import {
  complainedFor as complainedForMessages,
  complaintOverview,
} from '../../lib/messages'
import { ComplainedForTypes } from '../../shared'
import { mapComplainedForToMessage } from '../../utils'
import { DocumentCard } from '../components'
import { ValueLine } from './ValueLine'

type Props = {
  complainedForType: ComplainedForTypes
  complainedFor: ComplaintsToAlthingiOmbudsman['complainedForInformation']
  connection: string
  isEditable?: boolean
  onEdit: (id: string) => void
}

export const ComplainedFor: FC<React.PropsWithChildren<Props>> = ({
  complainedFor,
  connection,
  complainedForType,
  isEditable,
  onEdit,
}) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => onEdit('complainedFor')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              label={complaintOverview.labels.complainedFor}
              value={mapComplainedForToMessage[complainedForType]}
            />
          </GridColumn>
        </GridRow>

        {complainedForType === ComplainedForTypes.SOMEONEELSE && (
          <>
            <GridRow>
              {complainedFor.powerOfAttorney &&
                complainedFor.powerOfAttorney.length > 0 && (
                  <GridColumn span="12/12" paddingBottom={3}>
                    {complainedFor.powerOfAttorney.map((document, index) => {
                      const [fileType] = document.name.split('.').slice(-1)
                      return (
                        <DocumentCard
                          fileType={fileType}
                          text={formatMessage(
                            complaintOverview.labels.complainedForDocument,
                          )}
                          key={`${index}-${document.name}`}
                        />
                      )
                    })}
                  </GridColumn>
                )}
            </GridRow>
            <GridRow>
              <GridColumn span="9/12">
                <ValueLine
                  label={complaintOverview.labels.complainedForConnection}
                  value={connection}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </ReviewGroup>
      {complainedForType === ComplainedForTypes.SOMEONEELSE && (
        <ReviewGroup
          isEditable={isEditable}
          editAction={() => onEdit('complainedForInformation')}
        >
          <GridRow>
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                value={complainedFor.name}
                label={complainedForMessages.labels.name}
              />
            </GridColumn>
            <GridColumn span={['9/12', '9/12', '9/12', '4/12']}>
              <ValueLine
                value={complainedFor.nationalId}
                label={complainedForMessages.labels.nationalId}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                value={complainedFor.address}
                label={complainedForMessages.labels.address}
              />
            </GridColumn>
            <GridColumn span={['9/12', '9/12', '9/12', '4/12']}>
              <ValueLine
                value={complainedFor.city}
                label={complainedForMessages.labels.city}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
              <ValueLine
                value={complainedFor.postalCode}
                label={complainedForMessages.labels.postalCode}
              />
            </GridColumn>
            {complainedFor.phoneNumber && (
              <GridColumn span={['9/12', '9/12', '9/12', '4/12']}>
                <ValueLine
                  value={complainedFor.phoneNumber}
                  label={complainedForMessages.labels.phoneNumber}
                />
              </GridColumn>
            )}
          </GridRow>
          <GridRow>
            {complainedFor.email && (
              <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
                <ValueLine
                  value={complainedFor.email}
                  label={complainedForMessages.labels.email}
                />
              </GridColumn>
            )}
          </GridRow>
        </ReviewGroup>
      )}
    </>
  )
}
