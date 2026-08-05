import React, { isValidElement } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import {
  Image,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'

import starFilledIcon from '../../../assets/icons/star-filled.png'
import checkmarkIcon from '../../assets/icons/checkmark.png'
import { theme } from '@/ui/utils'
import { Icon as UIIcon } from '../icon/icon'
import { Label } from '../label/label'
import { Typography } from '../typography/typography'

const styles = StyleSheet.create({
  host: {
    flexDirection: 'row',
    borderBottomWidth: theme.border.width.standard,
    borderBottomColor: theme.color.blue200,
  },
  hostUnread: {
    backgroundColor: theme.color.blue100,
  },
  icon: {
    marginVertical: theme.spacing[3],
    marginHorizontal: theme.spacing[2],
    backgroundColor: theme.color.blue100,
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 42,
    flexDirection: 'column',
  },
  iconUnread: {
    backgroundColor: theme.color.white,
  },
  iconSelectable: {
    borderWidth: theme.border.width.standard,
    borderColor: theme.color.blue200,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  selectedIconImage: {
    width: 50,
    height: 50,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[3],
    marginRight: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.smallGutter,
    gap: theme.spacing.smallGutter,
  },
  lowerRow: {
    alignItems: 'center',
    paddingBottom: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: theme.spacing.smallGutter,
  },
  subtitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    columnGap: theme.spacing.smallGutter,
  },
  spacer: {
    flex: 1,
  },
  starImage: {
    width: 16,
    height: 16,
    tintColor: theme.color.blue400,
  },
})

interface ListItemAction {
  id: string
  text: string
  onPress(props: ListItemAction): void
}

interface ListItemProps {
  title: string
  date?: Date | string
  subtitle: string
  unread?: boolean
  actions?: ListItemAction[]
  icon?: ImageSourcePropType | React.ReactNode
  starred?: boolean
  urgent?: boolean
  replyable?: boolean
  selectable?: boolean
  selected?: boolean
  onPressIcon?: () => void
}

export function ListItem({
  title,
  subtitle,
  date,
  icon,
  unread = false,
  urgent = false,
  starred = false,
  selectable = false,
  selected = false,
  replyable = false,
  onPressIcon,
}: ListItemProps) {
  const intl = useIntl()
  return (
    <SafeAreaView style={[styles.host, unread && styles.hostUnread]}>
      <View
        style={[
          styles.icon,
          unread && styles.iconUnread,
          selectable && !selected && styles.iconSelectable,
        ]}
      >
        <Pressable hitSlop={24} onPress={onPressIcon}>
          <Image
            source={
              selectable && selected
                ? checkmarkIcon
                : (icon as ImageSourcePropType)
            }
            style={
              selectable && selected
                ? styles.selectedIconImage
                : styles.iconImage
            }
          />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.title}>
            <Typography variant="body3" numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Typography>
          </View>
          {date && (
            <Typography variant="body3">
              <FormattedDate value={date} />
            </Typography>
          )}
        </View>
        <View style={[styles.row, styles.lowerRow]}>
          <View style={styles.subtitleWrapper}>
            <Typography variant="heading5" numberOfLines={1}>
              {subtitle}
            </Typography>
          </View>
          {replyable && (
            <UIIcon
              source={require('../../../assets/icons/reply.png')}
              width={12}
              height={12}
              tintColor="dark300"
            />
          )}
          <View style={styles.spacer} />
          {starred && (
            <Image source={starFilledIcon} style={styles.starImage} />
          )}
          {urgent && (
            <Label color="urgent" icon>
              {intl.formatMessage({ id: 'inbox.urgent' })}
            </Label>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
