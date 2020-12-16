import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'

import { mm } from '../../lib/messages'
import ReviewSection, { reviewSectionState } from './ReviewSection'

type stateMapEntry = { [key: string]: reviewSectionState }
type statesMap = {
  otherParent: stateMapEntry
  employer: stateMapEntry
  vinnumalastofnun: stateMapEntry
}
const statesMap: statesMap = {
  otherParent: {
    otherParentApproval: reviewSectionState.inProgress,
    otherParentRequiresAction: reviewSectionState.requiresAction,
    employerApproval: reviewSectionState.complete,
    vinnumalastofnunApproval: reviewSectionState.complete,
  },
  employer: {
    employerApproval: reviewSectionState.inProgress,
    employerRequiresAction: reviewSectionState.requiresAction,
    vinnumalastofnunApproval: reviewSectionState.complete,
  },
  vinnumalastofnun: {
    vinnumalastofnunApproval: reviewSectionState.inProgress,
    vinnumalastofnunRequiresAction: reviewSectionState.requiresAction,
    approved: reviewSectionState.complete,
  },
}

const InReviewSteps: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={10}>
      <Box>
        <Text as="div">
          {formatMessage(mm.reviewScreen.desc)}{' '}
          <Box display="inlineBlock" marginLeft={1} marginRight={2}>
            <Button
              colorScheme="default"
              iconType="filled"
              // TODO: Add onClick in next PR
              size="small"
              type="button"
              variant="text"
            >
              {formatMessage(mm.reviewScreen.buttonsView)}
            </Button>
          </Box>
          <Box display="inlineBlock">
            <Button
              colorScheme="default"
              iconType="filled"
              // TODO: Add onClick in next PR
              size="small"
              type="button"
              variant="text"
            >
              {formatMessage(mm.reviewScreen.buttonsEdit)}
            </Button>
          </Box>
        </Text>
      </Box>

      <Box marginTop={7} marginBottom={8}>
        <ReviewSection
          application={application}
          index={1}
          state={statesMap['otherParent'][application.state]}
          title={formatMessage(mm.reviewScreen.otherParentTitle)}
          description={formatMessage(mm.reviewScreen.otherParentDesc)}
        />
        <ReviewSection
          application={application}
          index={2}
          state={statesMap['employer'][application.state]}
          title={formatMessage(mm.reviewScreen.employerTitle)}
          description={formatMessage(mm.reviewScreen.employerDesc)}
        />
        <ReviewSection
          application={application}
          index={3}
          state={statesMap['vinnumalastofnun'][application.state]}
          title={formatMessage(mm.reviewScreen.deptTitle)}
          description={formatMessage(mm.reviewScreen.deptDesc)}
        />
      </Box>
    </Box>
  )
}

export default InReviewSteps
