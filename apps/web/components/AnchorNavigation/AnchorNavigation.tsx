import React, { useMemo, useState } from 'react'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import { Bullet } from '@island.is/web/components'
import { Text, Box, FocusableBox, Stack } from '@island.is/island-ui/core'

export interface AnchorNavigationProps {
  title?: string
  navigation: Array<{ id: string; text: string }>
  position: 'left' | 'right'
}

export const AnchorNavigation = ({
  title,
  navigation,
  position = 'left',
}: AnchorNavigationProps) => {
  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids, { smooth: true })
  const [bulletRef, setBulletRef] = useState<HTMLElement>(null)

  return (
    <Box
      position="relative"
      paddingBottom={[0, 0, 0, 6]}
      paddingLeft={[3, 3, 4]}
      borderLeftWidth={'standard'}
      borderColor={'blue200'}
      borderStyle="solid"
    >
      <Box display={['none', 'none', 'none', 'block']}>
        {bulletRef && (
          <Bullet
            top={bulletRef.offsetTop}
            align={position === 'left' ? 'right' : 'left'}
            color="blue"
          />
        )}
      </Box>
      <Stack space={[1, 1, 2]}>
        {Boolean(title) && (
          <Box paddingBottom={1}>
            <Text variant="h4" as="h2">
              {title}
            </Text>
          </Box>
        )}

        {navigation.map(({ id, text }) => (
          <Text color={id === activeId ? 'blue400' : 'blue600'}>
            <FocusableBox
              ref={id === activeId ? setBulletRef : null}
              key={id}
              component="button"
              type="button"
              textAlign="left"
              onClick={() => navigate(id)}
            >
              {id === activeId ? <b>{text}</b> : text}
            </FocusableBox>
          </Text>
        ))}
      </Stack>
    </Box>
  )
}
