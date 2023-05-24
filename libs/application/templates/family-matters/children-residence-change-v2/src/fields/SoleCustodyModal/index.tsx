import React from 'react'
import { useIntl } from 'react-intl'
import {
  DescriptionText,
  ErrorModal,
} from '@island.is/application/templates/family-matters-core/components'
import { soleCustody } from '../../lib/messages'

const SoleCustodyModal = () => {
  const { formatMessage } = useIntl()
  return (
    <ErrorModal
      title={formatMessage(soleCustody.title)}
      link={{
        text: formatMessage(soleCustody.linkText),
        href: formatMessage(soleCustody.linkHref),
      }}
    >
      <DescriptionText text={soleCustody.description} />
    </ErrorModal>
  )
}

export default SoleCustodyModal
