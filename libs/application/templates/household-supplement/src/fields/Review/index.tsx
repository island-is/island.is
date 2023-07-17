import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'

import { Payment } from './review-groups/Payment'
import { Attachments } from './review-groups/Attachments'
import { HouseholdSupplement } from './review-groups/HouseholdSupplement'

import { householdSupplementFormMessage } from '../../lib/messages'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  errors?: RecordObject
  editable?: boolean
}
export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const hasError = (id: string) => get(errors, id) as string
  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))
  const childProps = {
    application,
    editable,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }
  return (
    <>
      <Box>
        <Box marginBottom={2}>
          <Text variant="h2">
            {formatMessage(householdSupplementFormMessage.confirm.title)}
          </Text>
        </Box>
        <Box marginBottom={10}>
          <Text variant="default">
            {formatMessage(householdSupplementFormMessage.confirm.description)}
          </Text>
        </Box>
      </Box>
      <Payment {...childProps} />
      <HouseholdSupplement {...childProps} />
      <Attachments {...childProps} />
    </>
  )
}
