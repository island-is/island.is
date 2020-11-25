import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'

const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  title: string
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({ title }) => {
  const { disableApiCatalog: disablePage } = publicRuntimeConfig
  
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  return <h1>{title}</h1>
}

ApiCatalogue.getInitialProps = async ({ apolloClient, locale, query }) => {
  return {
    title: 'Vörulisti Vefþjónusta',
  }
}

export default withMainLayout(ApiCatalogue)
