import { useEffect, useMemo, useRef, useState } from 'react'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import { Bullet } from '@island.is/web/components'
import { Text, Box, FocusableBox, Stack } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

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
  const [bulletRef, setBulletRef] = useState<HTMLElement>(null)

  useEffect(() => {
    if (initialScrollHasHappened.current) return

    const selectedOption = router?.query?.selectedOption

    const navigationId = navigation?.find(
      (n) => slugify(n.text) === selectedOption,
    )?.id

    if (selectedOption && navigationId) {
      navigate(navigationId)
      initialScrollHasHappened.current = true
    }
  }, [navigate, navigation, router?.query?.selectedOption])

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
              onClick={() => {
                navigate(id)
                router.push(
                  {
                    pathname: router.asPath.split('?')[0],
                    query: { selectedOption: slugify(text) },
                  },
                  undefined,
                  { shallow: true },
                )
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
