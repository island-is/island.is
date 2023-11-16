import { Chart } from '@island.is/web/graphql/schema'

import { DEFAULT_XAXIS_KEY } from '../constants'
import { useGetChartData, useGetChartTableSettings } from '../hooks'
import { ChartComponentWithRenderProps } from '../types'
import { formatDate } from '../utils'

interface AccessibilityTableRendererProps {
  id: string
  chart: Chart
  componentsWithAddedProps: ChartComponentWithRenderProps[]
  data: ReturnType<typeof useGetChartData>['data']
}

export const AccessibilityTableRenderer = ({
  id,
  chart,
  componentsWithAddedProps,
  data,
}: AccessibilityTableRendererProps) => {
  const tableSettings = useGetChartTableSettings(chart)

  const xAxisKey = chart.xAxisKey ?? DEFAULT_XAXIS_KEY
  const xAxisValueType = chart.xAxisValueType ?? DEFAULT_XAXIS_KEY

  return (
    <table className="visually-hidden" id={id}>
      <caption>
        {chart.title}
        <br />
        {chart.alternativeDescription}
      </caption>
      {tableSettings !== null && (
        <>
          <thead>
            <tr>
              {tableSettings.tableHeadWithAxis.map((th) => (
                <th scope="col" key={th}>
                  {componentsWithAddedProps.find((c) => c.sourceDataKey === th)
                    ?.label ?? th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              // eslint-disable-next-line
              // @ts-ignore
              const xAxisValue = row[xAxisKey]

              return (
                <tr>
                  <th scope="row">
                    {xAxisValueType === 'date'
                      ? formatDate(xAxisValue)
                      : xAxisValue}
                  </th>
                  {tableSettings.tableHead.map((key) => {
                    // eslint-disable-next-line
                    // @ts-ignore
                    const rowValue = row[key]

                    return <td>{rowValue}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </>
      )}
    </table>
  )
}
