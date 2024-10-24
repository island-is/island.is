import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { EmployeeType } from '../../lib/dataSchema'
import { getEmployeeInformationForOverview } from '../../utils/getEmployeeInformationForOverview'
import { getCauseAndConsequencesForOverview } from '../../utils/getCauseAndConsequencesForOverview'

type EmployeeAccordionItemType = {
  employee: EmployeeType
  onClick: () => void
  index: number
}

export const EmployeeAccordionItem: FC<
  React.PropsWithChildren<FieldBaseProps & EmployeeAccordionItemType>
> = ({ ...props }) => {
  const { application, field, employee, onClick, index } = props
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
              value: getEmployeeInformationForOverview(
                application.externalData,
                employee,
                formatMessage,
              ),
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
              value: getCauseAndConsequencesForOverview(
                application.externalData,
                application.answers,
                index,
                formatMessage,
              ),
            }}
          />
        </ReviewGroup>
      </Box>
    </>
  )
}
