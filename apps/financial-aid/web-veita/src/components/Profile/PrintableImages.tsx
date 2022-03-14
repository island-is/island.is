import React from 'react'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { gql, useQuery } from '@apollo/client'
interface Props {
  images: ApplicationFile[]
}

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlForIdInput!) {
    getSignedUrlForId(input: $input) {
      url
      key
    }
  }
`

const PrintableImages = ({ images }: Props) => {
  const allImages: string[] = []

  images.map((el) => {
    const { data } = useQuery(GetSignedUrlQuery, {
      variables: { input: { id: el.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    if (data?.getSignedUrlForId) {
      allImages.push(data.getSignedUrlForId.url)
    }
  })
  return (
    <>
      {allImages.map((el, index) => {
        return (
          <img
            key={`printable-image-${index}`}
            src={el}
            loading="lazy"
            className="printableImages"
          />
        )
      })}
    </>
  )
}

export default PrintableImages
