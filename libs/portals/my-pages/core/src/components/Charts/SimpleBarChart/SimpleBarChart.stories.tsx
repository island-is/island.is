import { withFigma } from '@island.is/island-ui/core'
import type { Meta, StoryObj } from '@storybook/react'
import type { GraphDataProps } from './SimpleBarChart'
import { SimpleBarChart } from './SimpleBarChart'

const config: Meta<typeof SimpleBarChart> = {
  title: 'My pages/Simple Bar Chart',
  component: SimpleBarChart,
  parameters: withFigma('Simple Bar Chart'),
  argTypes: {
    bars: {
      description: 'Defines the bars to be displayed in the chart',
      control: { type: 'object' },
    },
    data: {
      control: { type: 'object' },
      description: 'The data to be visualized in the chart',
    },
    datakeys: {
      control: { type: 'object' },
      description: 'Keys of the data to be used for the bars',
    },
    xAxis: {
      control: { type: 'object' },
      description: 'Configuration for the x-axis',
    },
    yAxis: {
      control: { type: 'object' },
      description: 'Configuration for the y-axis',
    },
    title: {
      control: { type: 'text' },
      description: 'Title of the chart',
    },
    tooltip: {
      control: { type: 'object' },
      description: 'Configuration for the tooltip',
    },
  },
}
export default config

export const Default: StoryObj<GraphDataProps> = {
  render: (args) => <SimpleBarChart {...args} />,
}

Default.args = {
  datakeys: ['sales', 'expenses'],
  bars: [{ datakey: 'sales' }, { datakey: 'expenses' }],
  data: [
    { month: 'Jan', sales: 4000, expenses: 2400 },
    { month: 'Feb', sales: 3000, expenses: 1398 },
    { month: 'Mar', sales: 2000, expenses: 9800 },
    { month: 'Apr', sales: 2780, expenses: 3908 },
    { month: 'May', sales: 1890, expenses: 4800 },
    { month: 'Jun', sales: 2390, expenses: 3800 },
    { month: 'Jul', sales: 3490, expenses: 4300 },
  ],
  xAxis: {
    datakey: 'sales',
    label: 'Salses',
  },
  yAxis: {
    datakey: 'expenses',
    label: 'Expenses',
  },
}
