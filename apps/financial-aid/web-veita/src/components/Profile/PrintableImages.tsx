import React from 'react'
import { Box } from '@island.is/island-ui/core'
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
  console.log(images)

  images.map((el) => {
    const { data, loading: loadingUser } = useQuery(GetSignedUrlQuery, {
      variables: { input: { id: el.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    console.log(data)
  })

  // const [data] = useQuery(GetSignedUrlQuery, {
  //   fetchPolicy: 'no-cache',
  //   onCompleted: (data: { getSignedUrlForId: { url: string } }) => {
  //     return data.getSignedUrlForId.url
  //   },
  //   onError: (error) => {
  //     // TODO: What should happen here?
  //     console.log(error)
  //   },
  // })
  return (
    <>
      <Box>jasjdja</Box>
    </>
  )
}

export default PrintableImages
