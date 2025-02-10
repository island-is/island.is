import { Stack } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { OfficialJournalOfIcelandAdvertsResponse } from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'

import { OJOIAdvertCard } from './OJOIAdvertCard'

type Props = {
  adverts?: OfficialJournalOfIcelandAdvertsResponse['adverts']
  locale: Locale
}

export const OJOIAdvertCards = ({ adverts, locale }: Props) => {
  return (
    <Stack space={3}>
      {adverts?.map((ad) => (
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
