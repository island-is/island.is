import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  CategoryCard,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { webRichText } from '@island.is/web/utils/richText'

import { ManualWrapper } from './components/ManualWrapper'
import { getProps, ManualScreen } from './utils'

const Manual: ManualScreen = ({ manual, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id)

  return (
    <ManualWrapper manual={manual} namespace={namespace}>
      {typeof manual?.description?.length === 'number' &&
        manual.description.length > 0 && (
          <Stack space={4}>
            <Divider />
            <Box>
              <Text variant="eyebrow">
                {n(
                  'manualPageAboutEyebrowText',
                  activeLocale === 'is' ? 'Um handbókina' : 'About manual',
                )}
              </Text>
              {webRichText((manual?.description ?? []) as SliceType[])}
            </Box>
          </Stack>
        )}

      {manual?.chapters && manual?.chapters.length > 0 && (
        <Box paddingBottom={3} paddingTop={1}>
          <Divider />
        </Box>
      )}

      <Stack space={3}>
        {manual?.chapters.map((chapter) => (
          <CategoryCard
            headingAs="h2"
            headingVariant="h4"
            heading={chapter.title}
            text={chapter.intro ?? ''}
            textVariant="medium"
            textFontWeight="light"
            href={
              linkResolver('manualchapter', [manual.slug, chapter.slug]).href
            }
          />
        ))}
      </Stack>
    </ManualWrapper>
  )
}

Manual.getProps = getProps

export default withMainLayout(Manual)
