import React from 'react'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Typography,
  BulletList,
  Bullet,
  Button,
  Box,
  Stack,
  Accordion,
  AccordionItem,
  Blockquote,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import RichText from '../RichText/RichText'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'
import Statistics from '../Statistics/Statistics'
import Paragraph from '../Paragraph/Paragraph'
import Background from '../Background/Background'
import BorderedContent from '../BorderedContent/BorderedContent'
import Hyperlink from '../Hyperlink/Hyperlink'
import Image from '../Image/Image'

const mappedContentfulTypes = {
  article: 'article',
  articleCategory: 'category',
}

const ContentWrap: React.FC = ({ children }) => (
  <GridRow>
    <GridColumn span={['8/8', '8/8', '7/8']} offset={['0', '0', '1/8']}>
      {children}
    </GridColumn>
  </GridRow>
)

const ProcessEntryWrap: React.FC = ({ children }) => (
  <GridRow>
    <GridColumn span={['8/8', '8/8', '6/8']} offset={['0', '0', '1/8']}>
      {children}
    </GridColumn>
  </GridRow>
)

const customBlockquoteRenderNode = () => ({
  [BLOCKS.QUOTE]: (node, children) => {
    return <Blockquote>{children}</Blockquote>
  },
  [BLOCKS.PARAGRAPH]: (node, children) => children,
})

const embeddedNodes = () => ({
  faqList: {
    component: Box,
    wrapper: ({ children }) => {
      return <Box paddingY={10}>{children}</Box>
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
        <ContentWrap>
          <Typography
            variant="h2"
            as="h2"
            data-sidebar-scollable
            paddingBottom={4}
          >
            <span data-sidebar-link={slugify(title)}>{title}</span>
          </Typography>
          <Accordion>
            {items.map((item, index) => {
              const { answer, question } = item

              return (
                <AccordionItem key={index} id={`faq_${index}`} label={question}>
                  <RichText
                    document={answer}
                    renderNode={customProcessEntryRenderNode()}
                  />
                </AccordionItem>
              )
            })}
          </Accordion>
        </ContentWrap>
      )
    },
  },
  embeddedVideo: {
    component: EmbeddedVideo,
    wrapper: ({ children }) => children,
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
    wrapper: ({ children }) => <Box paddingY={[2, 3, 6]}>{children}</Box>,
    processContent: (node) => {
      const {
        processTitle,
        processInfo,
        processLink,
        buttonText,
        type,
        title,
        subtitle,
        details,
      } = node.data.target.fields

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
      }

      return {
        showTopContent: details?.content?.length,
        topContent: (
          <ProcessEntryWrap>
            {title && (
              <Typography variant="h2" as="h3" paddingBottom={2}>
                <span data-sidebar-link={slugify(title)}>{title}</span>
              </Typography>
            )}
            {subtitle && (
              <Typography variant="intro" as="p">
                {subtitle}
              </Typography>
            )}
            <RichText
              document={details}
              renderNode={customProcessEntryRenderNode()}
            />
          </ProcessEntryWrap>
        ),
        bottomContent: (
          <ProcessEntryWrap>
            {type !== 'No type' && (
              <Typography
                variant="eyebrow"
                as="h4"
                color="blue400"
                paddingBottom={1}
              >
                {processTypes[type].title}
              </Typography>
            )}

            {processTitle && (
              <Typography variant="h3" as="h3" paddingBottom={1}>
                {processTitle}
              </Typography>
            )}
            {processInfo && (
              <RichText
                document={processInfo}
                renderNode={customProcessEntryRenderNode()}
              />
            )}
            <Box paddingTop={[1, 1, 2]}>
              <Button href={processLink} icon={processTypes[type].icon}>
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
    children: (node) => {
      return (
        <Background background="dotted" paddingY={[6, 6, 10]} marginTop={5}>
          <Statistics
            items={node.data.target.fields.statistics.map((s) => s.fields)}
          />
        </Background>
      )
    },
  },
  sectionWithImage: {
    component: Box,
    children: (node) => {
      const fields = node.data.target.fields
      if (!fields.image) {
        return (
          <>
            <Typography variant="h2" as="h2" paddingTop={2} paddingBottom={2}>
              <span data-sidebar-link={slugify(fields.title)}>
                {fields.title}
              </span>
            </Typography>
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
                <Typography variant="h2" as="h2" paddingBottom={2}>
                  <span data-sidebar-link={slugify(fields.title)}>
                    {fields.title}
                  </span>
                </Typography>
                <Content document={fields.body} />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )
    },
  },
})

const defaultRenderNode = (overrides = {}) => {
  const settings = {
    [INLINES.HYPERLINK]: (node, children) => {
      return <Hyperlink href={node.data.uri}>{children}</Hyperlink>
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

      return (
        <ContentWrap>
          <Paragraph>{children}</Paragraph>
        </ContentWrap>
      )
    },
    [BLOCKS.QUOTE]: (node, children) => {
      return (
        <ContentWrap>
          <RichText document={node} renderNode={customBlockquoteRenderNode()} />
        </ContentWrap>
      )
    },
    [BLOCKS.HEADING_2]: (node, children) => (
      <ContentWrap>
        <Typography variant="h2" as="h2" paddingBottom={2} paddingTop={2}>
          <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
        </Typography>
      </ContentWrap>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <ContentWrap>
        <Typography variant="h3" as="h3">
          <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
        </Typography>
      </ContentWrap>
    ),
    [BLOCKS.UL_LIST]: (node, children) => <BulletList>{children}</BulletList>,
    [BLOCKS.LIST_ITEM]: (node, children) => {
      return (
        <ContentWrap>
          <RichText document={node} renderNode={customListItemRenderNode()} />
        </ContentWrap>
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
    <Typography variant="h2" as="h2">
      <span data-sidebar-link={slugify(children.join(''))}>{children}</span>
    </Typography>
  ),
  [BLOCKS.HEADING_3]: (node, children) => (
    <Typography variant="h3" as="h3">
      {children}
    </Typography>
  ),
  [BLOCKS.UL_LIST]: (node, children) => <BulletList>{children}</BulletList>,
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
