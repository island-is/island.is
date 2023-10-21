import {
  Box,
  Button,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FeaturedSupportQnAs as FeaturedSupportQNAsSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

interface FeaturedSupportQNAsProps {
  slice: FeaturedSupportQNAsSchema
}

const FeaturedSupportQNAs = ({ slice }: FeaturedSupportQNAsProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <Box background="blueberry100" borderRadius="large" padding={4}>
      <Inline flexWrap="nowrap" alignY="center" justifyContent="spaceBetween">
        <Text variant="eyebrow" fontWeight="semiBold" color="blueberry600">
          {slice?.renderedTitle ?? ''}
        </Text>
        {slice?.link?.url && slice?.link?.text && (
          <LinkV2 href={slice.link.url}>
            <Button
              colorScheme="blueberry"
              size="small"
              variant="text"
              icon="open"
              iconType="outline"
            >
              {slice.link.text}
            </Button>
          </LinkV2>
        )}
      </Inline>
      <Box marginTop={3}>
        <Stack space="p2">
          {(
            (slice?.resolvedSupportQNAs?.length
              ? slice?.resolvedSupportQNAs
              : slice?.supportQNAs) ?? []
          )
            .filter(
              (qna) =>
                qna?.title &&
                qna?.slug &&
                qna?.category?.slug &&
                qna?.organization?.slug,
            )
            .map((qna, index) => (
              <LinkV2
                href={
                  linkResolver('supportqna', [
                    qna.organization?.slug ?? '',
                    qna.category?.slug ?? '',
                    qna.slug,
                  ]).href
                }
                key={index}
              >
                <Text fontWeight="light" color="blueberry600">
                  {qna.title}
                </Text>
              </LinkV2>
            ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default FeaturedSupportQNAs
