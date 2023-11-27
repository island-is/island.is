import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridRow, GridColumn, Text } from '@island.is/island-ui/core'
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
import { DocumentCard } from '../components'
import { useLocale } from '@island.is/localization'

type Props = FieldBaseProps & { field: { props: { isEditable: boolean } } }

export const ComplaintOverview: FC<React.PropsWithChildren<Props>> = ({
  application,
  goToScreen,
  field,
}) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as ComplaintsToAlthingiOmbudsman
  const { isEditable } = field.props
  const {
    appeals,
    complaintType,
    applicant: { name, phoneNumber, email, address },
    complaintDescription: { decisionDate },
    attachments: { documents },
  } = answers

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const complaintIsAboutDecision =
    complaintType === OmbudsmanComplaintTypeEnum.DECISION

  return (
    <Box component="section" paddingTop={6}>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('approveExternalData')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              value={complaintOverview.labels.externalDataText}
              label={complaintOverview.labels.externalDataTitle}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('information.aboutTheComplainer')}
      >
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              value={name}
              label={information.aboutTheComplainer.name}
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '4/12']}>
            <ValueLine
              value={address}
              label={information.aboutTheComplainer.address}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <ValueLine
              value={phoneNumber ?? ''}
              label={information.aboutTheComplainer.phoneNumber}
            />
          </GridColumn>
          <GridColumn span={['9/12', '9/12', '9/12', '4/12']}>
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
          <GridColumn span={['9/12', '9/12', '9/12', '9/12', '5/12']}>
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
            <GridColumn span={['9/12', '9/12', '9/12', '9/12', '4/12']}>
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
          <GridColumn span="9/12">
            <ValueLine
              value={yesNoMessageMapper[appeals]}
              label={complaintInformation.appealsHeader}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('preexistingComplaint.multifield')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              label={complaintOverview.labels.courtAction}
              value={yesNoMessageMapper[answers.preexistingComplaint]}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('courtAction.question')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              label={complaintOverview.labels.courtActionSecond}
              value={yesNoMessageMapper[answers.courtActionAnswer]}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup
        isLast
        isEditable={isEditable}
        editAction={() => changeScreens('attachments.documents')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine label={complaintOverview.labels.attachments} value="" />
          </GridColumn>
          <GridColumn span="12/12" paddingTop={2}>
            {documents && documents.length > 0 ? (
              documents.map((document, index) => {
                const [fileType] = document.name.split('.').slice(-1)
                return (
                  <DocumentCard
                    fileType={fileType}
                    text={formatMessage(
                      complaintOverview.labels.complaintDocument,
                    )}
                    key={`${index}-${document.name}`}
                  />
                )
              })
            ) : (
              <Text>
                {formatMessage(complaintOverview.labels.complaintNoDocuments)}
              </Text>
            )}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
