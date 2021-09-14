import React from 'react'
import { ActionCard, Box, Text } from '@island.is/island-ui/core'

import * as styles from './Status.treat'

import format from 'date-fns/format'
import {
  ApplicationState,
  CurrentApplication,
  months,
  getState,
  Routes,
} from '@island.is/financial-aid/shared/lib'

import { Estimation } from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

interface Props {
  currentApplication: CurrentApplication
}

const InProgress = ({ currentApplication }: Props) => {
  const router = useRouter()

  const nextMonthFromCreated =
    new Date(currentApplication.created).getMonth() + 1
  const currentYear = format(new Date(), 'yyyy')

  return (
    <>
      <Text as="h2" variant="h3" color="blue400" marginBottom={[4, 4, 5]}>
        Umsókn {getState[currentApplication.state].toLowerCase()} til útgreiðslu
        í {months[nextMonthFromCreated].toLowerCase()} {` `} {currentYear}
      </Text>

      {currentApplication.state === ApplicationState.DATANEEDED && (
        <Box marginBottom={[4, 4, 5]}>
          <ActionCard
            heading="Vantar gögn"
            text="Við þurfum að fá gögn frá þér áður en við getum haldið áfram með umsóknina."
            cta={{
              label: 'Hlaða upp gögnum',
              onClick: () => {
                router.push(`
                ${Routes.statusFileUpload(router.query.id as string)}`)
              },
            }}
            backgroundColor="blue"
          />
        </Box>
      )}

      <Estimation
        homeCircumstances={currentApplication.homeCircumstances}
        usePersonalTaxCredit={currentApplication?.usePersonalTaxCredit}
        aboutText={
          <Text marginBottom={[2, 2, 3]}>
            Athugaðu að þessi útreikningur er{' '}
            <span className={styles.taxReturn}>
              eingöngu til viðmiðunar og getur tekið breytingum.
            </span>{' '}
            Þú færð skilaboð þegar frekari útreikningur liggur fyrir. Niðurstaða
            umsóknar þinnar ætti að liggja fyrir innan X virkra daga.
          </Text>
        }
      />
    </>
  )
}

export default InProgress
