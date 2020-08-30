import React, { FC, ReactNode } from 'react'
import slugify from '@sindresorhus/slugify'
import BorderedContent from '../BorderedContent/BorderedContent'
import {
  Typography,
  ContentBlock,
  Button,
  Box,
  Stack,
} from '@island.is/island-ui/core'
import { Html } from '@island.is/api/schema'
import { renderHtml } from '../richTextRendering'

const ProcessTypes = {
  Digital: {
    icon: 'external',
    title: 'Stafræn umsókn',
  },
  'Digital w/login': {
    icon: 'external',
    title: 'Aðgangsstýrð stafræn umsókn',
  },
  'Not digital': {
    icon: 'info',
    title: 'Handvirk umsókn',
  },
  'Not digital w/login': {
    icon: 'external',
    title: 'Handvirk umsókn með innskráningu',
  },
  'No type': {
    icon: 'external',
    title: '',
  },
}

interface ProcessEntryProps {
  processTitle: string
  processInfo?: Html
  processLink: string
  buttonText: string
  type: string
  title: string
  subtitle?: string
  details?: Html
}

export const ProcessEntry: FC<ProcessEntryProps> = ({
  processTitle,
  processInfo,
  processLink,
  buttonText,
  type,
  title,
  subtitle,
  details,
}) => {
  return (
    <BorderedContent
      topContent={
        <ContentBlock width="small">
          <Stack space={[2, 2]}>
            {title && (
              <Typography variant="h2" as="h3">
                <span data-sidebar-link={slugify(title)}>{title}</span>
              </Typography>
            )}
            {subtitle && (
              <Typography variant="intro" as="p">
                {subtitle}
              </Typography>
            )}
            {details && renderHtml(details.document)}
          </Stack>
        </ContentBlock>
      }
      bottomContent={
        <ContentBlock width="small">
          <Stack space={[2, 2]}>
            {type !== 'No type' && (
              <Typography variant="eyebrow" as="h4" color="blue400">
                {ProcessTypes[type].title}
              </Typography>
            )}
            {processTitle && (
              <Typography variant="h3" as="h3">
                {processTitle}
              </Typography>
            )}
            {processInfo && renderHtml(processInfo.document)}
            <Box paddingTop={[1, 1, 2]}>
              <Button href={processLink} icon={ProcessTypes[type].icon}>
                {buttonText}
              </Button>
            </Box>
          </Stack>
        </ContentBlock>
      }
    />
  )
}

export default ProcessEntry
