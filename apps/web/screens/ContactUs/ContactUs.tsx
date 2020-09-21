import React, { FC } from 'react'
import { StandardLayout } from '../Layouts/Layouts'
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Logo,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../queries'
import { useNamespace } from '@island.is/web/hooks'
import { ContactUs } from '@island.is/web/components'

interface ContactUsScreenProps {
  namespace: GetNamespaceQuery['getNamespace']
}

export const ContactUsScreen: Screen<ContactUsScreenProps> = ({
  namespace,
}) => {
  const n = useNamespace(namespace)

  return (
    <StandardLayout sidebar={null}>
      <Breadcrumbs>
        <Link href="/">Ísland.is</Link>
        <Link href="/um-island-is">Stafrænt Ísland</Link>
      </Breadcrumbs>
      <Typography variant="h1" as="h1">
        {n('contactUs')}
      </Typography>
      <Typography variant="intro" as="p">
        {n('contactUsIntro')}
      </Typography>
      <Box>
        <ContactUs />
      </Box>
    </StandardLayout>
  )
}

ContactUsScreen.getInitialProps = async ({ apolloClient, locale }) => {
  const namespace = await apolloClient
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Forms',
          lang: locale,
        },
      },
    })
    .then((c) => JSON.parse(c.data.getNamespace.fields))

  return { namespace }
}

export default withMainLayout(ContactUsScreen)
