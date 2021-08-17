import React, { useContext, useState } from 'react'
import {
  Text,
  ActionCard,
  Box,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { useQuery } from '@apollo/client'
import { GetApplicationEventQuery } from '@island.is/financial-aid-web/oskgraphql'
import {
  ApplicationEvent,
  translateMonth,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

// import * as styles from '@island.is/financial-aid/shared/src/styles.css'

interface ApplicationEventData {
  applicationEvents: ApplicationEvent[]
}

const MainPage = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)

  const [accordionIndex, setAccordionIndex] = useState(0)

  const currentMonth = parseInt(format(new Date(), 'MM'))
  const currentYear = format(new Date(), 'yyyy')

  const { data, error, loading } = useQuery<ApplicationEventData>(
    GetApplicationEventQuery,
    {
      variables: { input: { id: user?.activeApplication } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const mainInfo = [
    {
      heading: 'Staða umsóknar',
      text: 'Umsókn móttekin og er í vinnslu',
      label: 'Sjá nánar',
      link: 'timalina',
    },
    {
      heading: 'Áætluð aðstoð',
      text: '98.900 kr. til greiðslu 1. eða 2. júní 2021',
      label: 'Sjá nánar',
      link: 'utreikningur',
    },
    {
      heading: 'Senda inn gögn',
      text:
        'Þú getur alltaf sent okkur gögn sem þú telur hjálpa umsókninni, t.d. launagögn',
      label: 'Hlaða upp gögnum',
      link: 'gogn',
    },
  ]

  return (
    <StatusLayout>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>
        <Text as="h2" variant="h3" color="blue400" marginBottom={[4, 4, 7]}>
          Til útgreiðslu í {translateMonth(currentMonth).toLowerCase()} {` `}{' '}
          {currentYear}
        </Text>

        {mainInfo.map((item, index) => {
          return (
            <>
              <Box marginBottom={[2, 2, 3]}>
                <ActionCard
                  heading={item.heading}
                  text={item.text}
                  cta={{
                    label: item.label,
                    onClick: () => {
                      router.push('/stada/' + item.link)
                      // setAccordionIndex(index + 1)
                    },
                  }}
                />
              </Box>
            </>
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
      </FormContentContainer>
      <FormFooter
        onPrevButtonClick={() => {}}
        prevButtonText="Skrá sig út"
        previousIsDestructive={true}
        hideNextButton={true}
      />
    </StatusLayout>
  )
}

export default MainPage
