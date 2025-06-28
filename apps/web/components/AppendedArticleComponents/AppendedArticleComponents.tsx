import React from 'react'
import dynamic from 'next/dynamic'

import { GetSingleArticleQuery } from '../../graphql/schema'

const IcelandicNamesSearcher = dynamic(
  () => import('../IcelandicNamesSearcher/IcelandicNamesSearcher'),
  {
    ssr: false,
  },
)

type Article = GetSingleArticleQuery['getSingleArticle']

interface Props {
  article: Article
}

export const AppendedArticleComponents = ({ article }: Props) => {
  switch (article?.id) {
    /*+
     * For the "Leit í mannanafnaskrá" article
     */
    case '7MBtMazhYUNNJJIOJNnNI':
      return <IcelandicNamesSearcher />
    default:
      return null
  }
}

export default AppendedArticleComponents
