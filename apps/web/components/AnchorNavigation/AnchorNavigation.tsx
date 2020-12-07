import React, { useMemo, useState } from 'react'
import useScrollSpy from '../../hooks/useScrollSpy'
import { Bullet } from '../Bullet/Bullet'
import { Text, Box, FocusableBox, Stack } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'

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
  const [activeId, navigate] = useScrollSpy(ids)
  const [bulletRef, setBulletRef] = useState<HTMLElement>(null)
  const { width } = useWindowSize()
  const [isDesktop, setIsDesktop] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width >= theme.breakpoints.lg) {
      return setIsDesktop(true)
    }
    setIsDesktop(false)
  }, [width])

  return (
    <Box
      position="relative"
      marginLeft={[0, 0, 0, 4]}
      paddingBottom={[0, 0, 0, 6]}
      paddingLeft={[3, 3, 4]}
      borderLeftWidth={'standard'}
      borderColor={'blue200'}
      borderStyle="solid"
    >
      {bulletRef && isDesktop && (
        <Bullet
          top={bulletRef.offsetTop}
          align={position === 'left' ? 'right' : 'left'}
          color="blue"
        />
      )}

      <Stack space={[1, 1, 2]}>
        {Boolean(title) && (
          <Box paddingBottom={1}>
            <Text
              variant="h4"
              as="h2"
              color={isDesktop ? 'blue600' : 'dark400'}
            >
              {title}
            </Text>
          </Box>
        )}

        {navigation.map(({ id, text }) => (
          <FocusableBox
            ref={id === activeId ? setBulletRef : null}
            key={id}
            component="button"
            type="button"
            textAlign="left"
            onClick={() => navigate(id)}
          >
            <Text color="blue600">
              {id === activeId ? <b>{text}</b> : text}
            </Text>
          </FocusableBox>
        ))}
      </Stack>
    </Box>
  )
}
