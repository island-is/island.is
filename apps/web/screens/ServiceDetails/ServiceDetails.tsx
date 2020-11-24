import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD SERVICE DETAILS INTO THE WEB */

interface ServiceDetailsProps {
  title: string
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({ title }) => {
  return (
    <h1>{title}</h1>
  )
}

ServiceDetails.getInitialProps = async({ apolloClient, locale, query }) => {
  return {
    title: "Vefþjónusta - nánari lýsing"
  }
}

export default withMainLayout(ServiceDetails)