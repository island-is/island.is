import React from 'react'
import { ActionCard, Box, Text } from '@island.is/island-ui/core'

import * as styles from './Status.css'

import {
  Application,
  ApplicationState,
  getNextPeriod,
  getState,
  Routes,
} from '@island.is/financial-aid/shared/lib'

import { Estimation } from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

interface Props {
  currentApplication: Application
}

const InProgress = ({ currentApplication }: Props) => {
  const router = useRouter()

  if (
    currentApplication.state === ApplicationState.APPROVED ||
    currentApplication.state === ApplicationState.REJECTED
  ) {
    return null
  }
  return (
    <>
      <Text as="h2" variant="h3" color="blue400" marginBottom={[4, 4, 5]}>
        Umsókn {getState[currentApplication.state].toLowerCase()} til útgreiðslu
        í {getNextPeriod.month} {` `} {getNextPeriod.year}
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
            Þú færð skilaboð þegar frekari útreikningur liggur fyrir. Umsóknin
            verður afgreidd eins fljótt og auðið er.
          </Text>
        }
      />
    </>
  )
}

export default InProgress
