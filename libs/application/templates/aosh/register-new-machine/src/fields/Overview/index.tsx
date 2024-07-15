import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ReviewGroup } from '../components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { information, machine, overview } from '../../lib/messages'
import {
  getBasicMachineInformation,
  getPersonInformationForOverview,
  hasOperator,
  isOwnerOtherThanImporter,
} from '../../utils'
import { getValueViaPath } from '@island.is/application/core'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, refetch, goToScreen } = props
  const { formatMessage } = useLocale()

  const onClick = (page: string) => {
    goToScreen && goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('importerInformation')}
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
        <Box marginTop={2}>
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
                    'importerInformation.owner',
                    application.answers,
                    formatMessage,
                  )
                : formatMessage(overview.labels.ownerSameAsImporter),
            }}
          />
        </Box>
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('operatorInformation')}
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
        handleClick={() => onClick('machineType')}
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
            ),
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={() => onClick('machineTechnicalInformation')}
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
            label: machine.labels.technicalMachineInformation.overviewTitle,
            value: 'Setja upp upplýsingar einhvernvegin frá þjónustu',
          }}
        />
      </ReviewGroup>

      {/* Bæta við götuskráningu */}
      <AlertMessage
        type="warning"
        title={formatMessage(overview.labels.alertMessageTitle)}
        message={formatMessage(overview.labels.alertMessageMessage)}
      />
    </Box>
  )
}
