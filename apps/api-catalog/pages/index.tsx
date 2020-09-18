import { Home } from '../screens'
import ContentfulApi from '../services/contentful'

export default Home


export async function getStaticProps() {
  const client = new ContentfulApi();

  const pageContent = await client.fetchStaticPageBySlug('home', 'is-IS');
  console.log(pageContent);

  return {
    props: {
      pageContent,
    }
  };
}