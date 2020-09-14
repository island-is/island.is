import React, { FC, ReactNode } from 'react'
import slugify from '@sindresorhus/slugify'
import BorderedContent from '../BorderedContent/BorderedContent'
import {
  Typography,
  Button,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Html } from '@island.is/api/schema'
import { renderHtml } from '../richTextRendering'

const Content: React.FC = ({ children }) => (
  <GridRow>
    <GridColumn span={['8/8', '8/8', '6/8']} offset={['0', '0', '1/8']}>
      {children}
    </GridColumn>
  </GridRow>
)

export const ProcessTypes = {
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
        // top part should not be visible unless there's text content (details) to show
        Boolean(details) && (
          <Content>
            <Stack space={[2, 2]}>
              {title && (
                <Typography variant="h2" as="h3">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="intro" as="p">
                  {subtitle}
                </Typography>
              )}
              {renderHtml(details.document)}
            </Stack>
          </Content>
        )
      }
      bottomContent={
        <Content>
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
              <Button
                width="fixed"
                href={processLink}
                icon={ProcessTypes[type].icon}
              >
                {buttonText}
              </Button>
            </Box>
          </Stack>
        </Content>
      }
    />
  )
}

export default ProcessEntry
