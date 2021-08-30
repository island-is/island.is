import React from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
  Icon,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CustomField,
  FieldBaseProps,
  formatText,
  coreMessages,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import * as styles from './EligibilitySummary/ReviewSection/ReviewSection.treat'
import cn from 'classnames'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

interface name {
  fullName: string
}

function Congratulations({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  const name = application.externalData.nationalRegistry?.data as name
  const { formatMessage } = useLocale()
  const { answers } = application
  const picture = answers.willBringQualityPhoto !== 'yes'
  const certificate = Object.values(answers?.healthDeclaration).includes('yes')
  if (!picture && !certificate) {
    return (
      <Box paddingTop={2}>
        <Box marginTop={2}>
          <ContentBlock>
            <AlertMessage
              type="success"
              title={`${formatText(
                m.congratulationsTitle,
                application,
                formatMessage,
              )} ${name.fullName}`}
              message={formatText(
                m.paymentSuccessIfNotReadyFewWeeks,
                application,
                formatMessage,
              )}
            />
          </ContentBlock>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box marginTop={7} marginBottom={8}>
        <Box
          position="relative"
          border="standard"
          borderRadius="large"
          padding={4}
          marginBottom={2}
          borderColor={'red600'}
        >
          {/* Section Number */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            className={cn(styles.sectionNumber, {
              [styles.sectionNumberRequiresAction]: certificate,
            })}
          >
            <Icon color="white" size="small" icon="warning" />
          </Box>

          {/* Contents */}
          <Box
            alignItems="flexStart"
            display="flex"
            flexDirection={['columnReverse', 'row']}
            justifyContent="spaceBetween"
          >
            <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
              <Text variant="h3">
                {formatText(m.congratulationsCertificateTitle, application, formatMessage)}
              </Text>
              <Text marginTop={1} variant="default">
                {formatText(m.congratulationsCertificateDescription, application, formatMessage)}
              </Text>
            </Box>
            <Box pointerEvents="none">
              <Tag variant="red">
                {formatText(
                  coreMessages.tagsRequiresAction,
                  application,
                  formatMessage,
                )}
              </Tag>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Congratulations
