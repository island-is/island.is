import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  AccordionCard,
  Text,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { Jobs } from '../../assets/Jobs'
import { conclusion } from '../../lib/messages'
import { ReviewScreenProps } from '../../shared'
import { isLastReviewer } from '../../utils'

export const ReviewConclusion: FC<FieldBaseProps & ReviewScreenProps> = ({
  refetch,
  reviewerNationalId = '',
  application,
}) => {
  const { formatMessage } = useLocale()
  const isLast = isLastReviewer(reviewerNationalId, application.answers)

  const onForwardButtonClick = () => {
    refetch?.()
  }

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        {formatMessage(
          isLast ? conclusion.general.approvedTitle : conclusion.general.title,
        )}
      </Text>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(conclusion.default.alertMessage)}
        />
      </Box>

      <AccordionCard
        id="conclustion-card"
        label={formatMessage(conclusion.default.accordionTitle)}
      >
        <Text>
          {formatMessage(
            isLast
              ? conclusion.approved.accordionText
              : conclusion.review.accordionText,
          )}
        </Text>
      </AccordionCard>
      <Box
        marginTop={[5, 5, 5]}
        marginBottom={[5, 8]}
        display="flex"
        justifyContent="center"
      >
        <Jobs />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flexEnd" paddingY={5}>
        <Button icon="arrowForward" onClick={onForwardButtonClick}>
          {formatMessage(conclusion.default.goToStatusButton)}
        </Button>
      </Box>
    </Box>
  )
}
