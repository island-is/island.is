import React, { FC } from 'react'
import { Slice } from '@island.is/web/graphql/schema'
import { Namespace } from '@island.is/api/schema'
import dynamic from 'next/dynamic'
import { TeamList } from '../../../../../libs/island-ui/contentful/src/lib/TeamList/TeamList'
import { TellUsAStoryForm, ContactUs } from '@island.is/island-ui/contentful'

const DistrictsSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.DistrictsSlice),
)

const FeaturedArticlesSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.FeaturedArticlesSlice),
)

const HeadingSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.HeadingSlice),
)

const OfficesSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OfficesSlice),
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

const MailingListSignupSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.MailingListSignupSlice),
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

interface OrganizationSliceProps {
  slice: Slice
  namespace?: Namespace
}

export const OrganizationSlice: FC<OrganizationSliceProps> = ({
  slice,
  namespace,
}) => {
  switch (slice.__typename) {
    case 'HeadingSlice':
      return <HeadingSlice slice={slice} />
    case 'Districts':
      return <DistrictsSlice slice={slice} />
    case 'FeaturedArticles':
      return <FeaturedArticlesSlice slice={slice} namespace={namespace} />
    case 'TwoColumnText':
      return <TwoColumnTextSlice slice={slice} />
    case 'Offices':
      return <OfficesSlice slice={slice} />
    case 'OneColumnText':
      return <OneColumnTextSlice slice={slice} />
    case 'AccordionSlice':
      return <AccordionSlice slice={slice} />
    case 'MailingListSignupSlice':
      return <MailingListSignupSlice slice={slice} namespace={namespace} />
    case 'LogoListSlice':
      return <LogoListSlice slice={slice} />
    case 'TabSection':
      return <TabSectionSlice slice={slice} />
    case 'BulletListSlice':
      return <BulletListSlice slice={slice} />
    case 'StorySlice':
      return <StorySlice slice={slice} />
    case 'TeamList':
      return <TeamList {...slice} />
    case 'ContactUs':
      return (
        <ContactUs
          {...slice}
          onSubmit={async (data) => console.warn(data)}
          state="edit"
        />
      )
    default:
      console.log(slice.__typename)
      return <></>
  }
}
