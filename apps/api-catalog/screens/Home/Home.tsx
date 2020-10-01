import React from 'react';
import { Card } from '../../components';
import {
  Box,
  Stack,
  Typography,
  Columns,
  Breadcrumbs
} from '@island.is/island-ui/core';

import { HomeLayout } from '../../components'

import * as styles from './Home.treat';
import cn from 'classnames';

import ContentfulApi from '../../services/contentful';
import { Page } from '../../services/contentful.types';

export interface HomeProps {
  pageContent: Page
}

function Home(props: HomeProps) {

  return (
    <Box className={cn(styles.homePage)}>
      <HomeLayout left={
        <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={3}>
              <Breadcrumbs>
                Vefþjónustur
              </Breadcrumbs>
              <Typography variant="h1">
                {props.pageContent.strings.find(s => s.id === 'home-title').text}
              </Typography>
              <Typography variant="intro">
                {props.pageContent.strings.find(s => s.id === 'home-intro').text}
              </Typography>
            </Stack>
        </Box>
      } 
      right={
        <img src='/frame.png' alt='Viskuausan' />
      } />
      <Box marginTop="gutter" marginBottom={[3, 3, 3, 12]}>
        <Columns align="center" collapseBelow="lg">
          <Card 
            title={props.pageContent.strings.find(s => s.id === 'home-catalog-button').text} 
            slug='services'
            text={props.pageContent.strings.find(s => s.id === 'home-cata-btn-txt').text}
          />
          <Card 
            title={props.pageContent.strings.find(s => s.id === 'home-dm-button').text} 
            slug='data-models' 
            text={props.pageContent.strings.find(s => s.id === 'home-dm-btn-txt').text}
            />
          <Card 
            title={props.pageContent.strings.find(s => s.id === 'home-dg-button').text} 
            slug='design-guide' 
            text={props.pageContent.strings.find(s => s.id === 'home-dg-btn-txt').text}
          />
        </Columns>
      </Box>
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
