import { Box, Icon, Tag, TagProps, Text } from '@island.is/island-ui/core'
import { PopoverDisclosure, usePopoverState } from 'reakit'
import { EmailCardPopover } from '../EmailCardPopover'
import * as styles from './EmailCard.css'
import { useIntl } from 'react-intl'
import { emailsMsg } from '../../../lib/messages'

export type EmailCta = {
  emailId: string
  label: string
  onClick(emailId: string): void
  isDestructive?: boolean
}

export type EmailCardTag =
  | 'primary'
  | 'not_verified'
  | 'connected_to_delegation'

type EmailCardProps = {
  title: string
  ctaList?: EmailCta[]
  tags?: EmailCardTag[]
}

export const EmailCard = ({ title, ctaList, tags }: EmailCardProps) => {
  const popover = usePopoverState()
  const { formatMessage } = useIntl()

  const getTagProps = (tag: EmailCardTag): TagProps => {
    switch (tag) {
      case 'not_verified':
        return {
          variant: 'yellow',
          children: formatMessage(emailsMsg.unverified),
        }
      case 'connected_to_delegation':
        return {
          variant: 'blue',
          children: formatMessage(emailsMsg.connectedToDelegation),
        }
      case 'primary':
      default:
        return {
          variant: 'mint',
          children: formatMessage(emailsMsg.primary),
        }
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      overflow="hidden"
    >
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Box
          display="flex"
          alignItems={['flexStart', 'flexStart', 'center']}
          columnGap={2}
          flexWrap="wrap"
          flexDirection={['column', 'column', 'row']}
          rowGap={1}
        >
          <Text variant="h4" color="dark400" truncate>
            {title}
          </Text>
          {tags && (
            <Box display="flex" columnGap={2}>
              {tags.map((tag, index) => (
                <Tag key={`${tag}-${index}`} {...getTagProps(tag)} />
              ))}
            </Box>
          )}
        </Box>
        {ctaList && (
          <>
            <PopoverDisclosure {...popover}>
              <span className={styles.icon}>
                <Icon icon="ellipsisHorizontal" color="blue400" />
              </span>
            </PopoverDisclosure>
            <EmailCardPopover {...popover}>
              {ctaList.map((cta, index) => (
                <Box
                  as="button"
                  onClick={() => {
                    popover.hide()
                    cta.onClick(cta.emailId)
                  }}
                  cursor="pointer"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      popover.hide()
                      cta.onClick(cta.emailId)
                    }
                  }}
                  key={cta.label}
                  tabIndex={0}
                  paddingY={2}
                  paddingX={3}
                  textAlign="center"
                  {...(index !== ctaList.length - 1 && {
                    borderBottomWidth: 'standard',
                    borderColor: 'blue200',
                  })}
                >
                  <Text
                    className={
                      cta.isDestructive
                        ? styles.menuItemDestructive
                        : styles.menuItemHover
                    }
                    color={cta.isDestructive ? 'red600' : 'dark400'}
                    key={cta.label}
                    fontWeight="semiBold"
                  >
                    {cta.label}
                  </Text>
                </Box>
              ))}
            </EmailCardPopover>
          </>
        )}
      </Box>
    </Box>
  )
}
