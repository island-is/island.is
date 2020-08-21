import React from 'react'
import gql from 'graphql-tag'
import { Screen } from '../../types'

const Home: Screen = (props) =>  {
  console.log(props)
  return <div>Home</div>
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const {
    data: { getGenericPage: page },
  } = await apolloClient
    .query({
      query: gql`
      query {
        getGenericPage(
          input: { slug: "loftbru", lang: "is-IS" }
        ) {
          slug
          title
          mainContent
          sidebar
          misc
        }
      }
      `
    })
  return {
    page
  }
}

export default Home
