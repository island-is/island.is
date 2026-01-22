import { AlertMessage } from '../AlertMessage/AlertMessage'
import { Box } from '../Box/Box'
import { Columns } from './Columns'
import { Column } from '../Column/Column'
import { Text } from '../Text/Text'

const DemoBox = ({ background, minHeight = 'auto', children }) => (
  <Box padding={4} background={background} style={{ minHeight }}>
    {children}
  </Box>
)

export default {
  title: 'Layout/Columns',
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

export const Spacing = {
  render: () => (
    <Columns space={2}>
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
      <Column>
        <DemoBox background="blue300">
          <Text>Column 3</Text>
        </DemoBox>
      </Column>
    </Columns>
  ),

  name: 'Spacing',
}

export const Collapse = {
  render: () => (
    <Columns collapseBelow="lg">
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
      <Column>
        <DemoBox background="blue300">
          <Text>Column 3</Text>
        </DemoBox>
      </Column>
    </Columns>
  ),

  name: 'Collapse',
}

export const Alignment = {
  render: () => (
    <Columns space={2} collapseBelow="lg" alignY="center">
      <Column>
        <DemoBox background="blue100">
          <Text>Column 1</Text>
        </DemoBox>
      </Column>
      <Column>
        <DemoBox background="blue200" minHeight={200}>
          <Text>Column 2</Text>
        </DemoBox>
      </Column>
      <Column>
        <DemoBox background="blue300">
          <Text>Column 3</Text>
        </DemoBox>
      </Column>
    </Columns>
  ),

  name: 'Alignment',
}
