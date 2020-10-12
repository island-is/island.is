import React from 'react';
import { Layout } from '../../components';
import {
  Box,
  Breadcrumbs,
  Stack,
  Typography,
  Button,
  Link
} from '@island.is/island-ui/core';

import ContentfulApi from '../../services/contentful';
import { Page } from '../../services/contentful.types';

export interface DesignGuideProps {
  pageContent: Page
}

function DesignGuide(props: DesignGuideProps) {
  return (
    <Layout left={
      <Box>
        <Box marginBottom={2}>
          <Breadcrumbs>
              <a href="/">
                Ísland.is
              </a>
              <span>{props.pageContent.strings.find(s => s.id ==='dg-title').text}</span>
          </Breadcrumbs>
        </Box>
        <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
          <Stack space={5}>
            <Stack space={3}>
              <Typography variant="h1">
              {props.pageContent.strings.find(s => s.id ==='dg-title').text}
              </Typography>
            </Stack>
            <Stack space={3}>
              <Typography variant="intro">
              {props.pageContent.strings.find(s => s.id ==='dg-intro').text}
              </Typography>
              <Typography variant="p">
              {props.pageContent.strings.find(s => s.id ==='dg-body').text}
              </Typography>
            </Stack>
            <Stack space={3}>
              <Link href={props.pageContent.strings.find(s => s.id ==='dg-view-button-href').text}>
                <Button variant="normal" icon="external">
                {props.pageContent.strings.find(s => s.id ==='dg-view-button').text}
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Box>
    } />
  );
}

DesignGuide.getInitialProps = async (ctx) => {
  const client = new ContentfulApi();
  let locale = 'is-IS';

  const pathLocale = ctx.pathname.split('/')[1];
  if (pathLocale === 'en') {
    locale = 'en-GB';
  }

  const pageContent = await client.fetchPageBySlug('design-guide', locale);

  return {
    pageContent: pageContent
  }
}

export default DesignGuide;
