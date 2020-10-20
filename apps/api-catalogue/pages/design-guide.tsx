import { GetServerSideProps } from 'next'
import { DesignGuide, DesignGuideProps } from '../screens'
import ContentfulApi from '../services/contentful'

export const getServerSideProps: GetServerSideProps<DesignGuideProps> = async () => {
  const client = new ContentfulApi()
  const locale = 'is-IS'

  const pageContent = await client.fetchPageBySlug('design-guide', locale)

  return {
    props: {
      pageContent: pageContent,
    },
  }
}

export default DesignGuide
