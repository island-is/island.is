import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { parentBIntro } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText, TransferOverview } from '../components'
import { RadioController } from '@island.is/shared/form-fields'

const ParentBIntro = ({ application, field, errors }: CRCFieldBaseProps) => {
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
        <Box marginTop={4}>
          <RadioController
            id={field.id}
            largeButtons
            options={[
              {
                value: 'accept',
                label: formatMessage(parentBIntro.contract.accept),
              },
              {
                value: 'reject',
                label: formatMessage(parentBIntro.contract.reject),
              },
            ]}
            error={errors?.acceptContract}
          />
        </Box>
      </Box>
    </>
  )
}

export default ParentBIntro
