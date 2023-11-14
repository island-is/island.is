import { Chart } from '@island.is/web/graphql/schema'
import { useGetChartData, useGetChartTableSettings } from '../hooks'
import { ChartComponentWithRenderProps } from '../types'
import { DEFAULT_XAXIS_KEY } from '../constants'
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
    <div className="visually-hidden" id={id}>
      <table summary={chart.alternativeDescription}>
        <caption>{chart.title}</caption>
        {tableSettings !== null && (
          <>
            <thead>
              <tr>
                {tableSettings.tableHeadWithAxis.map((th) => (
                  <th scope="col" key={th}>
                    {componentsWithAddedProps.find(
                      (c) => c.sourceDataKey === th,
                    )?.label ?? th}
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
    </div>
  )
}
