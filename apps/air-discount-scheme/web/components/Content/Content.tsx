import React, { useMemo, ReactNode } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'
import {
  Typography,
  Box,
  Stack,
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Bullet,
  BulletList,
} from '@island.is/island-ui/core'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Link from 'next/link'

const embeddedNodes = () => ({
  faqList: {
    component: Box,
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
        <Box paddingBottom={5} paddingTop={5}>
          <Stack space={3}>
            <Typography variant="h2" as="h2">
              <span>{title}</span>
            </Typography>
            <Accordion dividerOnTop={false}>
              {items.map((item, index) => {
                const { answer, question } = item
                return (
                  <AccordionItem
                    key={index}
                    id={`faq_${index}`}
                    label={question}
                  >
                    <Content
                      document={answer}
                      wrapper={(children) => (
                        <Stack space={3}>{children}</Stack>
                      )}
                    />
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Stack>
        </Box>
      )
    },
  },
  card: {
    component: Box,
    children: (node) => {
      const title = node.data?.target?.fields?.title ?? ''
      const linkText = node.data?.target?.fields?.linkText
      const link = node.data?.target?.fields?.link
      return (
        <Box
          background="purple100"
          padding={4}
          marginBottom={3}
          borderRadius="standard"
        >
          <Box marginBottom={2}>
            <Typography variant="h4">{linkText}</Typography>
          </Box>
          <Link href={link}>
            <Button width="fluid">{title}</Button>
          </Link>
        </Box>
      )
    },
  },
  linkList: {
    component: Box,
    children: (node) => {
      const title = node.data?.target?.fields?.title ?? ''
      const links = node.data?.target?.fields?.links
      return (
        <Box
          background="purple100"
          padding={4}
          marginBottom={3}
          borderRadius="standard"
        >
          <Stack space={2}>
            <Typography variant="h4">{title}</Typography>
            <Divider weight="alternate" />
            {links.map(({ fields: { text, url } }, index) => (
              <Typography variant="p" color="blue400" key={index}>
                <Link href={url}>
                  <a>{text}</a>
                </Link>
              </Typography>
            ))}
          </Stack>
        </Box>
      )
    },
  },
  link: {
    component: Box,
    children: (node) => {
      const { text, url } = node.data?.target?.fields
      return (
        <Link href={url}>
          <Button variant="text" icon="arrowRight">
            {text}
          </Button>
        </Link>
      )
    },
  },
})

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return (
        <Typography variant="p" links>
          {children}
        </Typography>
      )
    },
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
      const { url, title } = node.data.target.fields.file
      return <img src={url} alt={title} />
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const embeddedNode = embeddedNodes()[
        node.data.target?.sys?.contentType?.sys?.id
      ]

      if (!embeddedNode) return null

      const Component = embeddedNode.component
      const Cmp = () => (
        <Component
          {...(embeddedNode.processContent && {
            ...embeddedNode.processContent(node),
          })}
        >
          {embeddedNode.children && embeddedNode.children(node)}
        </Component>
      )

      return <Cmp />
    },
    [BLOCKS.UL_LIST]: (node, children) => <BulletList>{children}</BulletList>,
    [BLOCKS.OL_LIST]: (node, children) => {
      return <BulletList type="ol">{children}</BulletList>
    },
    [BLOCKS.LIST_ITEM]: (node, children) => {
      return <Bullet>{children}</Bullet>
    },
  },
}

type Props = {
  document: string
  wrapper?: ReactNode
}

export const Content: React.FC<Props> = ({ document, wrapper }) => {
  const parsed = useMemo(() => {
    if (typeof document === 'object') {
      return document
    } else if (typeof document === 'string' && document[0] === '{') {
      return JSON.parse(document)
    }
    return null
  }, [document])
  return (
    <ConditionalWrapper cmp={wrapper}>
      {documentToReactComponents(parsed, options)}
    </ConditionalWrapper>
  )
}

const ConditionalWrapper = ({ cmp: Cmp, children }) => {
  if (Cmp) {
    return Cmp(children)
  }
  return children
}

export default Content
