import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  Text,
  Button,
  Link,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { conclusion } from '../../lib/messages'
import { Rejecter } from '../../shared'
import kennitala from 'kennitala'

export const RejectedConclusion: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const rejecter = getValueViaPath(application.answers, 'rejecter') as Rejecter

  return (
    <Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="error"
          title={formatMessage(conclusion.rejected.alertMessage)}
        />
      </Box>

      <Box>
        <Text>
          {formatMessage(conclusion.rejected.firstText, {
            plate: (
              <Text as="span" variant="h5">
                {rejecter.plate || ''}
              </Text>
            ),
          })}
        </Text>
        <Text variant="h5" marginY={2}>
          {rejecter.name || ''}, kt.{' '}
          {kennitala.format(rejecter.nationalId || '')} (
          {formatMessage(conclusion.rejected[rejecter.type])})
        </Text>
        <Text marginBottom={2}>
          {formatMessage(conclusion.rejected.secondText)}
        </Text>
        <Text>{formatMessage(conclusion.rejected.thirdText)}</Text>
      </Box>

      <Box display="flex" justifyContent="flexEnd" marginTop={8}>
        <Link
          href={`${document.location.origin}/umsoknir/${ApplicationConfigurations.TransferOfVehicleOwnership.slug}/`}
        >
          <Button>
            {formatMessage(conclusion.rejected.startNewApplication)}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
