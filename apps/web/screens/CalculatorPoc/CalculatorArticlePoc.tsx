import Article from '@island.is/web/screens/Article/Article'
import { GET_CALCULATOR_MOCKS } from '@island.is/web/screens/queries/CalculatorMocks'
import type { Screen } from '@island.is/web/types'

// TEMPORARY — renders the mocked Calculator slices spliced above the body
// of a REAL, already-published article, reusing the real ArticleScreen
// (full site chrome: header, footer, sidebar, breadcrumbs, etc.) unmodified.
// Only `article.body` is touched; everything else is genuinely fetched.
// Delete this screen, its page, and the mock query/resolver/fixtures
// together once real `calculator` Contentful entries exist and can be
// embedded through normal editing instead.
const REAL_ARTICLE_SLUG = 'dvalarleyfi-vegna-serstakra-tengsla'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const CalculatorArticlePoc: Screen = (props) => <Article {...props} />

CalculatorArticlePoc.getProps = async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const props = await Article.getProps({
    ...ctx,
    query: { ...ctx.query, slug: REAL_ARTICLE_SLUG },
  })

  const mockResult = await ctx.apolloClient.query({
    query: GET_CALCULATOR_MOCKS,
  })
  const mocks = mockResult.data?.calculatorMocks ?? []

  const article = props.componentProps?.article
  if (article) {
    props.componentProps.article = {
      ...article,
      body: [...mocks, ...(article.body ?? [])],
    }
  }

  return props
}

export default CalculatorArticlePoc
