import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/haskolanam',
      permanent: false,
    },
  }
}

export default () => {
  return null
}
