import { Box } from '../Box/Box'
import { VariantTypes } from './Text.css'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { LinkContext } from '../context'
import { Text } from './Text'

export default {
  title: 'Core/Text',
  component: Text,
}

export const Variants = {
  render: () => (
    <Text>
      This is the <code>default</code>variant
    </Text>
  ),

  name: 'Variants',
}

export const Customize = {
  render: () => (
    <Text variant="h3" lineHeight="lg" fontWeight="light">
      This is the 'h3' variant with a different line-height and font-weight
    </Text>
  ),

  name: 'Customize',
}

export const Element = {
  render: () => (
    <Text variant="h3" as="h1">
      <code>h3</code>variant and renders as <code>{'<h1/>'}</code>in the DOM
    </Text>
  ),

  name: 'Element',
}

export const CustomLinkRenderer = {
  render: () => (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <a
            style={{
              color: 'deeppink',
              fontFamily: 'Comic Sans MS',
              fontWeight: 500,
              textShadow: '1px 1px 0 rebeccapurple',
            }}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children + '✨'}
          </a>
        ),
      }}
    >
      <Text>
        Here's a <a href="/test">custom link</a>and here's{' '}
        <a href="/test2">another</a>.
      </Text>
    </LinkContext.Provider>
  ),

  name: 'Custom link renderer',
}

export const InlineElements = {
  render: () => (
    <Text>
      Inline elements like <strong>strong</strong>and <em>em</em>are styled
      globally. Just drop them <mark>right in your text</mark>.
    </Text>
  ),

  name: 'Inline elements',
}

export const TextLayout = {
  render: () => (
    <GridContainer>
      <GridRow>
        <GridColumn span="10/12">
          <Text as="h1" variant="h1" paddingBottom={2}>
            Typical text layout
          </Text>
          <Text variant="intro">
            Control vertical rhythm using Text's <em>padding</em>or{' '}
            <em>margin</em>props.
          </Text>
          <Text variant="intro" paddingBottom={6}>
            Don't rely on the <strong>Stack</strong>for vertical text spacing.
          </Text>
          <Text as="h2" variant="h2" paddingBottom={2}>
            Lorem ipsum time
          </Text>
          <Text paddingBottom={2}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            minus doloremque quis minima adipisci sunt fugit unde officiis? Qui
            et animi asperiores excepturi ut, amet consectetur dignissimos rerum
            in fuga eum doloribus. Magnam quibusdam nisi earum culpa quo quidem
            mollitia, quasi illum provident, molestias voluptate corrupti
            consectetur autem, numquam sint labore. Delectus eius cupiditate
            dolores tempora harum suscipit, animi explicabo. Corrupti maiores
            officia architecto ratione animi eum sequi quos.
          </Text>
        </GridColumn>
      </GridRow>
    </GridContainer>
  ),

  name: 'Text layout',
}
