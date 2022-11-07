import { BLOCKS } from '@contentful/rich-text-types'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { Box, Table as T } from '@island.is/island-ui/core'
import { TableSlice as TableSliceSchema } from '@island.is/web/graphql/schema'

interface TableSliceProps {
  slice: any
}

export const TableSlice = ({ slice }: TableSliceProps) => {
  console.log('TABLESLICE', slice)
  return null
  // <Box>
  //   {richText(slice.tableContent as SliceType[], {
  //     renderNode: {
  //       [BLOCKS.TABLE]: (_node, children) => <T.Table>{children}</T.Table>,
  //       [BLOCKS.TABLE_ROW]: (_node, children) => {
  //         if (
  //           (children as { nodeType: string }[])?.every(
  //             (childNode) => childNode?.nodeType === BLOCKS.TABLE_HEADER_CELL,
  //           )
  //         ) {
  //           return <T.Head>{children}</T.Head>
  //         }
  //         return <T.Row>{children}</T.Row>
  //       },
  //       [BLOCKS.TABLE_HEADER_CELL]: (_node, children) => (
  //         <T.HeadData>{children}</T.HeadData>
  //       ),
  //       [BLOCKS.TABLE_CELL]: (_node, children) => <T.Data>{children}</T.Data>,
  //     },
  //   })}
  // </Box>
}
