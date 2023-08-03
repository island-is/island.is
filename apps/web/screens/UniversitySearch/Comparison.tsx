import React from 'react'
import { useRouter } from 'next/router'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GetServerSideProps } from 'next'

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   res,
//   apolloClient,
// }) => {
//   return { props: {} }
// }

const Comparison = () => {
  const router = useRouter()
  console.log(router.query)
  return <div></div>
}

interface Props {
  query?: any
  apolloClient: any
  locale: any
}

Comparison.getInitialProps = async ({ query, apolloClient, locale }: Props) => {
  console.log('req', query)
  return {}
}

export default withMainLayout(Comparison)
