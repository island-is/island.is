import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../lib/messages'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'

type InjuredAccordionItemType = {
  injured: {
    name: string
    nationalId: string
  }
  onClick: () => void
  // index: number
}

export const InjuredAccordionItem: FC<
  React.PropsWithChildren<FieldBaseProps & InjuredAccordionItemType>
> = ({ ...props }) => {
  const { application, field, injured, onClick } = props
  const { formatMessage } = useLocale()

  return (
    <>
      <Text>{formatMessage(overview.labels.employeeDescription)}</Text>

      <ReviewGroup
        handleClick={onClick}
        editMessage={formatMessage(overview.labels.editMessage)}
        isFirst
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: formatMessage(information.labels.company.pageTitle),
            value: 'tjtj',
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={onClick}
        editMessage={formatMessage(overview.labels.editMessage)}
        isLast
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: formatMessage(information.labels.company.pageTitle),
            value: 'ftjk',
          }}
        />
      </ReviewGroup>
    </>
  )
}
