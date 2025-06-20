import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridRow, GridColumn, Text } from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import React, { FC } from 'react'
import { ComplaintsToAlthingiOmbudsman } from '../../lib/dataSchema'
import {
  complaintOverview,
  information,
  complaintInformation,
  gender
} from '../../lib/messages'
import { ValueLine } from './ValueLine'
import { ComplainedFor } from './ComplainedFor'
import { ComplaintInformation } from './ComplaintInformation'
import { getGenderLabel, yesNoMessageMapper } from '../../utils'
import { OmbudsmanComplaintTypeEnum } from '../../shared'
import { DocumentCard } from '../components'
import { useLocale } from '@island.is/localization'
import { YES } from '@island.is/application/core'

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
        editAction={() => changeScreens('applicant')}
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
        editAction={() => changeScreens('section.complaintInformation')}
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
        </GridRow>
      </ReviewGroup>
      <ComplaintInformation
        name={answers.complaintDescription.complaineeName}
        type={answers.complainee.type}
        description={answers.complaintDescription.complaintDescription}
        decisionDate={decisionDate}
        isEditable={isEditable}
        onEdit={changeScreens}
      />
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('preexistingComplaint.multifield')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              value={yesNoMessageMapper[answers.preexistingComplaint]}
              label={complaintInformation.appealsHeader}
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
        isEditable={isEditable}
        editAction={() => changeScreens('previousOmbudsmanComplaint.question')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              label={complaintOverview.labels.previousOmbudsmanComplaint}
              value={
                yesNoMessageMapper[answers.previousOmbudsmanComplaint.Answer]
              }
            />
            {answers.previousOmbudsmanComplaint.Answer === YES && (
              <ValueLine
                label={
                  complaintOverview.labels.previousOmbudsmanComplaintDescription
                }
                value={answers.previousOmbudsmanComplaint?.moreInfo || ''}
              />
            )}
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
      <ReviewGroup
        isEditable={isEditable}
        editAction={() => changeScreens('section.gender')}
      >
        <GridRow>
          <GridColumn span="9/12">
            <ValueLine
              label={gender.general.title}
              value={formatMessage(getGenderLabel(answers.genderAnswer))}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
