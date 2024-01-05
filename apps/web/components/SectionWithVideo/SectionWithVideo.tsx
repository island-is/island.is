import {
  SectionWithVideo,
  SectionWithVideoProps,
} from '@island.is/island-ui/contentful'
import { Box, BoxProps } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import type { SectionWithVideo as SectionWithVideoSchema } from '@island.is/web/graphql/schema'

interface SectionWithVideoWrapperProps {
  slice: SectionWithVideoSchema
}

const SectionWithVideoWrapper = ({ slice }: SectionWithVideoWrapperProps) => {
  const { activeLocale } = useI18n()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const boxProps: BoxProps = slice.showDividerOnTop
    ? { borderTopWidth: 'standard', borderColor: 'standard', paddingTop: 4 }
    : {}
  return (
    <Box {...boxProps}>
      <SectionWithVideo
        {...slice}
        html={slice.html as unknown as SectionWithVideoProps['html']}
        locale={activeLocale}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        title={slice.showTitle ? slice.title : ''}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        video={{
          ...slice.video,
          locale: activeLocale,
        }}
      />
    </Box>
  )
}

export default SectionWithVideoWrapper
