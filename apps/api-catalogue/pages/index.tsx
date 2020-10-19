import { Home } from '../screens';
import ContentfulApi from '../services/contentful';

export async function getStaticProps() {
  const client = new ContentfulApi();
  let locale = 'is-IS';

  const pageContent = await client.fetchPageBySlug('home', locale);

  return {
    props: {
      pageContent: pageContent
    }
  }
}

export default Home
