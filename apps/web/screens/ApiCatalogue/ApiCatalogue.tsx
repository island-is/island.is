import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  title: string
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({ title }) => {
  return (
    <h1>{title}</h1>
  )
}

ApiCatalogue.getInitialProps = async({ apolloClient, locale, query }) => {
  return {
    title: "Vörulisti Vefþjónusta"
  }
}

export default withMainLayout(ApiCatalogue)