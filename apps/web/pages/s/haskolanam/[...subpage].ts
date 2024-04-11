import { GetServerSideProps } from 'next'

import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = safelyExtractPathnameFromUrl(context.req.url).split(
    '/s/haskolanam/',
  )[1]
  return {
    redirect: {
      destination: `/haskolanam/${path || ''}`,
      permanent: false,
    },
  }
}

export default () => {
  return null
}
