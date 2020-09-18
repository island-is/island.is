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

function DesignGuide({ pageContent }) {
  const guideButton = pageContent.buttons.find(b => b.id ==='ext-design-guide');

  return (
    <Layout left={
      <Box>
        <Box marginBottom={4}>
          <Breadcrumbs>
              <a href="/">
                Ísland.is
              </a>
              <span>{pageContent.title}</span>
          </Breadcrumbs>
        </Box>
        <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
          <Stack space={5}>
            <Stack space={3}>
              <Typography variant="h1">
                {pageContent.title}
              </Typography>
            </Stack>
            <Stack space={3}>
              <Typography variant="intro">
                {pageContent.introText}
              </Typography>
              <Typography variant="p">
                {pageContent.body}
              </Typography>
            </Stack>
            <Stack space={3}>
              <Link href={guideButton.linkUrl}>
                <Button variant="normal" icon="external">
                  {guideButton.label}
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Box>
    } />
  );
}

export default DesignGuide;