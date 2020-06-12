import React, { FC } from 'react'
import RichText from '../RichText/RichText'
import Link from 'next/link'
import { BLOCKS } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Typography,
  BulletList,
  Bullet,
  ContentBlock,
  Button,
  Box,
  Stack,
  BoxProps,
} from '@island.is/island-ui/core'
import { BorderedContent } from '../../components'

/* const ContentSection: FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props}>
    <Box padding={[3, 3, 6, 0]}>
      <ContentBlock width="small">{children}</ContentBlock>
    </Box>
  </Box>
) */

const embeddedNodes = {
  processEntry: {
    component: BorderedContent,
    wrapper: ({ children }) => <Box paddingY={[0, 0, 0, 6]}>{children}</Box>,
    processContent: (node) => {
      const {
        processTitle,
        processDescription,
        processLink,
        type,
        title,
        subtitle,
      } = node.data.target.fields

      return {
        topContent: (
          <ContentBlock width="small">
            <Stack space={[2, 2]}>
              <Typography variant="h2" as="h3">
                {subtitle || 'subtitle'}
              </Typography>
              <Typography variant="intro" as="p">
                {title || 'title'}
              </Typography>
            </Stack>
          </ContentBlock>
        ),
        bottomContent: (
          <ContentBlock width="small">
            <Stack space={[2, 2]}>
              <Typography variant="eyebrow" as="h4">
                Innskráning og umsókn
              </Typography>
              <Typography variant="h3" as="h3">
                {processTitle || 'processTitle'}
              </Typography>
              <Typography variant="p" as="p">
                {processDescription || 'processDescription'}
              </Typography>
              <Box paddingTop={[1, 1, 2]}>
                <Link href={processLink} passHref>
                  <Button icon={type === 'Not digital' ? 'info' : 'external'}>
                    Áfram í innskráningu
                  </Button>
                </Link>
              </Box>
            </Stack>
          </ContentBlock>
        ),
      }
    },
  },
}

const renderNode = {
  [BLOCKS.PARAGRAPH]: (node, children) => (
    <Box paddingY={1}>
      <Typography variant="p" as="p">
        {children}
      </Typography>
    </Box>
  ),
  [BLOCKS.HEADING_2]: (node, children) => {
    return (
      <Typography variant="h2" as="h2">
        <span id={slugify(children.join(''))}>{children}</span>
      </Typography>
    )
  },
  [BLOCKS.HEADING_3]: (node, children) => (
    <Typography variant="h3" as="h3">
      {children}
    </Typography>
  ),
  [BLOCKS.UL_LIST]: (node, children) => (
    <Box paddingY={3}>
      <BulletList>{children}</BulletList>
    </Box>
  ),
  [BLOCKS.LIST_ITEM]: (node, children) => <Bullet>{children}</Bullet>,
  [BLOCKS.EMBEDDED_ENTRY]: (node) => {
    const embeddedNode =
      embeddedNodes[node.data.target?.sys?.contentType?.sys?.id]

    if (!embeddedNode) return null

    const Component = embeddedNode.component
    const Wrapper = embeddedNode.wrapper
    const Cmp = () => <Component {...embeddedNode.processContent(node)} />

    return Wrapper ? (
      <Wrapper>
        <Cmp />
      </Wrapper>
    ) : (
      <Cmp />
    )
  },
}

type Props = {
  document: string
}

export const Content: React.FC<Props> = ({ document }) => (
  <RichText document={document} renderNode={renderNode} />
)

export default Content
