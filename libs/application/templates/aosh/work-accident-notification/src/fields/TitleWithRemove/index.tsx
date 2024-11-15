import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { DeleteEmployee } from '../DeleteEmployee'
import { useLocale } from '@island.is/localization'
import { employee } from '../../lib/messages'

interface TitleWithRemoveProps {
  field: {
    props: {
      index: number
    }
  }
}

export const TitleWithRemove: FC<
  React.PropsWithChildren<TitleWithRemoveProps & FieldBaseProps>
> = (props) => {
  const idx = props.field?.props?.index
  const { formatMessage } = useLocale()
  return (
    <GridRow marginBottom={1} marginTop={3}>
      <GridColumn span={['1/2']}>
        <Text fontWeight="semiBold" as="h5">
          {formatMessage(employee.employee.employeeInformation)}
        </Text>
      </GridColumn>
      <GridColumn span={['1/2']}>
        <Box display={'flex'} justifyContent={'flexEnd'}>
          <DeleteEmployee {...props} index={idx} />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
