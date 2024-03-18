import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { MinistryOfJusticeAdvertsResponse } from '@island.is/api/schema'
import { Link, Table as T, Text } from '@island.is/island-ui/core'

import { advertUrl } from './OJOIUtils'

export const OJOISearchListView = ({
  adverts,
}: {
  adverts?: MinistryOfJusticeAdvertsResponse['adverts']
}) => {
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
              <Text variant="small" /*truncate whiteSpace="nowrap"*/>
                <Link
                  href={advertUrl + '/' + ad.id}
                  underline="normal"
                  color="blue400"
                >
                  {ad.title}
                </Link>
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small" /*truncate whiteSpace="nowrap"*/>
                {ad.involvedParty?.title}
              </Text>
            </T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
