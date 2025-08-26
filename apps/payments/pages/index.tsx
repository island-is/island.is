import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    notFound: true,
  }
}

export default function HomePage() {
  return null
}
