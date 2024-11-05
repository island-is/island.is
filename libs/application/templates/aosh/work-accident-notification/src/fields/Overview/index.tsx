import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { information, overview, sections } from '../../lib/messages'
import {
  getAccidentInformationForOverview,
  getCompanyInformationForOverview,
} from '../../utils'
import { EmployeeAccordionItem } from './EmployeeAccordionItem'
import { AddEmployee } from '../AddEmployee'
import { getValueViaPath } from '@island.is/application/core'
import { EmployeeType } from '../../lib/dataSchema'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, goToScreen, field } = props
  const { formatMessage } = useLocale()

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  const employees = getValueViaPath(
    application.answers,
    'employee',
  ) as EmployeeType[]

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('companyInformation')}
        editMessage={formatMessage(overview.labels.editMessage)}
        title={formatMessage(information.labels.company.pageTitle)}
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
            value: getCompanyInformationForOverview(
              application.answers,
              application.externalData,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('accidentMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
        title={formatMessage(sections.draft.accident)}
        isLast
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getAccidentInformationForOverview(
              application.answers,
              application.externalData,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>
      <Box paddingY={[0, 2, 4, 6]}>
        <Accordion>
          {employees.map((employee, index) => (
            <AccordionItem
              key={`${field.id}-accordion-item-${index}`}
              id={`${field.id}-accordion-item-${index}`}
              label={`${formatMessage(overview.labels.employee)} ${
                employees.length > 1 ? index + 1 : ''
              } - ${employee.nationalField.name}`}
            >
              <EmployeeAccordionItem
                employee={employee}
                onClick={() => onClick(`employeeInformation[${index}]`)}
                index={index}
                {...props}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
      <Box paddingTop={[2, 2, 4]}>
        <AddEmployee {...props} />
      </Box>
    </Box>
  )
}
