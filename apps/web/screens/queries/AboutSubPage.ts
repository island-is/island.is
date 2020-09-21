import React from 'react'
import { Screen } from '@island.is/web/types'

export interface AboutSubPageProps {
  page: any
}

export const AboutSubPage: Screen<AboutSubPageProps> = ({}) => {
}

AboutSubPage.getInitialProps = ({ }) => {
  // const { data: { getAboutSubPage: page } } = await apolloClient.query<GetAboutPage
}

export default AboutSubPage
