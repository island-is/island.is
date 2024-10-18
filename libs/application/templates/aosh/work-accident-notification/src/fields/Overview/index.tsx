import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { information, overview, sections } from '../../lib/messages'
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
  const { application, goToScreen } = props
  const { formatMessage } = useLocale()

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('companyInformation')}
        editMessage={formatMessage(overview.labels.editMessage)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: formatMessage(information.labels.company.pageTitle),
            value: '',
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('accidentMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: formatMessage(sections.draft.accident),
            value: '',
          }}
        />
      </ReviewGroup>
    </Box>
  )
}
