import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context.req.url?.split('/en/o/university-studies/')[1]
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
