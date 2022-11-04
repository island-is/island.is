import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import {
  Box,
  Text,
  Divider,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { ApplicationStatus } from '../ApplicationStatus'
import { ReviewScreenProps } from '../../types'
import { ReviewGroup } from '../ReviewGroup'
import { getValueViaPath } from '@island.is/application/core'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { useLocale } from '@island.is/localization'
import { information, overview, review } from '../../lib/messages'

export const Overview: FC<FieldBaseProps & ReviewScreenProps> = ({
  application,
  setStep,
}) => {
  const [shouldReview, setShouldReview] = useState<boolean>(true)
  console.log(application)
  const { formatMessage } = useLocale()
  const { answers } = application

  const dateOfContract = format(
    parseISO(getValueViaPath(answers, 'vehicle.date', '') as string),
    'dd.MM.yyyy',
    {
      locale: is,
    },
  )
  const salePrice = getValueViaPath(answers, 'vehicle.salePrice', '') as string

  const onBackButtonClick = () => {
    setStep('states')
  }
  const onRejectButtonClick = () => {
    setStep('states')
  }
  const onApproveButtonClick = () => {
    setStep('conclusion')
  }
  return (
    <Box>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(overview.general.title)}
      </Text>
      <Text marginBottom={4}>
        {formatMessage(overview.general.description)}
      </Text>
      <ReviewGroup isLast>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Text variant="h4">
              {formatMessage(information.labels.vehicle.title)}
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Text>
              {getValueViaPath(answers, 'vehicle.type', '') as string}
            </Text>
            <Text>
              {
                /* Add color too */ getValueViaPath(
                  answers,
                  'vehicle.plate',
                  '',
                ) as string
              }
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            {salePrice.length > 0 && (
              <Text>
                Söluverð:{' '}
                {getValueViaPath(answers, 'vehicle.salePrice', '') as string}{' '}
                kr.
              </Text>
            )}
            <Text>Dagsetning samnings: {dateOfContract}</Text>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <Box marginTop={14}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>
          {shouldReview && (
            <Box display="flex" justifyContent="spaceBetween">
              <Button
                icon="close"
                colorScheme="destructive"
                onClick={onRejectButtonClick}
              >
                {formatMessage(review.buttons.reject)}
              </Button>
              <Box marginLeft={3}>
                <Button icon="checkmark" onClick={onApproveButtonClick}>
                  {formatMessage(review.buttons.approve)}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
