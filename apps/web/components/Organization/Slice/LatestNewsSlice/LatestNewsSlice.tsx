import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { LatestNewsSection, Section } from '@island.is/web/components'

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
    <section key={slice.id}>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        background={fullWidth ? 'purple100' : 'white'}
        aria-labelledby="latestNewsTitle"
      >
        <LatestNewsSection
          label={slice.title}
          labelId="latestNewsTitle"
          items={slice.news}
          linkType="organizationnews"
          overview="organizationnewsoverview"
          parameters={[organizationPageSlug]}
          newsTag={slice.tag}
          readMoreText={slice.readMoreText}
          fullWidth={fullWidth}
        />
      </Section>
    </section>
  )
}
