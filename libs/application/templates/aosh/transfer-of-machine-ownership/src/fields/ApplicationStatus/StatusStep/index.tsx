import { Box, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { ReviewScreenProps, ReviewSectionProps } from '../../../shared'
import { review } from '../../../lib/messages/steps'
import { review as reviewStatus } from '../../../lib/messages/review'

export const StatusStep: FC<
  React.PropsWithChildren<ReviewSectionProps & ReviewScreenProps>
> = ({
  title,
  description,
  tagVariant = 'blue',
  visible = true,
  reviewer = [],
  reviewerNationalId = '',
  messageValue = '',
  isComplete = false,
}) => {
  const { formatMessage } = useLocale()
  if (!visible) return null

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      marginBottom={2}
    >
      <Box padding={4}>
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="h3">
              {formatMessage(title, {
                variable: messageValue,
              })}
            </Text>
            <Tag variant={tagVariant} disabled>
              {formatMessage(review.tags.text)}
            </Tag>
          </Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            flexWrap={['wrap', 'nowrap']}
          >
            <Text marginTop={1} variant="default">
              {formatMessage(description)}
            </Text>
          </Box>
          {reviewer.length > 0 &&
            !isComplete &&
            reviewer.find((reviewerItem) => !reviewerItem.approved) && (
              <Box>
                {reviewer.map((reviewerItem, index) => {
                  return (
                    <Text
                      marginTop={1}
                      variant="eyebrow"
                      color={reviewerItem.approved ? 'mint600' : 'red600'}
                      key={`reviewer-${index}-${reviewerItem.nationalId}`}
                    >
                      {reviewerItem.name}{' '}
                      {reviewerNationalId === reviewerItem.nationalId
                        ? `(${formatMessage(reviewStatus.status.youLabel)})`
                        : ''}
                    </Text>
                  )
                })}
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  )
}
