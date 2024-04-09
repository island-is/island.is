import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context.req.url?.split('/s/haskolanam/')[1]
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
