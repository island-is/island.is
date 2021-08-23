import React, { useContext, useMemo } from 'react'
import {
  Text,
  ActionCard,
  Box,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import {
  ApplicationState,
  getState,
  translateMonth,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

const MainPage = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)
  const logOut = useLogOut()

  const currentState = useMemo(() => {
    if (user?.activeApplication) {
      return user.activeApplication[0].state
    }
  }, [user])

  const activeApplicationID = useMemo(() => {
    if (user?.activeApplication) {
      return user.activeApplication[0].id
    }
  }, [user])

  const currentMonth = parseInt(format(new Date(), 'MM'))
  const currentYear = format(new Date(), 'yyyy')

  const mainInfo = [
    {
      heading: 'Staða umsóknar',
      text: `Umsókn móttekin og staðan er ${
        currentState && getState[currentState].toLowerCase()
      }`,
      label: 'Sjá nánar',
      link: `${activeApplicationID}`,
    },
    {
      heading: 'Áætluð aðstoð',
      text: 'xx.xxx kr. til greiðslu 1. eða 2. mánuður',
      label: 'Sjá nánar',
      link: 'utreikningur',
    },
    currentState === ApplicationState.DATANEEDED
      ? {
          heading: 'Vantar gögn',
          text:
            'Við þurfum að fá gögn frá þér áður en við getum haldið áfram með umsóknina.',
          label: 'Hlaða upp gögnum',
          link: 'gogn',
          bg: true,
        }
      : {
          heading: 'Senda inn gögn',
          text:
            'Þú getur alltaf sent okkur gögn sem þú telur hjálpa umsókninni, t.d. launagögn',
          label: 'Hlaða upp gögnum',
          link: 'gogn',
          bg: false,
        },
  ]

  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>
        <Text as="h2" variant="h3" color="blue400" marginBottom={[4, 4, 7]}>
          Til útgreiðslu í {translateMonth(currentMonth).toLowerCase()} {` `}{' '}
          {currentYear}
        </Text>

        {mainInfo.map((item, index) => {
          return (
            <Box marginBottom={[2, 2, 3]} key={'actionCards-' + index}>
              <ActionCard
                heading={item.heading}
                text={item.text}
                cta={{
                  label: item.label,
                  onClick: () => {
                    router.push('/stada/' + item.link)
                  },
                }}
                backgroundColor={item.bg ? 'blue' : 'white'}
              />
            </Box>
          )
        })}

        <Text as="h4" variant="h3" marginBottom={2} marginTop={[3, 3, 7]}>
          Frekari aðgerðir í boði
        </Text>
        <Box marginBottom={[5, 5, 10]}>
          <BulletList type={'ul'} space={2}>
            <Bullet>
              <Button
                colorScheme="default"
                iconType="filled"
                onClick={() => console.log('ddd')}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="text"
              >
                Upplýsingar um fjárhagsaðstoð
              </Button>
            </Bullet>
            <Bullet>
              <Button
                colorScheme="default"
                iconType="filled"
                onClick={() => console.log('ddd')}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="text"
              >
                Hafa samband
              </Button>
            </Bullet>
          </BulletList>
        </Box>
      </ContentContainer>
      <Footer
        onPrevButtonClick={() => {
          logOut()
        }}
        prevButtonText="Skrá sig út"
        previousIsDestructive={true}
        hideNextButton={true}
      />
    </StatusLayout>
  )
}

export default MainPage
