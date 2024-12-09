import { SimpleBarChart } from '@island.is/portals/my-pages/core'

const data: Array<Record<string, string | number>> = [
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
      label: 'Km.',
    },
    xAxis: 'date',
    bars: [
      {
        stackId: 0,
        datakey: 'mileage',
        color: 'blue',
      },
    ],
    lines: [],
  },
]

export const LineChart = () => {
  return (
    <SimpleBarChart
      data={data}
      datakeys={['date', 'mileage']}
      bars={[
        {
          datakey: 'mileage',
        },
      ]}
      xAxis={{
        datakey: 'date',
      }}
      yAxis={{
        datakey: 'mileage',
        label: 'Km.',
      }}
    />
  )
}

export default LineChart
