import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { useRouter } from 'next/router'

import { MinistryOfJusticeAdvertsResponse } from '@island.is/api/schema'
import { Table as T, Text } from '@island.is/island-ui/core'

import { advertUrl } from './OJOIUtils'

export const OJOISearchListView = ({
  adverts,
}: {
  adverts?: MinistryOfJusticeAdvertsResponse['adverts']
}) => {
  const router = useRouter()

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>Útgáfa</T.HeadData>
          <T.HeadData>Deild</T.HeadData>
          <T.HeadData>Númer</T.HeadData>
          <T.HeadData>Heiti</T.HeadData>
          <T.HeadData>Stofnun</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {adverts?.map((ad) => (
          <T.Row key={ad.id}>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {format(new Date(ad.publicationDate), 'dd.MM.yyyy', {
                  locale: is,
                })}
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
              <Text variant="small">{ad.title}</Text>
            </T.Data>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.involvedParty?.title}
              </Text>
            </T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
