import { Box, Text } from '@island.is/island-ui/core'
import { ChartsCard } from '@island.is/portals/my-pages/core'

const data = [
  {
    date: '01.02.2022',
    mileage: 1000,
  },
  {
    date: '10.10.2024',
    mileage: 1,
  },
  {
    date: '09.09.2025',
    mileage: 8000,
  },
]

const datakeys = [
  {
    yAxis: {
      right: 0,
      label: 'bingbong',
      labelRight: 'bognbong',
      showRight: true,
    },
    xAxis: 'date',
    bars: [
      {
        stackId: 0,
        datakey: 'mileage',
        color: 'blue',
      },
    ],
    lines: [
      {
        datakey: 'mileage',
        color: 'red',
        stackId: 1,
      },
    ],
  },
]

export const LineChart = () => {
  return (
    <ChartsCard
      chart={{
        graphTitle: '',
        data: JSON.stringify(data),
        datakeys: JSON.stringify(datakeys),
        type: 'mixed',
      }}
    />
  )
}

export default LineChart
