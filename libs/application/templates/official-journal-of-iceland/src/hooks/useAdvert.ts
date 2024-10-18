import { useQuery } from '@apollo/client'
import { ADVERT_QUERY } from '../graphql/queries'
import {
  OfficialJournalOfIcelandAdvert,
  OfficialJournalOfIcelandAdvertResponse,
} from '@island.is/api/schema'

type AdvertResponse = {
  officialJournalOfIcelandAdvert: OfficialJournalOfIcelandAdvertResponse
}

type Props = {
  advertId: string | undefined | null
  onCompleted?: (data: OfficialJournalOfIcelandAdvert) => void
}

export const useAdvert = ({ advertId, onCompleted }: Props) => {
  const { data, error, loading } = useQuery<AdvertResponse>(ADVERT_QUERY, {
    skip: !advertId,
    variables: {
      params: {
        id: advertId,
      },
    },
    onCompleted: (data) => {
      if (onCompleted) {
        onCompleted(data.officialJournalOfIcelandAdvert.advert)
      }
    },
  })

  return {
    advert: data?.officialJournalOfIcelandAdvert,
    error,
    loading,
  }
}
