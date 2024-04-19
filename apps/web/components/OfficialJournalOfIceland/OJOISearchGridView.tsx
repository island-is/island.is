import { MinistryOfJusticeAdvertsResponse } from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'

import { OJOIAdvertCard } from './OJOIAdvertCard'
import { advertUrl } from './OJOIUtils'

export const OJOISearchGridView = ({
  adverts,
}: {
  adverts: MinistryOfJusticeAdvertsResponse['adverts']
}) => {
  return (
    <Stack space={2}>
      {adverts.map((ad) => (
        <OJOIAdvertCard
          key={ad.id}
          institution={ad.involvedParty?.title}
          department={ad.department?.title}
          publicationNumber={ad.publicationNumber?.full}
          publicationDate={ad.publicationDate}
          title={ad.title}
          categories={ad.categories?.map((cat) => cat.title)}
          link={advertUrl + '/' + ad.id}
        />
      ))}
    </Stack>
  )
}
