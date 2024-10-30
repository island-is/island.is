import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ReviewGroup } from '../components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import {
  information,
  licensePlate,
  machine,
  overview,
} from '../../lib/messages'
import {
  canRegisterToTraffic,
  getBasicMachineInformation,
  getPersonInformationForOverview,
  getStreetRegistrationInformation,
  getTechnicalInformation,
  hasOperator,
  isOwnerOtherThanImporter,
} from '../../utils'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, goToScreen } = props
  const { formatMessage, lang } = useLocale()

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('importerInformationMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: information.labels.importer.sectionTitle,
            value: getPersonInformationForOverview(
              'importerInformation.importer',
              application.answers,
              formatMessage,
            ),
          }}
        />
        <Box marginTop={3}>
          <KeyValueFormField
            application={application}
            field={{
              ...props.field,
              type: FieldTypes.KEY_VALUE,
              component: FieldComponents.KEY_VALUE,
              title: '',
              label: information.labels.owner.title,
              value: isOwnerOtherThanImporter(application.answers)
                ? getPersonInformationForOverview(
                    'ownerInformation.owner',
                    application.answers,
                    formatMessage,
                  )
                : formatMessage(overview.labels.ownerSameAsImporter),
            }}
          />
        </Box>
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('operatorInformationMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: information.labels.operator.sectionTitle,
            value: hasOperator(application.answers)
              ? getPersonInformationForOverview(
                  'operatorInformation.operator',
                  application.answers,
                  formatMessage,
                )
              : formatMessage(overview.labels.noOperatorRegistered),
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('machineTypeMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: machine.labels.basicMachineInformation.overviewTitle,
            value: getBasicMachineInformation(
              application.answers,
              formatMessage,
              lang,
            ),
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('machineTechnicalInformationMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
        isLast={!canRegisterToTraffic(application.answers)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: machine.labels.technicalMachineInformation.overviewTitle,
            value: getTechnicalInformation(
              application.answers,
              formatMessage,
              lang,
            ),
          }}
        />
      </ReviewGroup>

      {canRegisterToTraffic(application.answers) && (
        <ReviewGroup
          handleClick={() => onClick('streetRegistration')}
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
              label: licensePlate.general.title,
              value: getStreetRegistrationInformation(
                application.answers,
                formatMessage,
              ),
            }}
          />
        </ReviewGroup>
      )}
    </Box>
  )
}
