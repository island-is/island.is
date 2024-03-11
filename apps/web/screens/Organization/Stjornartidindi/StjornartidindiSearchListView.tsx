import { useRouter } from 'next/router'

import { Table as T, Text } from '@island.is/island-ui/core'

import {
  AdvertType,
  stjornartidindiAdvertUrl,
} from '../../../components/Stjornartidindi'

export const StjornartidindiSearchListView = ({
  adverts,
}: {
  adverts: Array<AdvertType>
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
        {adverts.map((ad) => (
          <T.Row key={ad.id}>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.utgafa}
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.deild}
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.numer}
              </Text>
            </T.Data>
            <T.Data>
              <Text variant="small">{ad.heiti}</Text>
            </T.Data>
            <T.Data>
              <Text variant="small" whiteSpace="nowrap">
                {ad.stofnun}
              </Text>
            </T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
