import type { GetServerSideProps } from 'next'
import { parseAsString } from 'next-usequerystate'

import { CustomNextError } from '@island.is/web/units/errors'

const idParser = parseAsString

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const recordId = idParser.parseServerSide(query.recordId)
  const recordIdCapitalized = idParser.parseServerSide(query.RecordId)
  const idToUse = recordIdCapitalized || recordId
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
