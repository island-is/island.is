import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'
import { States } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Comment } from './review-groups/Comment'
import { Attachments } from './review-groups/Attachments'
import { getApplicationAnswers } from '../../lib/survivorsBenefitsUtils'

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
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()

  const { comment } = getApplicationAnswers(application.answers)
  const { state } = application

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
      {state === `${States.DRAFT}` && (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(
                  socialInsuranceAdministrationMessage.confirm.overviewTitle,
                )}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(
                  socialInsuranceAdministrationMessage.confirm
                    .overviewDescription,
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
      )}
      {comment && <Comment {...childProps} />}
      <Attachments {...childProps} />
    </>
  )
}
