import React from 'react'
import { Card } from '../../components'
import {
  Box,
  Stack,
  Typography,
  Columns,
} from '@island.is/island-ui/core'

import ContentfulApi from '../../services/contentful';
import { Page } from '../../services/contentful.types';

export interface HomeProps {
  pageContent: Page
}

function Home(props: HomeProps) {

  return (
      <Box marginBottom={[3, 3, 3, 12]} marginTop={1} textAlign="center">
        <Stack space={5}>
          <Stack space={3}>
            <Typography variant="h1">
              {props.pageContent.strings.find(s => s.id === 'home-title').text}
            </Typography>
          </Stack>
          <Stack space={3}>
            <Typography variant="intro">
              {props.pageContent.strings.find(s => s.id === 'home-intro').text}
            </Typography>
          </Stack>
          <Box marginTop="gutter">
            <Columns align="center">
              <Card title={props.pageContent.strings.find(s => s.id === 'home-catalog-button').text} slug='services' />
              <Card title={props.pageContent.strings.find(s => s.id === 'home-dm-button').text} slug='data-models' />
              <Card title={props.pageContent.strings.find(s => s.id === 'home-dg-button').text} slug='design-guide' />
            </Columns>
          </Box>
        </Stack>
      </Box>
  )
}

Home.getInitialProps = async (ctx) => {
  const client = new ContentfulApi();
  let locale = 'is-IS';

  const pathLocale = ctx.pathname.split('/')[1];
  if (pathLocale === 'en') {
    locale = 'en-GB';
  }

  const pageContent = await client.fetchPageBySlug('home', locale);
  console.log(pageContent);

  return {
    pageContent: pageContent
  }
}

export default Home
