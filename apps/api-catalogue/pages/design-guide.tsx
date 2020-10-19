import { GetStaticProps } from 'next'
import { DesignGuide, DesignGuideProps } from '../screens'
import ContentfulApi from '../services/contentful'

export const getStaticProps: GetStaticProps<DesignGuideProps> = async () => {
  const client = new ContentfulApi()
  let locale = 'is-IS'

  const pageContent = await client.fetchPageBySlug('design-guide', locale)

  return {
    props: {
      pageContent: pageContent,
    },
  }
}

export default DesignGuide
