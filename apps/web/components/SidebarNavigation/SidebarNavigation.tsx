import React, { FC, useMemo, useState } from 'react'
import useScrollSpy from '../../hooks/useScrollSpy'
import { SidebarBox } from '../SidebarBox/SidebarBox'
import { Bullet } from '../Bullet/Bullet'
import { Text, Divider, Box, Stack } from '@island.is/island-ui/core'

export interface SidebarNavigationProps {
  title?: string
  navigation: Array<{ id: string; text: string }>
  position: 'left' | 'right'
}

export const SidebarNavigation: FC<SidebarNavigationProps> = ({
  title,
  navigation,
  position = 'right',
}) => {
  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids)
  const [bulletRef, setBulletRef] = useState<HTMLElement>(null)

  return (
    <SidebarBox position="relative">
      {bulletRef && (
        <Bullet
          top={bulletRef.offsetTop}
          align={position === 'left' ? 'right' : 'left'}
        />
      )}

      <Stack space={[1, 1, 2]}>
        {Boolean(title) && (
          <>
            <Text variant="h4" as="h2">
              {title}
            </Text>
            <Divider weight="alternate" />
          </>
        )}

        {navigation.map(({ id, text }) => (
          <Box
            ref={id === activeId ? setBulletRef : null}
            key={id}
            component="button"
            type="button"
            textAlign="left"
            onClick={() => navigate(id)}
          >
            <Text>{id === activeId ? <b>{text}</b> : text}</Text>
          </Box>
        ))}
      </Stack>
    </SidebarBox>
  )
}
