import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { User } from 'oidc-client'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'

interface Props {
  userInfo: User
  onClose: () => void
  onSubmit: () => void
}

export const IntroStep: FC<Props> = ({ userInfo, onClose, onSubmit }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn order={[2, 2, 1]} span={['1/1', '1/1', '4/7']}>
          <Text variant="h5" color="roseTinted400" marginBottom={1}>
            {formatMessage(
              {
                id: 'global:welcome',
                defaultMessage: 'Hæ, {name}!',
                description: 'Welcome message',
              },
              {
                name: userInfo.profile.name,
              },
            )}
          </Text>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:welcome',
              defaultMessage: 'Velkomin á mínar síður á island.is',
            })}
          </Text>
          <Text>
            {formatMessage({
              id: 'sp.settings:profile-onboarding-message',
              defaultMessage: `
                Vinsamlegast farðu yfir allar þínar upplýsingar
                til þess að ganga í skugga um að þær séu réttar og
                gerðu breytingar ef þörf krefur.
              `,
            })}
          </Text>
        </GridColumn>
        <GridColumn
          order={[1, 1, 2]}
          offset={['0', '0', '1/7']}
          span={['0', '0', '2/7']}
        >
          <img src="assets/images/jobs.jpg" alt="Skrautmynd" />
        </GridColumn>
      </GridRow>
      <Box display="flex" justifyContent="spaceBetween" marginTop={8}>
        <Button variant="ghost" onClick={onClose}>
          {formatMessage({
            id: 'service.portal:finish-later',
            defaultMessage: 'Klára seinna',
          })}
        </Button>
        <Button variant="primary" onClick={onSubmit} icon="arrowRight">
          {formatMessage({
            id: 'service.portal:next-step',
            defaultMessage: 'Næsta skref',
          })}
        </Button>
      </Box>
    </>
  )
}
