import { GetServerSideProps } from 'next'

import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = safelyExtractPathnameFromUrl(context.req.url).split(
    '/en/o/university-studies/',
  )[1]
  return {
    redirect: {
      destination: `/en/university-studies/${path || ''}`,
      permanent: false,
    },
  }
}

export default () => {
  return null
}
