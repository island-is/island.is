import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../lib/messages'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'

type EmployeeAccordionItemType = {
  employee: {
    name: string
    nationalId: string
  }
  onClick: () => void
  // index: number
}

export const EmployeeAccordionItem: FC<
  React.PropsWithChildren<FieldBaseProps & EmployeeAccordionItemType>
> = ({ ...props }) => {
  const { application, field, employee, onClick } = props
  const { formatMessage } = useLocale()

  return (
    <>
      <Text>{formatMessage(overview.labels.employeeDescription)}</Text>

      <Box padding={[0, 0, 2, 4]}>
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
              label: formatMessage(overview.labels.employee),
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
              label: formatMessage(overview.labels.causeAndConsequences),
              value: 'ftjk',
            }}
          />
        </ReviewGroup>
      </Box>
    </>
  )
}
