import { AlertMessage, AlertMessageType } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Icon, Stack, Link, Text } from '@island.is/island-ui/core'
import * as styles from './earlyRetirementWarning.css'

type FieldAlertMessageProps = {
  field: {
    props: {
      type: AlertMessageType
    }
  }
}

type DescriptionLinkProps = {
  field: {
    props: {
      descriptionFirstPart: string
      descriptionSecondPart: string
      linkName: string
      url: string
    }
  }
}

export const FieldAlertMessage: FC<FieldBaseProps & FieldAlertMessageProps> = ({
  application,
  field,
}) => {
  const { title, description, props } = field
  const { formatMessage } = useLocale()
  const { type } = props

  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type={type ?? 'warning'}
        title={formatText(title, application, formatMessage)}
        message={
          description
            ? formatText(description, application, formatMessage)
            : undefined
        }
      />
    </Box>
  )
}

export const EarlyRetirementWarning: FC<
  FieldBaseProps & DescriptionLinkProps
> = ({ application, field }) => {
  const { props, title } = field
  const { formatMessage } = useLocale()
  const { descriptionFirstPart, descriptionSecondPart, linkName, url } = props

  return (
    <Box
      padding={[1, 1, 2]}
      borderRadius="large"
      background="yellow200"
      borderColor="yellow400"
      borderWidth="standard"
    >
      <Box display="flex" alignItems={'flexStart'}>
        <Box display="flex" marginRight={[1, 1, 2]}>
          <Icon size="large" type="filled" color="yellow600" icon="warning" />
        </Box>
        <Box display="flex" width="full" flexDirection="column">
          <Stack space={1}>
            <Text as="h5" variant="h5">
              {formatText(title, application, formatMessage)}
            </Text>
            <Box display="flex" alignItems="center">
              <Text>
                {`${formatText(
                  descriptionFirstPart,
                  application,
                  formatMessage,
                )} `}
                <Link href={formatText(url, application, formatMessage)}>
                  <span className={styles.link}>
                    {formatText(linkName, application, formatMessage)}
                  </span>
                </Link>
                {formatText(descriptionSecondPart, application, formatMessage)}
              </Text>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
