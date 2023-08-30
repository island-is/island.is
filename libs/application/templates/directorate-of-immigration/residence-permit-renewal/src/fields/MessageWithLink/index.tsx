import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  GridContainer,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'

interface MessageWithLinkProps {
  field: {
    props: {
      title: MessageDescriptor
      buttonTitle: MessageDescriptor
      buttonUrl: MessageDescriptor
    }
  }
}

export const MessageWithLink: FC<MessageWithLinkProps & FieldBaseProps> = ({
  field,
}) => {
  const { formatMessage } = useLocale()
  const linkTitle = formatMessage(field?.props?.buttonTitle)
  const linkUrl = formatMessage(field?.props?.buttonUrl)
  const title = formatMessage(field?.props?.title)

  return (
    <GridContainer>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
        background="blue100"
        padding={3}
        borderRadius="large"
      >
        <Text variant="h3" color="blue600">
          {formatMessage(title)}
        </Text>

        <LinkV2 href={linkUrl} color="blue400">
          <Button icon="open" iconType="outline" size="small">
            <Text color="white" fontWeight="semiBold">
              {formatMessage(linkTitle)}
            </Text>
          </Button>
        </LinkV2>
      </Box>
    </GridContainer>
  )
}
