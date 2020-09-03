import React from 'react'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import {
  Typography,
  BulletList,
  Bullet,
  Box,
  Stack,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import RichText from '../RichText/RichText'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'
import Hyperlink from '../Hyperlink/Hyperlink'

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
      const questions = node.data?.target?.fields?.questions || []
      const items = questions
        .map((item) => {
          const question = item.fields.question
          const answer = item.fields.answer
          return { question, answer }
        })
        .filter((question) => question)

      return (
        <Stack space={6}>
          <Typography variant="h2" as="h2"></Typography>
          <Accordion>
            {items.map((item, index) => {
              const { answer, question } = item

              return (
                <AccordionItem key={index} id={`faq_${index}`} label={question}>
                  <RichText
                    document={answer}
                    renderNode={defaultRenderNode()}
                  />
                </AccordionItem>
              )
            })}
          </Accordion>
        </Stack>
      )
    },
  },
  embeddedVideo: {
    component: EmbeddedVideo,
    processContent: (node) => {
      const { url, title } = node.data.target.fields

      return {
        title,
        url,
      }
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
          },
        },
      } = node

      return <Hyperlink slug={slug}>{children}</Hyperlink>
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (!children.find((x: string) => x !== '')) {
        return null
      }

      return <Typography variant="p">{children}</Typography>
    },
    [BLOCKS.HEADING_2]: (node, children) => (
      <Typography variant="h2" as="h2">
        {children}
      </Typography>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Typography variant="h3" as="h3">
        {children}
      </Typography>
    ),
    [BLOCKS.UL_LIST]: (node, children) => <BulletList>{children}</BulletList>,
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

type Props = {
  document: string
}

export const Content: React.FC<Props> = ({ document }) => {
  return <RichText document={document} renderNode={defaultRenderNode()} />
}

export default Content
