import React from 'react'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Typography,
  BulletList,
  Bullet,
  ContentBlock,
  Button,
  Box,
  Stack,
  Accordion,
  AccordionItem,
  Blockquote,
} from '@island.is/island-ui/core'
import RichText from '../RichText/RichText'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'
import Statistics from '../Statistics/Statistics'
import Paragraph from '../Paragraph/Paragraph'
import Background from '../Background/Background'
import BorderedContent from '../BorderedContent/BorderedContent'
import Hyperlink from '../Hyperlink/Hyperlink'
import { ContentContainer } from '../ContentContainer/ContentContainer'

const mappedContentfulTypes = {
  article: 'article',
  articleCategory: 'category',
}

const customBlockquoteRenderNode = () => ({
  [BLOCKS.QUOTE]: (node, children) => {
    return (
      <ContentContainer>
        <Blockquote>{children}</Blockquote>
      </ContentContainer>
    )
  },
  [BLOCKS.PARAGRAPH]: (node, children) => children,
})

const embeddedNodes = () => ({
  faqList: {
    component: Box,
    wrapper: ({ children }) => {
      return (
        <Box paddingBottom={20} paddingTop={15}>
          {children}
        </Box>
      )
    },
    children: (node) => {
      const title = node.data?.target?.fields?.title || ''
      const questions = node.data?.target?.fields?.questions || []

      const items = questions
        .map((item) => {
          const question = item.fields.question
          const answer = item.fields.answer
          return { question, answer }
        })
        .filter((question) => question)

      return (
        <ContentContainer>
          <Stack space={6}>
            <Typography variant="h2" as="h2" data-sidebar-scollable>
              <span data-sidebar-link={slugify(title)}>{title}</span>
            </Typography>
            <Accordion>
              {items.map((item, index) => {
                const { answer, question } = item

                return (
                  <AccordionItem
                    key={index}
                    id={`faq_${index}`}
                    label={question}
                  >
                    <RichText
                      document={answer}
                      renderNode={customProcessEntryRenderNode()}
                    />
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Stack>
        </ContentContainer>
      )
    },
  },
  embeddedVideo: {
    component: EmbeddedVideo,
    wrapper: ({ children }) => <ContentContainer>{children}</ContentContainer>,
    processContent: (node) => {
      const { url, title } = node.data.target.fields

      return {
        title,
        url,
      }
    },
  },
  processEntry: {
    component: BorderedContent,
    wrapper: ({ children }) => <Box paddingY={[0, 0, 0, 6]}>{children}</Box>,
    processContent: (node) => {
      const {
        processTitle,
        processDescription,
        processLink,
        processLabel,
        type,
        title,
        subtitle,
        details,
      } = node.data.target.fields

      return {
        showTopContent: details.content.length,
        topContent: (
          <ContentBlock width="small">
            <Stack space={[2, 2]}>
              {title ? (
                <Typography variant="h2" as="h3">
                  <span data-sidebar-link={slugify(title)}>{title}</span>
                </Typography>
              ) : null}
              {subtitle ? (
                <Typography variant="intro" as="p">
                  {subtitle}
                </Typography>
              ) : null}
              <RichText
                document={details}
                renderNode={customProcessEntryRenderNode()}
              />
            </Stack>
          </ContentBlock>
        ),
        bottomContent: (
          <ContentBlock width="small">
            <Stack space={[2, 2]}>
              {type !== 'Only button' && (
                <>
                  <Typography variant="eyebrow" as="h4" color="blue400">
                    Innskráning og umsókn
                  </Typography>
                  {processTitle && (
                    <Typography variant="h3" as="h3">
                      {processTitle}
                    </Typography>
                  )}
                  {processDescription && (
                    <Typography variant="p" as="p">
                      {processDescription}
                    </Typography>
                  )}
                </>
              )}
              {processLink ? (
                <Box paddingTop={[1, 1, 2]}>
                  <Button
                    href={processLink}
                    icon={type === 'Not digital' ? 'info' : 'external'}
                  >
                    {type === 'Only button'
                      ? processTitle
                      : 'Áfram í innskráningu'}
                  </Button>
                </Box>
              ) : null}
            </Stack>
          </ContentBlock>
        ),
      }
    },
  },
  statistics: {
    component: Box,
    children: (node) => {
      return (
        <Background background="dotted" paddingY={[6, 6, 10]} marginTop={5}>
          <ContentContainer marginTop={0}>
            <Statistics
              items={node.data.target.fields.statistics.map((s) => s.fields)}
            />
          </ContentContainer>
        </Background>
      )
    },
  },
})

const defaultRenderNode = (overrides = {}) => {
  const settings = {
    [INLINES.HYPERLINK]: (node, children) => {
      const {
        data: { uri: href },
      } = node

      if (
        !['http://', 'https://'].reduce((hasProtocol, protocol) => {
          if (hasProtocol || href.startsWith(protocol)) {
            return true
          }

          return false
        }, false)
      ) {
        return children
      }

      return <Hyperlink href={href}>{children}</Hyperlink>
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      const {
        data: {
          target: {
            fields: { slug },
            sys: {
              contentType: {
                sys: { id },
              },
            },
          },
        },
      } = node

      return <Hyperlink slug={slug}>{children}</Hyperlink>
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (!children.find((x: string) => x !== '')) {
        return null
      }

      return <Paragraph>{children}</Paragraph>
    },
    [BLOCKS.QUOTE]: (node, children) => {
      return (
        <RichText document={node} renderNode={customBlockquoteRenderNode()} />
      )
    },
    [BLOCKS.HEADING_2]: (node, children) => (
      <ContentContainer>
        <Typography variant="h2" as="h2">
          <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
        </Typography>
      </ContentContainer>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <ContentContainer>
        <Typography variant="h3" as="h3">
          <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
        </Typography>
      </ContentContainer>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ContentContainer>
        <BulletList>{children}</BulletList>
      </ContentContainer>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => {
      return (
        <RichText document={node} renderNode={customListItemRenderNode()} />
      )
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const embeddedNode = embeddedNodes()[
        node.data.target?.sys?.contentType?.sys?.id
      ]

      if (!embeddedNode) return null

      const Component = embeddedNode.component
      const Wrapper = embeddedNode.wrapper
      const Cmp = () => (
        <Component
          {...(embeddedNode.processContent && {
            ...embeddedNode.processContent(node),
          })}
        >
          {embeddedNode.children && embeddedNode.children(node)}
        </Component>
      )

      return Wrapper ? (
        <Wrapper>
          <Cmp />
        </Wrapper>
      ) : (
        <Cmp />
      )
    },
  }

  return {
    ...settings,
    ...overrides,
  }
}

const customListItemRenderNode = () => ({
  ...defaultRenderNode(),
  [BLOCKS.LIST_ITEM]: (node, children) => {
    return <Bullet>{children}</Bullet>
  },
  [BLOCKS.PARAGRAPH]: (node, children) => children,
})

const customProcessEntryRenderNode = () => ({
  ...defaultRenderNode(),
  [BLOCKS.PARAGRAPH]: (node, children) => {
    if (!children.find((x) => x !== '')) {
      return null
    }

    return <Paragraph>{children}</Paragraph>
  },
  [BLOCKS.HEADING_2]: (node, children) => (
    <ContentContainer paddingX="none">
      <Typography variant="h2" as="h2">
        <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
      </Typography>
    </ContentContainer>
  ),
  [BLOCKS.HEADING_3]: (node, children) => (
    <ContentContainer paddingX="none">
      <Typography variant="h3" as="h3">
        {children}
      </Typography>
    </ContentContainer>
  ),
  [BLOCKS.UL_LIST]: (node, children) => (
    <ContentContainer paddingX="none">
      <BulletList>{children}</BulletList>
    </ContentContainer>
  ),
  [BLOCKS.LIST_ITEM]: (node, children) => {
    return <RichText document={node} renderNode={customListItemRenderNode()} />
  },
})

type Props = {
  document: string
}

export const Content: React.FC<Props> = ({ document }) => {
  return <RichText document={document} renderNode={defaultRenderNode()} />
}

export default Content
