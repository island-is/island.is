import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { LatestNewsSection, Section } from '@island.is/web/components'

interface SliceProps {
  slice: LatestNewsSliceSchema
  organizationPageSlug: string
}

export const LatestNewsSlice: React.FC<SliceProps> = ({
  slice,
  organizationPageSlug,
}) => {
  return (
    <section key={slice.id}>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        background="purple100"
        aria-labelledby="latestNewsTitle"
      >
        <LatestNewsSection
          label={slice.title}
          labelId="latestNewsTitle"
          items={slice.news}
          linkType="organizationnews"
          overview="organizationnewsoverview"
          parameters={[organizationPageSlug]}
          readMoreText={slice.readMoreText}
        />
      </Section>
    </section>
  )
}
