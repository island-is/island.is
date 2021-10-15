import { DefaultEvents, FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { FC, useState } from 'react'
import { inReview, overview, thirdPartyComment } from '../../lib/messages'
import { FormOverview } from '../FormOverview'
import { ConfirmationModal } from './ConfirmationModal'

type FormOverviewInReviewProps = {
  props: FieldBaseProps
  isAssignee: boolean
  setState: React.Dispatch<React.SetStateAction<string>>
}

export const FormOverviewInReview: FC<FormOverviewInReviewProps> = ({
  props,
  setState,
  isAssignee,
}) => {
  const { formatMessage } = useLocale()
  const { application, refetch } = props
  const [rejectModalVisibility, setRejectModalVisibility] = useState<boolean>(
    false,
  )
  const [approveModalVisibility, setApproveModalVisibility] = useState<boolean>(
    false,
  )

  const onBackButtonClick = () => {
    setState('uploadDocuments')
  }
  const onForwardButtonClick = () => {
    setState('inReviewSteps')
  }
  const goToAttachmentScreen = () => {
    setState('uploadDocuments')
  }
  const openRejectModal = () => {
    setRejectModalVisibility(true)
  }
  const openApproveModal = () => {
    setApproveModalVisibility(true)
  }
  return (
    <>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(overview.general.sectionTitle)}
      </Text>
      <FormOverview {...props} />
      <Box display="flex" justifyContent="flexEnd" marginBottom={6}>
        <Button icon="attach" variant="utility" onClick={goToAttachmentScreen}>
          {formatMessage(overview.labels.missingDocumentsButton)}
        </Button>
      </Box>
      {isAssignee && (
        <Box marginBottom={6}>
          <Text variant="h4" paddingBottom={2}>
            {formatMessage(thirdPartyComment.general.title)}
          </Text>
          <Divider />
          <Text paddingY={2}>
            {formatMessage(thirdPartyComment.general.description)}
          </Text>
          <InputController
            id="assigneeComment"
            textarea
            backgroundColor="blue"
            rows={10}
            label={formatMessage(thirdPartyComment.labels.comment)}
            placeholder={formatMessage(
              thirdPartyComment.labels.commentPlaceholder,
            )}
          />
        </Box>
      )}
      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          {formatMessage(inReview.buttons.backButton)}
        </Button>
        {isAssignee ? (
          <Box display="flex" justifyContent="spaceBetween">
            <Button
              icon="warning"
              colorScheme="destructive"
              onClick={openRejectModal}
            >
              {formatMessage(thirdPartyComment.buttons.reject)}
            </Button>
            <Box marginLeft={3}>
              <Button icon="checkmarkCircle" onClick={openApproveModal}>
                {formatMessage(thirdPartyComment.buttons.approve)}
              </Button>
            </Box>
          </Box>
        ) : (
          <Button icon="checkmarkCircle" onClick={onForwardButtonClick}>
            {formatMessage(inReview.buttons.updateButton)}
          </Button>
        )}
      </Box>
      <ConfirmationModal
        visibility={rejectModalVisibility}
        setVisibility={setRejectModalVisibility}
        title={formatMessage(inReview.confirmationModal.reject.title)}
        text={formatMessage(inReview.confirmationModal.reject.text)}
        buttonText={formatMessage(inReview.confirmationModal.reject.buttonText)}
        buttonColorScheme="destructive"
        defaultEvent={DefaultEvents.REJECT}
        application={application}
        refetch={refetch}
      />
      <ConfirmationModal
        visibility={approveModalVisibility}
        setVisibility={setApproveModalVisibility}
        title={formatMessage(inReview.confirmationModal.approve.title)}
        text={formatMessage(inReview.confirmationModal.approve.text)}
        buttonText={formatMessage(
          inReview.confirmationModal.approve.buttonText,
        )}
        buttonColorScheme="default"
        defaultEvent={DefaultEvents.APPROVE}
        application={application}
        refetch={refetch}
      />
    </>
  )
}
