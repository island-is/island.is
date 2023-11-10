import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'
import { BaseInformation } from './review-groups/BaseInformation'

import { carRecyclingMessages } from '../../lib/messages'
import { Vehicles } from './review-groups/Vehicles'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}

export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  refetch,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const editable = field.props?.editable ?? false
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
      <Box display="flex" justifyContent="spaceBetween">
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(carRecyclingMessages.review.confirmSectionTitle)}
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Text variant="default">
              {formatMessage(
                carRecyclingMessages.review.confirmationDescription,
              )}
            </Text>
          </Box>
        </Box>
        <Box>
          <Button
            variant="utility"
            icon="print"
            onClick={(e) => {
              e.preventDefault()
              window.print()
            }}
          />
        </Box>
      </Box>
      <BaseInformation {...childProps} />
      <Vehicles {...childProps} />
    </>
  )
}
