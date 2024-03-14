import { Alert, Heading, Link, LinkText, Typography } from '@ui'
import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components/native'
import { useIntl } from 'react-intl'

const TOSLink = styled.View`
  margin-top: 16px;
  margin-bottom: 16px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'airDiscount.screenTitle' }),
      },
    },
  }))

export const AirDiscountScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  return (
    <ScrollView style={{ flex: 1 }}>
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        <Heading>
          <FormattedMessage
            id="airDiscount.heading.title"
            defaultMessage="Lægra fargjald með loftbrú"
          />
        </Heading>
        <Typography>
          <FormattedMessage
            id="airDiscount.heading.subtitle"
            defaultMessage="Hver einstaklingur með lögheimili innan skilgreinds svæðis á rétt á afslætti á sex flugleggjum á ári. með notkun afsláttar með Loftbrú staðfestir þú að hafa lesið notendaskilmála Loftbrúar."
          />
        </Typography>
        <TOSLink>
          <Link
            url={
              'https://island.is/loftbru/notendaskilmalar-vegagerdarinnar-fyrir-loftbru'
            }
          >
            <LinkText>
              <FormattedMessage
                id="airDiscount.tosLinkText"
                defaultMessage="Notendaskilmálar"
              />
            </LinkText>
          </Link>
        </TOSLink>
        <Alert
          type="warning"
          title={intl.formatMessage({ id: 'airDiscount.alert.title' })}
          message={intl.formatMessage({ id: 'airDiscount.alert.description' })}
        />
      </SafeAreaView>
    </ScrollView>
  )
}

AirDiscountScreen.options = getNavigationOptions
