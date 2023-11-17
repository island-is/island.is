import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'
import { States } from '../../lib/constants'
import { survivorsBenefitsFormMessage } from '../../lib/messages'
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

  const { comment } = getApplicationAnswers(
    application.answers,
  )
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {state === `${States.DRAFT}` && (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(survivorsBenefitsFormMessage.confirm.title)}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(
                  survivorsBenefitsFormMessage.confirm.description,
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
