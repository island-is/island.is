import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Button, Text } from '@island.is/island-ui/core'

import {
  childrenResidenceInfo,
  formatAddress,
  getSelectedChildrenFromExternalData,
} from '../../lib/utils'
import { parentBIntro } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const ParentBIntro = ({ field, application }: CRCFieldBaseProps) => {
  const { externalData, answers } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(applicant, answers)
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <Text>
          {formatMessage(parentBIntro.general.description, {
            otherParentName: applicant.fullName,
          })}
        </Text>
      </Box>
      <Box marginTop={4} marginBottom={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(parentBIntro.information.childNameTitle, {
            count: children.length,
          })}
        </Text>
        {children.map((child) => (
          <Text key={child.nationalId}>{child.fullName}</Text>
        ))}
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">
          {formatMessage(parentBIntro.information.currentLegalParentHomeLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo.current.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo.current.address)}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <Text variant="h4">
          {formatMessage(parentBIntro.information.newLegalParentHomeLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo.future.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo.future.address)}
        </Text>
      </Box>
      <Text variant="h4">{formatMessage(parentBIntro.disagreement.title)}</Text>
      <Box marginTop={1} marginBottom={2}>
        <DescriptionText
          text={parentBIntro.disagreement.description}
        ></DescriptionText>
      </Box>
      <Box marginBottom={5}>
        <Text variant="h4">{formatMessage(parentBIntro.interview.title)}</Text>
        <Text>{formatMessage(parentBIntro.interview.description)}</Text>
      </Box>
      <Box marginBottom={5}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={() =>
            window.open('https://www.syslumenn.is/timabokanir', '_blank')
          }
          preTextIconType="filled"
          size="default"
          type="button"
          variant="primary"
        >
          {formatMessage(parentBIntro.interview.button)}
        </Button>
      </Box>
    </>
  )
}

export default ParentBIntro
