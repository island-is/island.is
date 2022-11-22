import { Slice } from '@island.is/web/graphql/schema'
import dynamic from 'next/dynamic'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { RichText, EmailSignup } from '@island.is/web/components'

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

const OverviewLinksSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OverviewLinksSlice),
)

const EventSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.EventSlice),
)

const MailingListSignupSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.MailingListSignupSlice),
)

const MultipleStatistics = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.MultipleStatistics),
)

const LifeEventPageListSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.LifeEventPageListSlice),
)

interface SliceMachineProps {
  slice: Slice
  namespace?: Record<string, string>
  fullWidth?: boolean
  slug?: string
  marginBottom?: ResponsiveSpace
  params?: Record<string, any>
  paddingTop?: ResponsiveSpace
}

const fullWidthSlices = [
  'TimelineSlice',
  'LogoListSlice',
  'MailingListSignupSlice',
  'EmailSignup',
]

const renderSlice = (slice, namespace, slug, params) => {
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
    case 'TabSection':
      return <TabSectionSlice slice={slice} />
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
    case 'MailingListSignupSlice':
      return <MailingListSignupSlice slice={slice} namespace={namespace} />
    case 'LifeEventPageListSlice':
      return (
        <LifeEventPageListSlice
          slice={slice}
          namespace={namespace}
          {...params}
        />
      )
    case 'EmailSignup':
      return <EmailSignup slice={slice} marginLeft={[0, 0, 0, 6]} />
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
  paddingTop = 6,
}: SliceMachineProps) => {
  return !fullWidth ? (
    <GridContainer>
      <GridRow marginBottom={marginBottom}>
        <GridColumn
          paddingTop={paddingTop}
          span={
            fullWidthSlices.includes(slice.__typename)
              ? '9/9'
              : ['9/9', '9/9', '7/9']
          }
          offset={
            fullWidthSlices.includes(slice.__typename) ? '0' : ['0', '0', '1/9']
          }
        >
          {renderSlice(slice, namespace, slug, params)}
        </GridColumn>
      </GridRow>
    </GridContainer>
  ) : (
    <Box marginBottom={marginBottom}>
      {renderSlice(slice, namespace, slug, params)}
    </Box>
  )
}
