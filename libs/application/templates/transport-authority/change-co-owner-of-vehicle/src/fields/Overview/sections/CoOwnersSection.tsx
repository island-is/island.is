// Buyers coowners
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview, review } from '../../../lib/messages'
import {
  OwnerCoOwnersInformation,
  CoOwnersInformation,
  ReviewScreenProps,
} from '../../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import kennitala from 'kennitala'
import { formatPhoneNumber } from '../../../utils'

export const CoOwnersSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const ownerCoOwners = getValueViaPath(
    application.answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  const coOwners = getValueViaPath(
    application.answers,
    'coOwners',
    [],
  ) as CoOwnersInformation[]

  const allCoOwners = [
    ...ownerCoOwners.map((coOwner) => {
      return {
        name: coOwner.name,
        nationalId: coOwner.nationalId,
        email: coOwner.email,
        phone: coOwner.phone,
        wasRemoved: coOwner.wasRemoved,
      }
    }),
    ...coOwners
      .filter(({ wasRemoved }) => wasRemoved !== 'true')
      .map((coOwner) => {
        return {
          name: coOwner.name,
          nationalId: coOwner.nationalId,
          email: coOwner.email,
          phone: coOwner.phone,
          wasRemoved: 'false',
        }
      }),
  ]

  return allCoOwners.length > 0 ? (
    <ReviewGroup isLast>
      <GridRow>
        {allCoOwners?.map(
          ({ name, nationalId, email, phone, wasRemoved }, index: number) => {
            if (!name || name.length === 0) return null
            const isCoOwner = nationalId === reviewerNationalId
            return (
              <GridColumn
                span={['12/12', '12/12', '12/12', '6/12']}
                key={`coowner-${index}`}
              >
                <Box marginBottom={allCoOwners.length === index + 1 ? 0 : 2}>
                  <Text variant="h4">
                    {formatMessage(overview.labels.ownersCoOwner)}{' '}
                    {allCoOwners.length > 1 ? index + 1 : ''}{' '}
                    {wasRemoved === 'true'
                      ? `(${formatMessage(overview.labels.coOwnerRemoved)})`
                      : ''}{' '}
                    {isCoOwner && `(${formatMessage(review.status.youLabel)})`}
                  </Text>
                  <Text>{name}</Text>
                  <Text>{kennitala.format(nationalId!)}</Text>
                  <Text>{email}</Text>
                  <Text>{formatPhoneNumber(phone)}</Text>
                </Box>
              </GridColumn>
            )
          },
        )}
      </GridRow>
    </ReviewGroup>
  ) : null
}
