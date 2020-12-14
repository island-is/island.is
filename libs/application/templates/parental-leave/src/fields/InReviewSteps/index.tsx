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
          {formatMessage(mm.reviewScreen.desc)}{' '}
          <Box display="inlineBlock" marginLeft={1} marginRight={2}>
            <Button
              colorScheme="default"
              iconType="filled"
              // TODO: Add this in next PR
              onClick={function noRefCheck() {}}
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
              // TODO: Add this in next PR
              onClick={function noRefCheck() {}}
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
