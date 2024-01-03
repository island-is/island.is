import { Slice } from '@island.is/web/graphql/schema'
import dynamic from 'next/dynamic'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import {
  RichText,
  EmailSignup,
  SectionWithVideo,
} from '@island.is/web/components'
import { webRenderConnectedComponent } from '@island.is/web/utils/richText'
import { FeaturedSupportQNAs } from '../../FeaturedSupportQNAs'

const DistrictsSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.DistrictsSlice),
)

const FeaturedArticlesSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.FeaturedArticlesSlice),
)

const HeadingSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.HeadingSlice),
)

const OneColumnTextSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OneColumnTextSlice),
)

const TwoColumnTextSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.TwoColumnTextSlice),
)

const AccordionSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.AccordionSlice),
)

const TimelineSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.TimelineSlice),
)

const LogoListSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.LogoListSlice),
)

const TabSectionSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.TabSectionSlice),
)

const BulletListSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.BulletListSlice),
)

const StorySlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.StorySlice),
)

const LatestNewsSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.LatestNewsSlice),
)

const LatestEventsSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.LatestEventsSlice),
)

const OverviewLinksSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OverviewLinksSlice),
)

const EventSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.EventSlice),
)

const MultipleStatistics = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.MultipleStatistics),
)

const AnchorPageListSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.AnchorPageListSlice),
)

const PowerBiSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.PowerBiSlice),
)

interface SliceMachineProps {
  slice: Slice
  namespace?: Record<string, string>
  fullWidth?: boolean
  slug?: string
  marginBottom?: ResponsiveSpace
  params?: Record<string, any>
  paddingBottom?: ResponsiveSpace
  wrapWithGridContainer?: boolean
}

const fullWidthSlices = ['TimelineSlice', 'LogoListSlice', 'EmailSignup']

const renderSlice = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  slice,
  namespace: Record<string, string>,
  slug: string,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  params,
) => {
  switch (slice.__typename) {
    case 'HeadingSlice':
      return <HeadingSlice slice={slice} />
    case 'Districts':
      return <DistrictsSlice slice={slice} />
    case 'FeaturedArticles':
      return <FeaturedArticlesSlice slice={slice} namespace={namespace} />
    case 'TwoColumnText':
      return <TwoColumnTextSlice slice={slice} />
    case 'MultipleStatistics':
      return <MultipleStatistics slice={slice} />
    case 'OneColumnText':
      return <OneColumnTextSlice slice={slice} />
    case 'AccordionSlice':
      return <AccordionSlice slice={slice} />
    case 'TimelineSlice':
      return <TimelineSlice slice={slice} namespace={namespace} />
    case 'LogoListSlice':
      return <LogoListSlice slice={slice} />
    case 'TabSection': {
      return <TabSectionSlice slice={slice} {...params} />
    }
    case 'BulletListSlice':
      return <BulletListSlice slice={slice} />
    case 'StorySlice':
      return <StorySlice slice={slice} />
    case 'OverviewLinks':
      return <OverviewLinksSlice slice={slice} />
    case 'EventSlice':
      return <EventSlice slice={slice} />
    case 'LatestNewsSlice':
      return <LatestNewsSlice slice={slice} slug={slug} {...params} />
    case 'LifeEventPageListSlice':
    case 'AnchorPageListSlice':
      return (
        <AnchorPageListSlice slice={slice} namespace={namespace} {...params} />
      )
    case 'EmailSignup':
      return <EmailSignup slice={slice} marginLeft={[0, 0, 0, 6]} />
    case 'ConnectedComponent':
      return webRenderConnectedComponent(slice)
    case 'FeaturedSupportQNAs':
      return <FeaturedSupportQNAs slice={slice} />
    case 'PowerBiSlice':
      return <PowerBiSlice slice={slice} />
    case 'SectionWithVideo':
      return <SectionWithVideo slice={slice} />
    case 'LatestEventsSlice':
      return (
        <LatestEventsSlice
          slice={slice}
          slug={slug}
          namespace={namespace}
          {...params}
        />
      )
    default:
      return <RichText body={[slice]} />
  }
}

export const SliceMachine = ({
  slice,
  namespace,
  fullWidth = false,
  slug = '',
  marginBottom = 0,
  params,
  paddingBottom = 6,
  wrapWithGridContainer = false,
}: SliceMachineProps) => {
  return !fullWidth ? (
    <GridContainer>
      <GridRow marginBottom={marginBottom}>
        <GridColumn
          paddingBottom={paddingBottom}
          span={
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            fullWidthSlices.includes(slice.__typename)
              ? '9/9'
              : ['9/9', '9/9', '7/9']
          }
          offset={
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            fullWidthSlices.includes(slice.__typename) ? '0' : ['0', '0', '1/9']
          }
        >
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            renderSlice(slice, namespace, slug, params)
          }
        </GridColumn>
      </GridRow>
    </GridContainer>
  ) : (
    <Box marginBottom={marginBottom}>
      {wrapWithGridContainer && (
        <GridContainer>
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            renderSlice(slice, namespace, slug, params)
          }
        </GridContainer>
      )}
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        !wrapWithGridContainer && renderSlice(slice, namespace, slug, params)
      }
    </Box>
  )
}
