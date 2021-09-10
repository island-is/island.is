import { FieldBaseProps } from '@island.is/application/core'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import React, { FC } from 'react'
import { ComplaintsToAlthingiOmbudsman } from '../../lib/dataSchema'
import {
  complaintOverview,
  information,
  complaintInformation,
} from '../../lib/messages'
import { ValueLine } from './ValueLine'
import { ComplainedFor } from './ComplainedFor'
import { ComplaintInformation } from './ComplaintInformation'
import { yesNoMessageMapper } from '../../utils'
import { OmbudsmanComplaintTypeEnum } from '../../shared'

type Props = FieldBaseProps & { field: { props: { isEditable: boolean } } }

export const ComplaintOverview: FC<Props> = ({
  application,
  goToScreen,
  field,
}) => {
  const answers = application.answers as ComplaintsToAlthingiOmbudsman
  const { isEditable } = field.props
  const {
    appeals,
    complaintType,
    information: { name, phone, email, address },
    complaintDescription: { decisionDate },
    attachments: { documents },
  } = answers

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const complaintIsAboutDecision =
    complaintType === OmbudsmanComplaintTypeEnum.DECISION

  const attachmentsText =
    documents && documents.length > 0
      ? documents?.map((x) => x.name).join(', ')
      : complaintOverview.general.noAttachments

  return (
    <Box component="section" paddingTop={6}>
      <ReviewGroup>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={complaintOverview.labels.nationalRegistryText}
              label={complaintOverview.labels.nationalRegistry}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={complaintOverview.labels.notificationConsentText}
              label={complaintOverview.labels.notificationConsentTitle}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('information.aboutTheComplainer')}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={name ?? ''}
              label={information.aboutTheComplainer.name}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={address ?? ''}
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
        isEditable={isEditable}
        onEdit={changeScreens}
      />
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('complainee')}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={
                complaintIsAboutDecision
                  ? complaintInformation.decisionLabel
                  : complaintInformation.proceedingsLabel
              }
              label={complaintOverview.labels.complaintType}
            />
          </GridColumn>
          {complaintIsAboutDecision && decisionDate && (
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <ValueLine
                label={complaintOverview.labels.decisionDate}
                value={decisionDate}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>
      <ComplaintInformation
        name={answers.complaintDescription.complaineeName}
        type={answers.complainee.type}
        description={answers.complaintDescription.complaintDescription}
        isEditable={isEditable}
        onEdit={changeScreens}
      />
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('appeals')}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              value={yesNoMessageMapper[appeals]}
              label={complaintInformation.appealsHeader}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('courtAction.question')}
      >
        <ValueLine
          label={complaintOverview.labels.courtAction}
          value={yesNoMessageMapper[answers.courtActionAnswer]}
        />
      </ReviewGroup>
      <ReviewGroup
        isLast
        isEditable={isEditable}
        editAction={() => changeScreens('attachments.documents')}
      >
        <ValueLine
          label={complaintOverview.labels.attachments}
          value={attachmentsText}
        />
      </ReviewGroup>
    </Box>
  )
}
