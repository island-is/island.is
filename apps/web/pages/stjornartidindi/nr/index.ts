import type { GetServerSideProps } from 'next'
import { parseAsString } from 'next-usequerystate'

import { CustomNextError } from '@island.is/web/units/errors'

const idParser = parseAsString

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const recordIdKey = Object.keys(query).find(
    (key) => key.toLowerCase() === 'recordid',
  )
  const idToUse = recordIdKey
    ? idParser.parseServerSide(query[recordIdKey])
    : null

  if (!idToUse) {
    throw new CustomNextError(404, 'Advert not found')
  }

  const redirectUrl = '/stjornartidindi/nr/' + idToUse
  return {
    redirect: {
      permanent: true,
      destination: redirectUrl,
    },
  }
}

export default () => null
