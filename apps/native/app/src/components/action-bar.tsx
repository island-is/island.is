import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'

import inboxReadIcon from '@/assets/icons/inbox-read.png'
import starIcon from '@/assets/icons/star.png'
import archiveIcon from '@/assets/icons/tray.png'
import { screenWidth } from '@/utils/dimensions'
import { Loader, Typography } from '@/ui'

const Wrapper = styled(Animated.View)`
  height: 52px;
  position: absolute;
  bottom: ${({ theme }) => theme.spacing[2]}px;
  right: ${({ theme }) => theme.spacing[2]}px;
  border: 1px solid ${({ theme }) => theme.color.blue200};
  background-color: ${({ theme }) => theme.color.blue100};
  border-radius: ${({ theme }) => theme.border.radius.large};
  padding-vertical: ${({ theme }) => theme.spacing.smallGutter}px;
  padding-horizontal: ${({ theme }) => theme.spacing.smallGutter}px;
  flex-direction: row;
  justify-content: space-between;
`

const ActionBarItem = styled.TouchableHighlight`
  border-radius: ${({ theme }) => theme.border.radius.standard};
  padding-vertical: ${({ theme }) => theme.spacing.p2}px;
  padding-horizontal: ${({ theme }) => theme.spacing[1]}px;
`

const ItemWrapper = styled.View<{ wrapItem?: boolean }>`
  flex-direction: ${({ wrapItem }) => (wrapItem ? 'column' : 'row')};
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 6px;
`

const LoaderWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`

export const ActionBar = ({
  onClickStar,
  onClickArchive,
  onClickMarkAsRead,
  loading = false,
}: {
  onClickStar: () => void
  onClickArchive: () => void
  onClickMarkAsRead: () => void
  loading?: boolean
}) => {
  const theme = useTheme()
  const intl = useIntl()
  const shouldWrapItems = screenWidth < 380
  return (
    <Wrapper
      style={{ width: screenWidth - theme.spacing[4] }}
      entering={FadeInDown}
      exiting={FadeOutDown}
    >
      {loading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <ActionBarItem
            onPress={onClickStar}
            underlayColor={theme.shade.shade400}
            accessibilityRole="button"
            accessibilityLabel={intl.formatMessage({
              id: 'inbox.bulkSelectActionStar',
              defaultMessage: 'Stjörnumerkja',
            })}
          >
            <ItemWrapper wrapItem={shouldWrapItems}>
              <Image
                source={starIcon}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: theme.color.blue400,
                }}
                resizeMode="contain"
              />
              <Typography variant="body3">
                <FormattedMessage
                  id="inbox.bulkSelectActionStar"
                  defaultMessage="Stjörnumerkja"
                />
              </Typography>
            </ItemWrapper>
          </ActionBarItem>
          <ActionBarItem
            onPress={onClickArchive}
            underlayColor={theme.shade.shade400}
            accessibilityRole="button"
            accessibilityLabel={intl.formatMessage({
              id: 'inbox.bulkSelectActionArchive',
              defaultMessage: 'Geymsla',
            })}
          >
            <ItemWrapper wrapItem={shouldWrapItems}>
              <Image
                source={archiveIcon}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: theme.color.blue400,
                }}
                resizeMode="contain"
              />
              <Typography variant="body3">
                <FormattedMessage
                  id="inbox.bulkSelectActionArchive"
                  defaultMessage="Geymsla"
                />
              </Typography>
            </ItemWrapper>
          </ActionBarItem>
          <ActionBarItem
            onPress={onClickMarkAsRead}
            underlayColor={theme.shade.shade400}
            accessibilityRole="button"
            accessibilityLabel={intl.formatMessage({
              id: 'inbox.bulkSelectActionRead',
              defaultMessage: 'Merkja lesið',
            })}
          >
            <ItemWrapper wrapItem={shouldWrapItems}>
              <Image
                source={inboxReadIcon}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: theme.color.blue400,
                }}
                resizeMode="contain"
              />
              <Typography variant="body3">
                <FormattedMessage
                  id="inbox.bulkSelectActionRead"
                  defaultMessage="Merkja lesið"
                />
              </Typography>
            </ItemWrapper>
          </ActionBarItem>
        </>
      )}
    </Wrapper>
  )
}
