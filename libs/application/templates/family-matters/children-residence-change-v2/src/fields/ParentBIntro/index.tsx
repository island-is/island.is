import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { parentBIntro } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { RadioController } from '@island.is/shared/form-fields'
import { TransferOverview } from '../components'
import { YesOrNoEnum } from '@island.is/application/core'

const ParentBIntro = ({ application, field, errors }: CRCFieldBaseProps) => {
  const { externalData } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  return (
    <>
      <Text marginTop={3}>
        {formatMessage(parentBIntro.general.description, {
          otherParentName: (
            <Text as="span" fontWeight="semiBold">
              {applicant.fullName}
            </Text>
          ),
        })}
      </Text>
      <TransferOverview application={application} />
      <Box marginTop={5}>
        <Text marginBottom={1} variant="h3">
          {formatMessage(parentBIntro.interview.title)}
        </Text>
        <DescriptionText text={parentBIntro.interview.description} />
      </Box>
      <Box marginTop={5}>
        <Text marginBottom={1} variant="h3">
          {formatMessage(parentBIntro.disagreement.title)}
        </Text>
        <DescriptionText text={parentBIntro.disagreement.description} />
      </Box>

      <Box marginTop={7}>
        <RadioController
          id={field.id}
          largeButtons
          backgroundColor="white"
          options={[
            {
              value: YesOrNoEnum.YES,
              label: formatMessage(parentBIntro.contract.accept),
            },
            {
              value: YesOrNoEnum.NO,
              label: formatMessage(parentBIntro.contract.reject),
            },
          ]}
          error={errors?.acceptContract}
        />
      </Box>
    </>
  )
}

export default ParentBIntro
