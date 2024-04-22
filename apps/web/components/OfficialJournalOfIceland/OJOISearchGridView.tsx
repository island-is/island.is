import { Stack } from '@island.is/island-ui/core'
import { OfficialJournalOfIcelandAdvertsResponse } from '@island.is/web/graphql/schema'

import { OJOIAdvertCard } from './OJOIAdvertCard'
import { advertUrl } from './OJOIUtils'

export const OJOISearchGridView = ({
  adverts,
}: {
  adverts: OfficialJournalOfIcelandAdvertsResponse['adverts']
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
