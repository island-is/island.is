import {
  Table as T,
  Box,
  Pagination,
  Button,
  Input,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ExpandRow,
  ExpandHeader,
  NestedFullTable,
} from '@island.is/service-portal/core'
import { helperStyles } from '@island.is/island-ui/theme'
import * as styles from './VehicleBulkMileageTable.css'
import { useState } from 'react'

interface Props {
  id: string
  line: string[]
  detail: Array<string[]>
  onSaveClick: (mileage: number, permNo: string) => void
}

export const VehicleBulkMileageTableRow = (props: Props) => {
  const [mileage, setMileage] = useState<number>()

  const onClick = (): void => {
    if (mileage) {
      props.onSaveClick(mileage, props.id)
    }
  }

  return (
    <ExpandRow
      key="Expand-row-id"
      data={[
        ...props.line.map((l) => {
          return {
            value: l,
          }
        }),
        {
          value: (
            <Box className={styles.mwInput}>
              <label className={helperStyles.srOnly} htmlFor={props.id}>
                Kílómetrastaða
              </label>
              <Input
                type="number"
                id={props.id}
                name={props.id}
                size="xs"
                rightAlign
                maxLength={12}
                onChange={(e) => setMileage(parseInt(e.target.value))}
              />
            </Box>
          ),
        },
        {
          value: (
            <Button
              icon="pencil"
              size="small"
              type="button"
              variant="text"
              disabled={!mileage}
              onClick={onClick}
            >
              Vista
            </Button>
          ),
        },
      ]}
    >
      <NestedFullTable
        headerArray={['Dagsetning', 'Skráning', 'Ársnotkun', 'Kílómetrastaða']}
        data={props.detail.map((det) => det)}
      />
    </ExpandRow>
  )
}
