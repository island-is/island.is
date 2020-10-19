import { GetStaticProps } from 'next'
import { Home, HomeProps } from '../screens'
import ContentfulApi from '../services/contentful'

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const client = new ContentfulApi()
  const locale = 'is-IS'

  const pageContent = await client.fetchPageBySlug('home', locale)

  return {
    props: {
      pageContent: pageContent,
    },
  }
}

export default Home
