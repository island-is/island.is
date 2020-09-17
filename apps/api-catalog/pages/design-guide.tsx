import { DesignGuide } from '../screens'
import ContentfulApi from '../services/contentful'

export default DesignGuide

export async function getStaticProps() {
  const client = new ContentfulApi();

  const pageContent = await client.fetchStaticPageBySlug('design-guide', 'is-IS');
  console.log(pageContent);

  return {
    props: {
      pageContent,
    }
  };
}
