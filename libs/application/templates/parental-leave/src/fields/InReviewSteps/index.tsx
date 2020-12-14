import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'

import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import ReviewSection, { reviewSectionState } from './ReviewSection'

type stateMapEntry = { [key: string]: reviewSectionState }
type statesMap = {
  otherParent: stateMapEntry
  employer: stateMapEntry
  vinnumalastofnun: stateMapEntry
}
const statesMap: statesMap = {
  otherParent: {
    otherParentApproval: 'In progress',
    otherParentRequiresAction: 'Requires action',
    employerApproval: 'Complete',
    vinnumalastofnunApproval: 'Complete',
  },
  employer: {
    employerApproval: 'In progress',
    employerRequiresAction: 'Requires action',
    vinnumalastofnunApproval: 'Complete',
  },
  vinnumalastofnun: {
    vinnumalastofnunApproval: 'In progress',
    vinnumalastofnunRequiresAction: 'Requires action',
    approved: 'Complete',
  },
}

const InReviewSteps: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={10}>
      <Box>
        <Text as="div">
          {formatText(m.reviewDesc, application, formatMessage)}{' '}
          <Box display="inlineBlock" marginLeft={1} marginRight={2}>
            <Button
              colorScheme="default"
              iconType="filled"
              onClick={function noRefCheck() {}}
              size="small"
              type="button"
              variant="text"
            >
              {formatText(m.reviewButtonsView, application, formatMessage)}
            </Button>
          </Box>
          <Box display="inlineBlock">
            <Button
              colorScheme="default"
              iconType="filled"
              onClick={function noRefCheck() {}}
              size="small"
              type="button"
              variant="text"
            >
              {formatText(m.reviewButtonsEdit, application, formatMessage)}
            </Button>
          </Box>
        </Text>
      </Box>

      <Box marginTop={7} marginBottom={8}>
        <ReviewSection
          application={application}
          index={1}
          state={statesMap['otherParent'][application.state]}
          title={formatText(
            m.reviewStepsOtherParentTitle,
            application,
            formatMessage,
          )}
          description={formatText(
            m.reviewStepsOtherParentDesc,
            application,
            formatMessage,
          )}
        />
        <ReviewSection
          application={application}
          index={2}
          state={statesMap['employer'][application.state]}
          title={formatText(
            m.reviewStepsEmployerTitle,
            application,
            formatMessage,
          )}
          description={formatText(
            m.reviewStepsEmployerDesc,
            application,
            formatMessage,
          )}
        />
        <ReviewSection
          application={application}
          index={3}
          state={statesMap['vinnumalastofnun'][application.state]}
          title={formatText(m.reviewStepsDeptTitle, application, formatMessage)}
          description={formatText(
            m.reviewStepsDeptDesc,
            application,
            formatMessage,
          )}
        />
      </Box>
    </Box>
  )
}

export default InReviewSteps
