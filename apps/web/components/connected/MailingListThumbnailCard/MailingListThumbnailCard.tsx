import {
  Box,
  Button,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'

interface MailingListThumbnailCardProps {
  headingText: string
  descriptionText: string
  linkHref: string
  linkLabel: string
}

export const MailingListThumbnailCard = ({
  headingText,
  descriptionText,
  linkHref,
  linkLabel,
}: MailingListThumbnailCardProps) => {
  return (
    <Box
      background="blue100"
      borderRadius="large"
      paddingX={[3, 3, 5, 5, 15]}
      paddingY={[2, 2, 4]}
    >
      <Inline alignY="center" justifyContent="spaceBetween" space={3}>
        <Stack space={1}>
          <Text variant="h3" color="blue400">
            {headingText}
          </Text>
          <Text>{descriptionText}</Text>
        </Stack>
        {Boolean(linkHref) && Boolean(linkLabel) && (
          <LinkV2 href={linkHref}>
            <Button
              unfocusable={true}
              variant="text"
              as="span"
              icon="arrowForward"
            >
              {linkLabel}
            </Button>
          </LinkV2>
        )}
      </Inline>
    </Box>
  )
}
