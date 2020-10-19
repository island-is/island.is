<<<<<<< HEAD
import { ServiceDetail } from '../../screens'
import ContentfulApi from '../../services/contentful'

export async function getStaticProps() {
  const client = new ContentfulApi()
  let locale = 'is-IS'

  const filterStrings = await client.fetchPageBySlug('service-filter', locale)

  return {
    props: {
      filterStrings: filterStrings,
    },
=======
import { ServiceDetail } from '../../screens';
import ContentfulApi from '../../services/contentful';

export async function getStaticProps() {
  const client = new ContentfulApi();
  let locale = 'is-IS';

  const filterStrings = await client.fetchPageBySlug('service-filter', locale);

  return {
    props: {
      filterStrings: filterStrings
    }
>>>>>>> 7169a78a10764498308c74219167d483f4729e23
  }
}

export default ServiceDetail
