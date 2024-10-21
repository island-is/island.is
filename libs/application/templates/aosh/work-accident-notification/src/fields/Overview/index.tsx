import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Accordion, AccordionItem, Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { information, overview, sections } from '../../lib/messages'
import {
  getAccidentInformationForOverview,
  getCompanyInformationForOverview,
} from '../../utils'
import { InjuredAccordionItem } from './InjuredAccordionItem'
// import {
//   information,
//   licensePlate,
//   machine,
//   overview,
// } from '../../lib/messages'
// import {
//   canMaybeRegisterToTraffic,
//   canRegisterToTraffic,
//   getBasicMachineInformation,
//   getPersonInformationForOverview,
//   getStreetRegistrationInformation,
//   getTechnicalInformation,
//   hasOperator,
//   isOwnerOtherThanImporter,
// } from '../../utils'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, goToScreen, field } = props
  const { formatMessage } = useLocale()

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  const mockEmployees = [
    {
      name: 'Gervimaður Færeyjar',
      nationalId: '0101302399',
    },
    {
      name: 'Gervimaður Ameríka',
      nationalId: '0101302989',
    },
  ]

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('companyInformation')}
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
        isLast
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: formatMessage(sections.draft.accident),
            value: getAccidentInformationForOverview(
              application.answers,
              application.externalData,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>

      <Accordion>
        {mockEmployees.map((injured, index) => (
          <AccordionItem
            id={`${field.id}-accordion-item-${'someid'}`}
            label={`${formatMessage(overview.labels.employee)} ${
              mockEmployees.length > 1 ? index + 1 : ''
            }`}
          >
            <InjuredAccordionItem
              injured={injured}
              onClick={() => onClick(`someplace[${index}]`)}
              {...props}
            />
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}
