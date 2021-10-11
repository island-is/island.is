import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { inReview, overview, thirdPartyComment } from '../../lib/messages'
import { FormOverview } from '../FormOverview'

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

  const onBackButtonClick = () => {
    setState('uploadDocuments')
  }
  const onForwardButtonClick = () => {
    setState('inReviewSteps')
  }
  const goToAttachmentScreen = () => {
    setState('uploadDocuments')
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
            {/** TODO:
             * Create modal when buttons have been clicked and
             * add submit functionality to go to next step.
             */}
            <Button
              icon="warning"
              colorScheme="destructive"
              onClick={onForwardButtonClick}
            >
              {formatMessage(thirdPartyComment.buttons.reject)}
            </Button>
            <Box marginLeft={7}>
              <Button icon="checkmarkCircle" onClick={onForwardButtonClick}>
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
    </>
  )
}
