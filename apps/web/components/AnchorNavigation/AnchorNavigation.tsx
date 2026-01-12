import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

import { Box, FocusableBox, Stack, Text } from '@island.is/island-ui/core'
import { Bullet } from '@island.is/web/components'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'

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
  const router = useRouter()
  const initialScrollHasHappened = useRef(false)
  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids, { smooth: true })
  const [bulletRef, setBulletRef] = useState<HTMLElement>()

  useEffect(() => {
    if (initialScrollHasHappened.current) return

    const hash = router.asPath?.split?.('#')?.[1]

    const navigationId = navigation?.find((n) => slugify(n.text) === hash)?.id

    if (hash && navigationId) {
      navigate(navigationId)
      initialScrollHasHappened.current = true
    }
  }, [navigate, navigation, router.asPath])

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
              ref={
                id === activeId
                  ? (arg) => {
                      setBulletRef(arg ?? undefined)
                    }
                  : undefined
              }
              key={id}
              component="button"
              type="button"
              textAlign="left"
              onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                history?.replaceState({}, '', `#${slugify(text)}`) // Store the hash of the anchor link in the url (without making the page jump)
                navigate(id)
              }}
            >
              {id === activeId ? <b>{text}</b> : text}
            </FocusableBox>
          </Text>
        ))}
      </Stack>
    </Box>
  )
}
