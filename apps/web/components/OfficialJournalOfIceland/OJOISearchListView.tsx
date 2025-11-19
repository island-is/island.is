import { LinkV2, Table as T, Text } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { OfficialJournalOfIcelandAdvertsResponse } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { formatDate } from './OJOIUtils'

export const OJOISearchListView = ({
  adverts,
  locale,
}: {
  adverts?: OfficialJournalOfIcelandAdvertsResponse['adverts']
  locale: Locale
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData width={'10%'}>Útgáfa</T.HeadData>
          <T.HeadData width={'10%'}>Deild</T.HeadData>
          <T.HeadData width={'10%'}>Númer</T.HeadData>
          <T.HeadData width={'40%'}>Heiti</T.HeadData>
          <T.HeadData width={'30%'}>Stofnun</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {adverts?.map((ad) => (
          <T.Row key={ad.id}>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.publicationDate
                  ? formatDate(ad.publicationDate, 'd.M.yyyy')
                  : ''}
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.department?.title}
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.publicationNumber?.full}
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small" color="blue400">
                <LinkV2
                  href={linkResolver('ojoiadvert', [ad.id], locale).href}
                  underline="normal"
                  color="blue400"
                  underlineVisibility="always"
                >
                  {ad.title}
                </LinkV2>
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small">{ad.involvedParty?.title}</Text>
            </T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
