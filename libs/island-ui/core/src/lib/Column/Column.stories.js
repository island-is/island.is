import { Box } from '../Box/Box'
import { Columns } from '../Columns/Columns'
import { Column } from './Column'
import { Text } from '../Text/Text'

const DemoBox = ({ background, minHeight = 'auto', children }) => (
  <Box padding={4} background={background} style={{ minHeight }}>
    {children}
  </Box>
)

export default {
  title: 'Layout/Column',
  component: Columns,
}

export const Default = {
  render: () => (
    <Columns>
      <Column>
        <DemoBox background="blue100">
          <Text>Column 1</Text>
        </DemoBox>
      </Column>
      <Column>
        <DemoBox background="blue200">
          <Text>Column 2</Text>
        </DemoBox>
      </Column>
      <Column background="blue300">
        <DemoBox background="blue300">
          <Text>Column 3</Text>
        </DemoBox>
      </Column>
    </Columns>
  ),

  name: 'Default',
}

export const ResponsiveWidth = {
  render: () => (
    <Columns>
      <Column width="3/12">
        <DemoBox background="blue100">
          <Text>Span 3/12</Text>
        </DemoBox>
      </Column>
      <Column width="6/12">
        <DemoBox background="blue200">
          <Text>Span 6/12</Text>
        </DemoBox>
      </Column>
      <Column width="3/12">
        <DemoBox background="blue300">
          <Text>Span 3/12</Text>
        </DemoBox>
      </Column>
    </Columns>
  ),

  name: 'Responsive width',
}
