import { AlertMessage, AlertMessageType } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, Icon, Stack, Link, Text } from '@island.is/island-ui/core'
import * as styles from './earlyRetirementWarning.css'
import { useFormContext } from 'react-hook-form'
import { RadioFormField } from '@island.is/application/ui-fields'

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
  const { title, description, props, id } = field
  const { formatMessage } = useLocale()
  const { type } = props
  const { setValue } = useFormContext()
  setValue(id, 'true')

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
      {/* Add empty RadioFormField so we could bypass issue with Alertmessage without ID */}
      <RadioFormField
        field={{
          id: id,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          title,
          children: undefined,
          options: [],
        }}
        application={application}
      />
    </Box>
  )
}

export const EarlyRetirementWarning: FC<
  FieldBaseProps & DescriptionLinkProps
> = ({ application, field }) => {
  const { props, title, id } = field
  const { formatMessage } = useLocale()
  const { descriptionFirstPart, descriptionSecondPart, linkName, url } = props
  const { setValue } = useFormContext()
  setValue(id, 'true')

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
      {/* Add empty RadioFormField so we could bypass issue with Warning message without ID */}
      <RadioFormField
        field={{
          id: id,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          title,
          children: undefined,
          options: [],
        }}
        application={application}
      />
    </Box>
  )
}
