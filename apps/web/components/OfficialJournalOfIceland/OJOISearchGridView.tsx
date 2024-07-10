import { Stack } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { OfficialJournalOfIcelandAdvertsResponse } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { OJOIAdvertCard } from './OJOIAdvertCard'

export const OJOISearchGridView = ({
  adverts,
  locale,
}: {
  adverts: OfficialJournalOfIcelandAdvertsResponse['adverts']
  locale: Locale
}) => {
  const { linkResolver } = useLinkResolver()

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
          link={linkResolver('ojoiadvert', [ad.id], locale).href}
        />
      ))}
    </Stack>
  )
}
