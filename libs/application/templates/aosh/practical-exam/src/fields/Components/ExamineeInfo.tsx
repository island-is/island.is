import { FieldBaseProps } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
} from '@island.is/island-ui/core'
import { FC } from 'react'
import { shared } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

type ExamineeInfoProps = {
  name: string
  nationalId: string
}

export const ExamineeInfo: FC<
  React.PropsWithChildren<FieldBaseProps & ExamineeInfoProps>
> = ({ name, nationalId }) => {
  const { formatMessage } = useLocale()
  // Display two read-only fields: Name and SSN
  return (
    <Box>
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            paddingBottom={2}
          >
            <Input
              label={formatMessage(shared.labels.name)}
              name={'name'}
              readOnly
              backgroundColor={'white'}
              value={name}
              size="md"
              type="text"
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Input
              label={formatMessage(shared.labels.ssn)}
              name={'nationalId'}
              readOnly
              backgroundColor={'white'}
              value={formatKennitala(nationalId)}
              size="md"
              type="text"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
