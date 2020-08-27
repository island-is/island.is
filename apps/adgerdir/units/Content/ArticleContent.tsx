import React, { FC } from 'react'
import Link from 'next/link'
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
  ResponsiveSpace,
  BoxProps,
  Accordion,
  AccordionItem,
  Blockquote,
} from '@island.is/island-ui/core'
import { Locale } from '../../i18n/I18n'
import { BorderedContent, Hyperlink } from '@island.is/adgerdir/components'
import RichText from '../RichText/RichText'

const mappedContentfulTypes = {
  article: 'article',
  articleCategory: 'category',
}

const simpleSpacing = [2, 2, 3] as ResponsiveSpace

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box paddingX={[3, 3, 6, 0]} marginTop={simpleSpacing} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)

const customListItemRenderNode = (locale) => ({
  ...defaultRenderNode(locale),
  [BLOCKS.LIST_ITEM]: (node, children) => {
    return <Bullet>{children}</Bullet>
  },
  [BLOCKS.PARAGRAPH]: (node, children) => children,
})

const customBlockquoteRenderNode = (locale) => ({
  [BLOCKS.QUOTE]: (node, children) => {
    return (
      <ContentContainer>
        <Blockquote>{children}</Blockquote>
      </ContentContainer>
    )
  },
  [BLOCKS.PARAGRAPH]: (node, children) => children,
})

const customProcessEntryRenderNode = (locale) => ({
  ...defaultRenderNode(locale),
  [BLOCKS.PARAGRAPH]: (node, children) => {
    if (!children.find((x) => x !== '')) {
      return null
    }

    return (
      <ContentContainer paddingX="none">
        <Box marginBottom={simpleSpacing}>
          <Typography variant="p" as="p">
            {children}
          </Typography>
        </Box>
      </ContentContainer>
    )
  },
  [BLOCKS.EMBEDDED_ENTRY]: (node) => {
    const {
      title,
      image: {
        fields: { file },
      },
    } = node.data.target.fields

    return (
      <span style={{ display: 'inline-block', float: 'right', maxWidth: 250 }}>
        <img
          title={title ? title : null}
          alt={title ? title : null}
          src={file.url}
        />
      </span>
    )
  },
  [BLOCKS.EMBEDDED_ASSET]: (node) => {
    const { title, description, file } = node.data.target.fields
    const mimeType = file.contentType
    const mimeGroup = mimeType.split('/')[0]

    switch (mimeGroup) {
      case 'image':
        return (
          <img
            title={title ? title : null}
            alt={description ? description : null}
            src={file.url}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )
      default:
        return (
          <span style={{ backgroundColor: 'red', color: 'white' }}>
            {mimeType} embedded asset
          </span>
        )
    }
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
    return (
      <RichText document={node} renderNode={customListItemRenderNode(locale)} />
    )
  },
})

const defaultRenderNode = (locale, overrides = {}) => {
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

      return (
        <Hyperlink locale={locale} href={href}>
          {children}
        </Hyperlink>
      )
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

      const pathType = mappedContentfulTypes[id]

      return pathType ? (
        <Hyperlink locale={locale} pathType={pathType} slug={slug}>
          {children}
        </Hyperlink>
      ) : (
        children
      )
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (!children.find((x: string) => x !== '')) {
        return null
      }

      return (
        <ContentContainer>
          <Box marginBottom={simpleSpacing}>
            <Typography variant="p" as="p">
              {children}
            </Typography>
          </Box>
        </ContentContainer>
      )
    },
    [BLOCKS.QUOTE]: (node, children) => {
      return (
        <RichText
          document={node}
          renderNode={customBlockquoteRenderNode(locale)}
        />
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
        <RichText
          document={node}
          renderNode={customListItemRenderNode(locale)}
        />
      )
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const embeddedNode = embeddedNodes(locale)[
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

type Props = {
  locale: Locale
  document: string
}

export const ArticleContent: React.FC<Props> = ({ document, locale }) => {
  return <RichText document={document} renderNode={defaultRenderNode(locale)} />
}

const embeddedNodes = (locale) => ({
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
                      renderNode={customProcessEntryRenderNode(locale)}
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
  'vidspyrna-process-entry': {
    component: BorderedContent,
    wrapper: ({ children }) => <Box paddingY={[0, 0, 0, 6]}>{children}</Box>,
    processContent: (node) => {
      const {
        buttonText,
        processLink,
        processDescription,
        title,
        subtitle,
        details,
      } = node.data.target.fields

      console.log('details', details)
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
                renderNode={customProcessEntryRenderNode(locale)}
              />
            </Stack>
          </ContentBlock>
        ),
        bottomContent: processLink ? (
          <ContentBlock width="small">
            <Stack space={[2, 2]}>
              <Typography variant="p" as="p">
                {processDescription || 'processDescription'}
              </Typography>
              <Box paddingTop={[1, 1, 2]}>
                <Hyperlink button href={processLink}>
                  {buttonText || 'Skoða nánar'}
                </Hyperlink>
              </Box>
            </Stack>
          </ContentBlock>
        ) : null,
      }
    },
  },
})

export default ArticleContent
