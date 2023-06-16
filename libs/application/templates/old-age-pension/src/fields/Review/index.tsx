import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'

import { oldAgePensionFormMessage } from '../../lib/messages'
import { BaseInformation } from './review-groups/BaseInformation'
import { Fishermen } from './review-groups/Fishermen'
import { Period } from './review-groups/Period'
import { Comment } from './review-groups/Comment'
import { Attachments } from './review-groups/Attachments'

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
        {/* <PrintButton /> */}
        <Box marginBottom={2}>
          <Text variant="h2">
            {formatMessage(oldAgePensionFormMessage.shared.confirmationTitle)}
          </Text>
        </Box>
        <Box marginBottom={10}>
          <Text variant="default">
            {formatMessage(
              oldAgePensionFormMessage.shared.confirmationDescription,
            )}
          </Text>
        </Box>
      </Box>
      <BaseInformation {...childProps} />
      <Period {...childProps} />
      <Fishermen {...childProps} />
      <Comment {...childProps} />
      <Attachments {...childProps} />
    </>
  )
}
