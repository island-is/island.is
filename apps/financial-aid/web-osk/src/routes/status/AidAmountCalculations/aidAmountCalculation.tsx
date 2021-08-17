import React, { useContext } from 'react'
import { Text, LoadingDots } from '@island.is/island-ui/core'

import {
  Estimation,
  FormContentContainer,
  FormFooter,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import * as styles from './aidAmountCalculation.treat'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { Application } from '@island.is/financial-aid/shared'
import { GetApplicationQuery } from '@island.is/financial-aid-web/oskgraphql'
import { useQuery } from '@apollo/client'

interface ApplicantData {
  application: Application
}

const AidAmountCalculations = () => {
  const { user } = useContext(UserContext)

  const { data, error, loading } = useQuery<ApplicantData>(
    GetApplicationQuery,
    {
      variables: { input: { id: user?.activeApplication } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  return (
    <StatusLayout>
      <FormContentContainer>
        {data && (
          <Estimation
            homeCircumstances={data?.application.homeCircumstances}
            usePersonalTaxCredit={data?.application.usePersonalTaxCredit}
            aboutText={
              <Text marginBottom={[2, 2, 3]}>
                Athugaðu að þessi útreikningur er{' '}
                <span className={styles.taxReturn}>
                  eingöngu til viðmiðunar og getur tekið breytingum.
                </span>{' '}
                Þú færð skilaboð þegar frekari útreikningur liggur fyrir.
                Niðurstaða umsóknar þinnar ætti að liggja fyrir innan X virkra
                daga.
              </Text>
            }
          />
        )}
        {loading && <LoadingDots />}
      </FormContentContainer>
      <FormFooter
        previousUrl="/stada"
        prevButtonText="Til baka"
        hideNextButton={true}
      />
    </StatusLayout>
  )
}

export default AidAmountCalculations
