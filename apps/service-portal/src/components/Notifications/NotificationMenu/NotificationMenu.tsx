import React, { FC } from 'react'
import * as styles from './NotificationMenu.treat'
import cn from 'classnames'
import { Box, Typography, Stack, Button } from '@island.is/island-ui/core'
import { notifications } from './mockNotifications'
import NotificationCard from './NotificationCard/NotificationCard'
import { NotificationMenuState } from '../../../store/actions'

interface Props {
  state: NotificationMenuState
}

const NotificationMenu: FC<Props> = ({ state }) => {
  return (
    <Box
      className={cn(styles.wrapper, {
        [styles.active]: state === 'open',
      })}
    >
      <Box
        position="relative"
        boxShadow="large"
        background="white"
        className={styles.inner}
      >
        <Box padding={4}>
          {notifications.sections.map((section, index) => (
            <Box marginBottom={3} key={index}>
              <Stack space={1}>
                <Box marginBottom={1} textAlign="right">
                  <Typography variant="eyebrow" as="span" color="purple400">
                    Í dag
                  </Typography>
                </Box>
                {section.cards.map((card) => (
                  <NotificationCard key={card.id} card={card} />
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
        <Box
          className={styles.sticky}
          left={0}
          bottom={0}
          width="full"
          paddingY={4}
          paddingX={3}
          boxShadow="medium"
          background="white"
        >
          <Button width="fluid">Sjá öll skilaboð</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NotificationMenu
