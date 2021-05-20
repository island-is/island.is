import React from 'react'
import { useIntl } from 'react-intl'
import {
  DescriptionText,
  ErrorModal,
} from '@island.is/application/templates/family-matters-core/components'
import { noChildren } from '../../lib/messages'

const typeInput = 'selectDuration.type'
const dateInput = 'selectDuration.date'

export const selectDurationInputs = [typeInput, dateInput]

const NoChildrenErrorModal = () => {
  const { formatMessage } = useIntl()
  return (
    <ErrorModal
      title={formatMessage(noChildren.title)}
      ctaButton={{
        label: formatMessage(noChildren.buttonLabel),
        // TODO: Add link to correct page on island.is
        onClick: () => console.log('cta'),
      }}
    >
      <DescriptionText text={noChildren.description} />
    </ErrorModal>
  )
}

export default NoChildrenErrorModal
