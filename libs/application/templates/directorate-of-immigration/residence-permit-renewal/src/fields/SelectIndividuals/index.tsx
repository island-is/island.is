import { Box, Tag } from '@island.is/island-ui/core'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { applicant } from '../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/domains/national-registry'
import { CurrentResidencePermit } from '@island.is/clients/directorate-of-immigration/residence-permit'
import { formatDate } from '../../utils'
import { useLocale } from '@island.is/localization'

//limit to max MAX_CNT_APPLICANTS applicants
export const SelectIndividuals = ({ field, application, error }: any) => {
  const { formatMessage } = useLocale()

  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application

  const currentResidencePermitList = getValueViaPath(
    application.externalData,
    'currentResidencePermitList.data',
    [],
  ) as CurrentResidencePermit[]

  const applicantData = getValueViaPath(
    application.externalData,
    'nationalRegistry.data',
    undefined,
  ) as NationalRegistryUser | undefined
  const applicantCurrentResidencePermit = currentResidencePermitList.find(
    (x) => x.nationalId === applicantData?.nationalId,
  )
  const canApplyRenewal = !!applicantCurrentResidencePermit?.canApplyRenewal
    ?.canApply

  const applicantCheckbox = {
    value: applicantData?.nationalId!,
    label: applicantData?.fullName!,
    subLabel: applicantCurrentResidencePermit?.permitTypeName,
    rightContent: (
      <div style={{ display: 'flex' }}>
        <Tag
          outlined={!canApplyRenewal ? false : true}
          disabled
          variant={!canApplyRenewal ? 'red' : 'blue'}
        >
          {canApplyRenewal
            ? formatMessage(applicant.labels.pickApplicant.validTo, {
                date: formatDate(
                  applicantCurrentResidencePermit?.permitValidTo,
                ),
              })
            : applicantCurrentResidencePermit?.canApplyRenewal?.reason}
        </Tag>
      </div>
    ),
    disabled: !canApplyRenewal,
  }

  const children = childrenCustodyInformation.data as ApplicantChildCustodyInformation[]
  const childrenCheckboxes = children.map(
    (child: ApplicantChildCustodyInformation) => {
      const childCurrentResidencePermit = currentResidencePermitList.find(
        (x) => x.nationalId === child.nationalId,
      )

      const canApplyRenewal = !!childCurrentResidencePermit?.canApplyRenewal
        ?.canApply

      return {
        value: child.nationalId,
        label: child.fullName,
        subLabel: child.otherParent
          ? `${applicant.labels.pickApplicant.checkboxSubLabel.defaultMessage} ${child.otherParent?.fullName}` //TODO ekki nota defaultMessage, þá þýðist ekki
          : '',
        rightContent: (
          <div style={{ display: 'flex' }}>
            <Tag outlined={true} disabled variant={'blue'}>
              {canApplyRenewal
                ? formatMessage(applicant.labels.pickApplicant.validTo, {
                    date: formatDate(
                      childCurrentResidencePermit?.permitValidTo,
                    ),
                  })
                : childCurrentResidencePermit?.canApplyRenewal?.reason}
            </Tag>
          </div>
        ),
        disabled: !canApplyRenewal,
      }
    },
  )

  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: field.id,
            title: '',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: [applicantCheckbox, ...childrenCheckboxes],
            onSelect: (newAnswer) => {
              return { ...answers, selectedIndividuals: newAnswer }
            },
          }}
        />
      </Box>
    </Box>
  )
}
