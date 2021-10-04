import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { overview } from '../../lib/messages'
import { FormOverview } from '../FormOverview'

type FormOverviewInReviewProps = {
  setState: React.Dispatch<React.SetStateAction<string>>
}

export const FormOverviewInReview: FC<
  FieldBaseProps & FormOverviewInReviewProps
> = (props, { setState }) => {
  const { formatMessage } = useLocale()
  const { application, field } = props

  const onBackButtonClick = () => {
    setState('uploadDocuments')
  }
  const onForwardButtonClick = () => {
    setState('inReviewSteps')
  }
  return (
    <>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(overview.general.sectionTitle)}
      </Text>
      <FormOverview {...props} />
      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          Til baka
        </Button>
        <Button icon="arrowForward" onClick={onForwardButtonClick}>
          Halda áfram
        </Button>
      </Box>
    </>
  )
}
