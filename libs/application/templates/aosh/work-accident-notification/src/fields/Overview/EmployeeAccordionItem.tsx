import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { EmployeeType } from '../../lib/dataSchema'
import { getEmployeeInformationForOverview } from '../../utils/getEmployeeInformationForOverview'
import { getCauseAndConsequencesForOverview } from '../../utils/getCauseAndConsequencesForOverview'
import { DeleteEmployee } from '../DeleteEmployee'
import { WorkAccidentNotification } from '../..'

type EmployeeAccordionItemType = {
  employee: EmployeeType
  onClick: () => void
  index: number
}

export const EmployeeAccordionItem: FC<
  React.PropsWithChildren<FieldBaseProps & EmployeeAccordionItemType>
> = ({ ...props }) => {
  const { application, employee, onClick, index } = props
  const { formatMessage } = useLocale()
  const answers = application.answers as WorkAccidentNotification

  return (
    <>
      <Box
        marginTop={1}
        width="full"
        display={'flex'}
        justifyContent={'flexEnd'}
      >
        <DeleteEmployee
          {...props}
          allowDeleteFirst={answers.employeeAmount > 1}
        />
      </Box>
      <Box padding={[0, 0, 2, 4]}>
        <ReviewGroup
          handleClick={onClick}
          editMessage={formatMessage(overview.labels.editMessage)}
          title={formatMessage(overview.labels.employee)}
          isLast
          isFirst
        >
          <KeyValueFormField
            application={application}
            field={{
              ...props.field,
              type: FieldTypes.KEY_VALUE,
              component: FieldComponents.KEY_VALUE,
              title: '',
              label: '',
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
          title={formatMessage(overview.labels.events)}
          isLast
          isFirst
        >
          <KeyValueFormField
            application={application}
            field={{
              ...props.field,
              type: FieldTypes.KEY_VALUE,
              component: FieldComponents.KEY_VALUE,
              title: '',
              label: '',
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
