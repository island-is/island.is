import {
  SectionWithVideo,
  SectionWithVideoProps,
} from '@island.is/island-ui/contentful'
import { BorderAbove } from '@island.is/web/components'
import type { SectionWithVideo as SectionWithVideoSchema } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

interface SectionWithVideoWrapperProps {
  slice: SectionWithVideoSchema
}

const SectionWithVideoWrapper = ({ slice }: SectionWithVideoWrapperProps) => {
  const { activeLocale } = useI18n()
  return (
    <>
      {slice.showDividerOnTop && <BorderAbove />}
      <SectionWithVideo
        {...slice}
        html={slice.html as unknown as SectionWithVideoProps['html']}
        locale={activeLocale}
        title={slice.showTitle ? slice.title : ''}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        video={{
          ...slice.video,
          locale: activeLocale,
        }}
      />
    </>
  )
}

export default SectionWithVideoWrapper
