import React from 'react'
import { useIntl } from 'react-intl'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import * as m from '../../lib/messages'
import { Roles } from '../../lib/constants'
import { CRCFieldBaseProps } from '../../types'
import { ContractOverview } from '../components'
import * as style from '../Shared.css'

const confirmContractTerms = 'confirmContract.terms'
const confirmContractTimestamp = 'confirmContract.timestamp'

export const confirmContractIds = [
  confirmContractTerms,
  confirmContractTimestamp,
]

const Overview = ({ field, error, errors, application }: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { answers, externalData } = application
  const applicant = externalData.nationalRegistry.data
  const children = getSelectedChildrenFromExternalData(
    externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )
  const parentB = children[0].otherParent

  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  const isDraft = application.state === 'draft'
  if (isDraft) {
    setValue(
      confirmContractTimestamp,
      format(addDays(new Date(), 28), 'dd.MM.yyyy'),
    )
  }

  return (
    <Box className={style.descriptionOffset}>
      <Box>
        {isDraft ? (
          <DescriptionText
            text={m.contract.general.description}
            format={{
              otherParent: parentB?.fullName ?? '',
            }}
          />
        ) : (
          <DescriptionText
            text={m.contract.general.parentBDescription}
            format={{
              otherParent: applicant.fullName,
            }}
          />
        )}
      </Box>
      <Box marginTop={4}>
        <ContractOverview
          application={application}
          parentKey={isDraft ? Roles.ParentA : Roles.ParentB}
        />
      </Box>
      <Box marginTop={5}>
        <CheckboxController
          id={isDraft ? confirmContractTerms : id}
          disabled={disabled}
          error={isDraft ? errors?.confirmContract?.terms : error}
          large={true}
          defaultValue={[]}
          options={[
            {
              value: 'yes',
              label: formatMessage(m.contract.checkbox.label),
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default Overview
