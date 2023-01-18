import {
  Box,
  Icon,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FeaturedSupportQnAs as FeaturedSupportQNAsSchema } from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

interface FeaturedSupportQNAsProps {
  slice: FeaturedSupportQNAsSchema
}

const FeaturedSupportQNAs = ({ slice }: FeaturedSupportQNAsProps) => {
  const { activeLocale } = useI18n()
  return (
    <Box background="blueberry100" borderRadius="large" padding={4}>
      <Inline flexWrap="nowrap" alignY="center" justifyContent="spaceBetween">
        <Text variant="eyebrow" fontWeight="semiBold" color="blueberry600">
          {activeLocale === 'is' ? 'Spurt og svarað' : 'Questions and answers'}
        </Text>
        {slice?.link?.url && slice?.link?.text && (
          <LinkV2
            color="blueberry600"
            href={slice.link.url}
            underline="normal"
            underlineVisibility="always"
          >
            <Inline space={1} alignY="center">
              <Text
                variant="eyebrow"
                fontWeight="semiBold"
                color="blueberry600"
              >
                {slice.link.text}
              </Text>
              <Icon
                color="blueberry600"
                icon="open"
                type="outline"
                size="small"
              />
            </Inline>
          </LinkV2>
        )}
      </Inline>
      <Box marginTop={3}>
        <Stack space="p2">
          {(slice?.supportQNAs ?? [])
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
                    qna.organization.slug,
                    qna.category.slug,
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
