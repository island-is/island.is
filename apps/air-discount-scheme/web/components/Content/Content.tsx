import React, { useMemo, ReactNode } from 'react'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import {
  Typography,
  Box,
  Stack,
  Accordion,
  AccordionItem,
  ButtonDeprecated as Button,
  Divider,
} from '@island.is/island-ui/core'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { List, ListItem } from '../List/List'
import { Link } from '..'

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
      const linkText = node.data?.target?.fields?.linkText ?? ''
      const link = node.data?.target?.fields?.link ?? ''
      return (
        <Box
          background="purple100"
          padding={4}
          marginBottom={3}
          borderRadius="standard"
        >
          <Box marginBottom={2}>
            <Typography variant="h4">{title}</Typography>
          </Box>
          <Link href={link}>
            <Button width="fluid">{linkText}</Button>
          </Link>
        </Box>
      )
    },
  },
  linkList: {
    component: Box,
    children: (node) => {
      const title = node.data?.target?.fields?.title ?? ''
      const links = node.data?.target?.fields?.links ?? []
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
                <Link href={url}>{text}</Link>
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
      const { text, url } = node.data?.target?.fields ?? {}
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

const options = (type) => ({
  renderText: (text) =>
    text.split('\n').map((text, i) => [i > 0 && <br key={i} />, text]),
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return (
        <Typography variant="p" links>
          {children}
        </Typography>
      )
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const {
        file: { url },
        title,
      } = node.data.target.fields
      if (type === 'sidebar') {
        return (
          <Box
            textAlign="center"
            padding={3}
            borderStyle="solid"
            borderWidth="standard"
            borderRadius="standard"
            borderColor="dark100"
          >
            <img src={url} alt={title} />
          </Box>
        )
      }
      return (
        <Box marginTop={5}>
          <img src={url} alt={title} />
        </Box>
      )
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const embeddedNode =
        embeddedNodes()[node.data.target?.sys?.contentType?.sys?.id]

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
    [BLOCKS.UL_LIST]: (node, children) => <List>{children}</List>,
    [BLOCKS.OL_LIST]: (node, children) => {
      return <List type="ol">{children}</List>
    },
    [BLOCKS.LIST_ITEM]: (node, children) => {
      return (
        <ListItem>
          <Box marginTop={2}>{children}</Box>
        </ListItem>
      )
    },
    [INLINES.HYPERLINK]: (node, children) => {
      return <Link href={node.data.uri}>{children}</Link>
    },
  },
})

type Props = {
  document: string
  type?: string
  wrapper?: ReactNode
}

export const Content: React.FC<React.PropsWithChildren<Props>> = ({
  document,
  wrapper,
  type,
}) => {
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
      {documentToReactComponents(parsed, options(type))}
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
