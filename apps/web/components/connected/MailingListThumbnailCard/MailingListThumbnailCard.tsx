import {
  Box,
  Button,
  Hidden,
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
      width="full"
    >
      <Hidden below="xl">
        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="spaceBetween"
          alignItems="center"
          rowGap={3}
        >
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
        </Box>
      </Hidden>
      <Hidden above="lg">
        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="spaceBetween"
          alignItems="center"
          rowGap={3}
        >
          <Stack space={1}>
            <Text variant="h3" color="blue400">
              {headingText}
            </Text>
            <Text>{descriptionText}</Text>
          </Stack>
          {Boolean(linkHref) && Boolean(linkLabel) && (
            <Box
              display="flex"
              justifyContent="flexEnd"
              alignItems="center"
              width="full"
            >
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
            </Box>
          )}
        </Box>
      </Hidden>
    </Box>
  )
}
