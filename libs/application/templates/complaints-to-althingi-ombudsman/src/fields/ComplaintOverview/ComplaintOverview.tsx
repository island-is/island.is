import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import React, { FC } from 'react'
import { ComplaintsToAlthingiOmbudsman } from '../../lib/dataSchema'
import { complaintOverview, information } from '../../lib/messages'
import { ValueLine } from './ValueLine'
import { ComplainedFor } from './ComplainedFor'
import { Complainee } from './Complainee'
import { yesNoMessageMapper } from '../../utils'

export const ComplaintOverview: FC<FieldBaseProps> = ({ application }) => {
  const answers = (application as any).answers as ComplaintsToAlthingiOmbudsman
  const { name, ssn, phone, email, address } = answers.information
  const attachmentsText =
    answers.attachments.documents && answers.attachments.documents.length > 0
      ? answers.attachments.documents?.map((x) => x.name).join(', ')
      : complaintOverview.general.noAttachments

  return (
    <Box component="section" paddingTop={6}>
      <ReviewGroup>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={`${name}, ${ssn}, ${phone}, ${email}`}
              label={complaintOverview.labels.nationalRegistry}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={name}
              label={information.aboutTheComplainer.name}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={address}
              label={information.aboutTheComplainer.address}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={phone}
              label={information.aboutTheComplainer.phone}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={email}
              label={information.aboutTheComplainer.email}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ComplainedFor
        complainedForType={answers.complainedFor.decision}
        complainedFor={answers.complainedForInformation}
        connection={answers.complainedForInformation?.connection ?? ''}
      />
      <Complainee
        name={answers.complaintDescription.complaineeName}
        type={answers.complainee.type}
      />
      <ReviewGroup>
        <ValueLine
          label={complaintOverview.labels.courtAction}
          value={yesNoMessageMapper[answers.courtActionAnswer]}
        />
      </ReviewGroup>
      <ReviewGroup isLast>
        <Text variant="h5"></Text>
        <ValueLine
          label={complaintOverview.labels.attachments}
          value={attachmentsText}
        />
      </ReviewGroup>
    </Box>
  )
}
