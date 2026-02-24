import React from 'react'
import { useIntl } from 'react-intl'
import { Image, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import chevronForwardIcon from '@/assets/icons/chevron-forward.png'
import closeIcon from '@/assets/icons/close.png'
import vehicleIcon from '@/assets/icons/filled-vehicle.png'
import { navigateTo } from '@/lib/deep-linking'
import { Typography } from '@/ui'

const Host = styled.View`
  padding: ${({ theme }) => theme.spacing.p2}px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.blue100};
  flex-direction: row;
  align-items: flex-start;
`

const IconWrapper = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.white};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`

const HeaderContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Content = styled.View`
  gap: ${({ theme }) => theme.spacing[1]}px;
  flex: 1;
`

const CloseButton = styled(TouchableOpacity)`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
`

const CtaRow = styled(TouchableOpacity)`
  margin-top: ${({ theme }) => theme.spacing.smallGutter}px;
  flex-direction: row;
  align-items: center;
`

interface HomeBannerProps {
  visible: boolean
  onClose: () => void
}

export const HomeBanner = ({ visible, onClose }: HomeBannerProps) => {
  const theme = useTheme()
  const intl = useIntl()

  if (!visible) {
    return null
  }

  return (
    <Host>
      <Content>
        <HeaderContainer>
          <TitleContainer>
            <IconWrapper>
              <Image
                resizeMode="contain"
                source={vehicleIcon}
                style={{ width: 12, height: 12 }}
              />
            </IconWrapper>
            <Typography color={theme.color.dark400} variant="eyebrow">
              {intl.formatMessage({ id: 'homeBanner.vehicleMileage.title' })}
            </Typography>
          </TitleContainer>
          <CloseButton onPress={onClose}>
            <Image
              source={closeIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: theme.color.dark400,
                opacity: 0.3,
              }}
            />
          </CloseButton>
        </HeaderContainer>
        <Typography variant="body3">
          {intl.formatMessage({
            id: 'homeBanner.vehicleMileage.description',
          })}
        </Typography>

        <CtaRow onPress={() => navigateTo('/vehicles')}>
          <Typography color={theme.color.blue400} variant="eyebrow">
            {intl.formatMessage({ id: 'homeBanner.vehicleMileage.cta' })}
          </Typography>
          <Image
            source={chevronForwardIcon}
            style={{
              width: 16,
              height: 16,
              tintColor: theme.color.blue400,
            }}
          />
        </CtaRow>
      </Content>
    </Host>
  )
}
