import { Text } from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
interface Props {
  data: Array<{
    value: string | React.ReactElement
    align?: 'left' | 'right'
    element?: boolean
    printHidden?: boolean
    width?: string
  }>
}

export const ExpandableTableHeader = ({ data }: Props) => {
  return (
    <T.Head>
      <T.Row>
        {data.map((item, i) =>
          item.value ? (
            <T.HeadData
              box={{
                textAlign: item.align ?? 'left',
                printHidden: item.printHidden,
              }}
              scope="col"
              key={i}
              width={item.width}
            >
              <Text
                variant="medium"
                fontWeight="semiBold"
              >
                {item.value}
              </Text>
            </T.HeadData>
          ) : (
            <T.Data key={i}/>
          ),
        )}
      </T.Row>
    </T.Head>
  )
}
