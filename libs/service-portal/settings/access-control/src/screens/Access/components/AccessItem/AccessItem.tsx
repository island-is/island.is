import React from 'react'

import { Table as T, Text } from '@island.is/island-ui/core'
import {
  CheckboxController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

type TableDataProps = React.ComponentProps<typeof T.Data>

interface PropTypes {
  item: any
  isLastItem: boolean
  isFirstItem: boolean
}

function AccessItem({ item, isLastItem, isFirstItem }: PropTypes) {
  const { lang } = useLocale()

  const tdStyling: TableDataProps['box'] = {
    borderBottomWidth: isLastItem ? 'standard' : undefined,
    paddingBottom: isLastItem ? 'p5' : 'p1',
    paddingTop: isFirstItem ? 'p5' : 'p1',
  }

  return (
    <T.Row>
      <T.Data
        box={{
          ...tdStyling,
          paddingLeft: isFirstItem ? 3 : 8,
        }}
      >
        <CheckboxController
          id={item.id}
          spacing={0}
          labelVariant={isFirstItem ? 'default' : 'small'}
          options={[
            {
              label: item.displayName,
              value: item.id,
            },
          ]}
        />
      </T.Data>
      <T.Data box={tdStyling}>
        <Text variant={isFirstItem ? 'default' : 'small'}>
          {item.desciption}
        </Text>
      </T.Data>
      <T.Data box={tdStyling}>
        <DatePickerController
          id={'bar'}
          size="sm"
          label=""
          defaultValue={item.validTo}
          name={'foo'}
          locale={lang}
          placeholder="-"
        />
      </T.Data>
    </T.Row>
  )
}

export default AccessItem
