import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/en/university-studies',
      permanent: false,
    },
  }
}

export default () => {
  return null
}
