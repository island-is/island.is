import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { parentBIntro } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText, TransferOverview } from '../components'

const ParentBIntro = ({ application }: CRCFieldBaseProps) => {
  const { externalData } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  return (
    <>
      <Text marginTop={3}>
        {formatMessage(parentBIntro.general.description, {
          otherParentName: applicant.fullName,
        })}
      </Text>
      <TransferOverview application={application} />
      <Text marginTop={5} variant="h3">
        {formatMessage(parentBIntro.disagreement.title)}
      </Text>
      <DescriptionText text={parentBIntro.disagreement.description} />
      <Text marginTop={5} variant="h3">
        {formatMessage(parentBIntro.interview.title)}
      </Text>
      <Text>{formatMessage(parentBIntro.interview.description)}</Text>
      <Box marginTop={5}>
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
          variant="ghost"
        >
          {formatMessage(parentBIntro.interview.button)}
        </Button>
      </Box>
    </>
  )
}

export default ParentBIntro
