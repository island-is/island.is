import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import {
  LatestNewsSection,
  LatestNewsSectionSlider,
  Section,
} from '@island.is/web/components'

interface SliceProps {
  slice: LatestNewsSliceSchema
  organizationPageSlug: string
  fullWidth: boolean
}

export const LatestNewsSlice: React.FC<SliceProps> = ({
  slice,
  organizationPageSlug,
  fullWidth,
}) => {
  return (
    <div key={slice.id} style={{ overflow: 'hidden' }}>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        background={fullWidth ? 'purple100' : 'white'}
        aria-labelledby="latestNewsTitle"
      >
        {fullWidth ? (
          <LatestNewsSectionSlider
            label={slice.title}
            readMoreText={slice.readMoreText}
            items={slice.news}
          />
        ) : (
          <LatestNewsSection
            label={slice.title}
            labelId="latestNewsTitle"
            items={slice.news}
            linkType="organizationnews"
            overview="organizationnewsoverview"
            parameters={[organizationPageSlug]}
            newsTag={!fullWidth && slice.tag}
            readMoreText={slice.readMoreText}
            variant="bigCards"
            itemMaxDisplayedCount={4}
          />
        )}
      </Section>
    </div>
  )
}
