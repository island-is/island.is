// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck make web strict
import React, { FC, ReactNode, ReactElement } from 'react'
import { Document, Node, BLOCKS, INLINES } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Text,
  BulletList,
  Bullet,
  ButtonDeprecated as Button,
  Box,
  Accordion,
  AccordionItem,
  Blockquote,
  GridContainer,
  GridRow,
  GridColumn,
  IconTypesDeprecated,
  BoxProps,
} from '@island.is/island-ui/core'
import RichText from '../RichText/RichText'
import EmbeddedVideo, {
  EmbeddedVideoProps,
} from '../EmbeddedVideo/EmbeddedVideo'
import Statistics from '../Statistics/Statistics'
import Paragraph from '../Paragraph/Paragraph'
import Background from '../Background/Background'
import BorderedContent, {
  BorderedContentProps,
} from '../BorderedContent/BorderedContent'
import Hyperlink from '../Hyperlink/Hyperlink'
import { RenderNode } from '@contentful/rich-text-react-renderer'

const ContentWrap: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <GridRow>
    <GridColumn span={['8/8', '8/8', '7/8']} offset={['0', '0', '1/8']}>
      {children}
    </GridColumn>
  </GridRow>
)

const ProcessEntryWrap: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
  <GridRow>
    <GridColumn span={['8/8', '8/8', '6/8']} offset={['0', '0', '1/8']}>
      {children}
    </GridColumn>
  </GridRow>
)

const customBlockquoteRenderNode = {
  [BLOCKS.QUOTE]: (node: Node, children: ReactNode) => {
    return <Blockquote>{children}</Blockquote>
  },
  [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => children,
} as RenderNode

type ProcessType = {
  icon: string
  title: string
}

const processTypes = {
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
} as { [key: string]: ProcessType }

interface EmbeddedNode {
  component: FC<
    React.PropsWithChildren<
      EmbeddedVideoProps | BoxProps | BorderedContentProps
    >
  >
  wrapper?: ({ children }: { children: ReactNode }) => ReactElement
  children?: (node: Node) => ReactNode
  processedProps?: (node: Node) => { [key: string]: ReactNode }
}

const embeddedNodes = {
  faqList: {
    component: Box,
    wrapper: ({ children }: { children: ReactNode }) => {
      return <Box paddingY={10}>{children}</Box>
    },
    children: (node: Node) => {
      const title = node.data?.target?.fields?.title || ''
      const questions = node.data?.target?.fields?.questions || []

      const items = questions
        .map((item: { fields: { question: string; answer: string } }) => {
          const question = item.fields.question
          const answer = item.fields.answer
          return { question, answer }
        })
        .filter((question: string) => question)

      return (
        <ContentWrap>
          <Text
            id={slugify(title)}
            variant="h2"
            as="h2"
            data-sidebar-scollable
            paddingBottom={4}
          >
            <span data-sidebar-link={slugify(title)}>{title}</span>
          </Text>
          <Accordion>
            {items.map(
              (
                item: { answer: string; question: string },
                index: string | number | undefined,
              ) => {
                const { answer, question } = item

                return (
                  <AccordionItem
                    key={index}
                    id={`faq_${index}`}
                    label={question}
                  >
                    <RichText
                      document={answer}
                      renderNode={customProcessEntryRenderNode}
                    />
                  </AccordionItem>
                )
              },
            )}
          </Accordion>
        </ContentWrap>
      )
    },
  },
  embeddedVideo: {
    component: EmbeddedVideo,
    processedProps: (node: Node) => {
      const { url, title } = node.data.target.fields

      return {
        title,
        url,
      }
    },
  },
  processEntry: {
    component: BorderedContent,
    wrapper: ({ children }: { children: ReactNode }) => (
      <Box paddingY={[2, 3, 6]}>{children}</Box>
    ),
    processedProps: (node: Node) => {
      const {
        processTitle,
        processLink,
        buttonText,
        type,
        title,
        subtitle,
        details,
      } = node.data.target.fields

      return {
        topContent: (
          <ProcessEntryWrap>
            {title && (
              <Text id={slugify(title)} variant="h2" as="h3" paddingBottom={2}>
                <span data-sidebar-link={slugify(title)}>{title}</span>
              </Text>
            )}
            {subtitle && <Text variant="intro">{subtitle}</Text>}
            <RichText
              document={details}
              renderNode={customProcessEntryRenderNode}
            />
          </ProcessEntryWrap>
        ),
        bottomContent: (
          <ProcessEntryWrap>
            {type !== 'No type' && (
              <Text variant="eyebrow" as="h4" color="blue400" paddingBottom={1}>
                {processTypes[type].title}
              </Text>
            )}
            {processTitle && (
              <Text variant="h3" as="h3" paddingBottom={1}>
                {processTitle}
              </Text>
            )}
            <Box paddingTop={[1, 1, 2]}>
              <Button
                href={processLink}
                icon={processTypes[type].icon as IconTypesDeprecated}
              >
                {buttonText}
              </Button>
            </Box>
          </ProcessEntryWrap>
        ),
      }
    },
  },
  statistics: {
    component: Box,
    content: (node: Node) => {
      return (
        <Background
          backgroundPattern="dotted"
          paddingY={[6, 6, 10]}
          marginTop={5}
        >
          <Statistics
            statistics={node.data.target.fields.statistics.map(
              (s: { fields: object }) => s.fields,
            )}
          />
        </Background>
      )
    },
  },
  sectionWithImage: {
    component: Box,
    content: (node: Node) => {
      const fields = node.data.target.fields
      if (!fields.image) {
        return (
          <>
            <Text
              id={slugify(fields.title)}
              variant="h2"
              as="h2"
              paddingTop={2}
              paddingBottom={2}
            >
              <span data-sidebar-link={slugify(fields.title)}>
                {fields.title}
              </span>
            </Text>
            <Content document={fields.body} />
          </>
        )
      }

      return (
        <Box paddingTop={15}>
          <GridContainer>
            <GridRow>
              <GridColumn span="4/12">
                <img src={fields.image.fields.file.url + '?w=320'} alt="" />
              </GridColumn>
              <GridColumn span="8/12">
                <Text
                  id={slugify(fields.title)}
                  variant="h2"
                  as="h2"
                  paddingBottom={2}
                >
                  <span data-sidebar-link={slugify(fields.title)}>
                    {fields.title}
                  </span>
                </Text>
                <Content document={fields.body} />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )
    },
  },
} as { [key: string]: EmbeddedNode }

const defaultRenderNode = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  [INLINES.HYPERLINK]: (node: Node, children: ReactNode) => {
    return <Hyperlink href={node.data.uri}>{children}</Hyperlink>
  },
  [INLINES.ENTRY_HYPERLINK]: (node: Node, children: ReactNode) => {
    const {
      data: {
        target: {
          fields: { slug },
        },
      },
    } = node

    return <Hyperlink slug={slug}>{children}</Hyperlink>
  },
  [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => {
    return (
      <ContentWrap>
        <Paragraph>{children}</Paragraph>
      </ContentWrap>
    )
  },
  [BLOCKS.QUOTE]: (node: Document | string | undefined) => {
    return (
      <ContentWrap>
        <RichText document={node} renderNode={customBlockquoteRenderNode} />
      </ContentWrap>
    )
  },
  [BLOCKS.HEADING_2]: (node: Node, children: Array<ReactNode>) => {
    if (!children) {
      return null
    }

    return (
      <ContentWrap>
        <Text
          id={slugify(children.join(''))}
          variant="h2"
          as="h2"
          paddingBottom={2}
          paddingTop={2}
        >
          <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
        </Text>
      </ContentWrap>
    )
  },
  [BLOCKS.HEADING_3]: (node: Node, children: ReactNode[]) => {
    if (!children) {
      return null
    }

    return (
      <ContentWrap>
        <Text id={slugify(children.join(''))} variant="h3" as="h3">
          <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
        </Text>
      </ContentWrap>
    )
  },
  [BLOCKS.UL_LIST]: (node: Node, children: ReactNode) => (
    <BulletList>{children}</BulletList>
  ),
  [BLOCKS.LIST_ITEM]: (node: Document | string | undefined) => {
    return (
      <ContentWrap>
        <RichText document={node} renderNode={customListItemRenderNode} />
      </ContentWrap>
    )
  },
  [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => {
    const nodeId = node.data.target?.sys?.contentType?.sys?.id ?? null

    if (!nodeId) return null

    const embeddedNode = embeddedNodes[nodeId] as EmbeddedNode

    if (!embeddedNode) return null

    const Component = embeddedNode.component
    const Wrapper = embeddedNode.wrapper ?? null

    const props = {
      ...(embeddedNode.processedProps &&
      Object.keys(embeddedNode.processedProps).length
        ? { ...embeddedNode.processedProps(node) }
        : {}),
    }

    const Cmp = () => (
      <Component {...props}>
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
} as RenderNode

const customListItemRenderNode = {
  ...defaultRenderNode,
  [BLOCKS.LIST_ITEM]: (node: Node, children: ReactNode) => {
    return <Bullet>{children}</Bullet>
  },
  [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => children,
} as RenderNode

const customProcessEntryRenderNode = {
  ...defaultRenderNode,
  [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => {
    return <Paragraph>{children}</Paragraph>
  },
  [BLOCKS.HEADING_2]: (node: Node, children: string[]) => (
    <Text variant="h2" as="h2">
      <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
    </Text>
  ),
  [BLOCKS.HEADING_3]: (node: Node, children: ReactNode) => (
    <Text variant="h3" as="h3">
      {children}
    </Text>
  ),
  [BLOCKS.UL_LIST]: (node: Node, children: ReactNode) => (
    <BulletList>{children}</BulletList>
  ),
  [BLOCKS.LIST_ITEM]: (node: string | Document | undefined) => {
    return <RichText document={node} renderNode={customListItemRenderNode} />
  },
} as RenderNode

type Props = {
  document: string
}

export const Content: FC<React.PropsWithChildren<Props>> = ({ document }) => {
  return <RichText document={document} renderNode={defaultRenderNode} />
}

export default Content
