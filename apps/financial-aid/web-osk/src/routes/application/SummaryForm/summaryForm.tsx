import React, { useEffect, useState, useContext } from 'react'
import { Text ,Divider, Box, Button, AccordionCard, ContentBlock} from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './summaryForm.treat'
import cn from 'classnames'

import useFormNavigation from '../../../utils/formNavigation'

const SummaryForm = () => {

  const { form, updateForm } = useContext(FormContext)
  const navigation = useFormNavigation({currentId: 'summary'});

  const router = useRouter()

  const calculation = [
    {
      label: 'Full upphæð aðstoðar',
      sum: '+ 200.000 kr.'
    },
    {
      label: 'Ofgreidd aðstoð í Feb 2021',
      sum: '- 10.000 kr.'
    },
    {
      label: 'Skattur',
      sum: '- 24.900 kr.'
    },
    {
      label: 'Persónuafsláttur',
      sum: '+ 32.900 kr.'
    }
  ]


  const overview = [
    {
      label:'Heimili',
      url: 'heimili',
      info: form?.address ? 'Hafnargata 3, 220 Hafnarfjörður' : form?.customHomeAddress + ', ' + form?.customPostalCode
    },
    {
      label:'Búseta',
      url: 'buseta',
      info: form?.homeCircumstancesCustom ? form?.homeCircumstancesCustom : form?.homeCircumstances
    },
    {
      label:'Tekjur',
      url: 'tekjur',
      info: form?.incomeFiles ? 'Ég hef fengið tekjur í þessum mánuði eða síðasta' : 'Ég hef ekki fengið tekjur í þessum mánuði eða síðasta'
    },
    {
      label:'Staða',
      url: 'stada',
      info: form?.employmentCustom ? form?.employmentCustom : form?.employment
    }

  ]

  return (
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Yfirlit umsóknar
        </Text>
        <Text marginBottom={[3, 3, 5]}>
          Við eigum enn eftir að klára gagnaöflun en samkvæmt því sem við vitum um 
          þig í dag getur þú miðað við:
        </Text>
      
        <Divider />

          <Text as="h2" variant="h5" paddingTop={[4, 4, 5]}>
           Áætluð aðstoð
          </Text>

          <Text  marginBottom={[4, 4, 5]}>
           <strong>UPPHÆÐ kr.</strong> til útgreiðslu 2. eða 3. maí 2021
          </Text>

          <Text variant="small"  marginBottom={[3, 3, 5]}>
            Athugaðu að þetta er áætluð upphæð sem getur breyst. Þú færð svar 
            frá okkur innan þriggja vinnudaga um niðurstöðu umsóknar þinnar.
          </Text>

        <ContentBlock>

          <Box marginBottom={[4, 4, 5]}>

            <AccordionCard 
              id="id_1" 
              label="Sundurliðaður útreikningur" 
             
            >
                 
            {calculation.map((item, index) => {
              return(
                <>

                  {index !== 0 && (
                    <Divider /> 
                  )}

                  <Box 
                    display="flex" 
                    justifyContent="spaceBetween" 
                    alignItems="center" 
                    paddingTop={2}
                    paddingBottom={index === (calculation.length - 1)  ? 0 : 2}
                  >
                    <Text variant="small">
                        {item.label}
                    </Text>
                    <Text fontWeight="semiBold">
                        {item.sum}
                    </Text>
                  </Box>
                </>
              )
            })

            }

            </AccordionCard>

          </Box>

        </ContentBlock>


        {overview.map((item, index) => {
          return(
            <>
              <Divider /> 

              <Box 
                display="flex" 
                justifyContent="spaceBetween" 
                alignItems="flexStart"
                paddingY={[4, 4, 5]}
                className={cn({
                  [`${styles.marginBottom}`]: index === (overview.length - 1),
                })}
              >

                <Box marginRight={3}>
                  <Text fontWeight="semiBold">{item.label}</Text>
                  <Text>{item.info}</Text>
                </Box>

                <Button
                  icon="pencil"
                  iconType="filled"
                  variant="utility"
                  onClick={() => {
                    router.push(item.url)
                  }}
                >
                  Breyta
                </Button>

              </Box>

            </>
          )
        })}

      </FormContentContainer>

      <FormFooter 
        previousUrl={navigation?.prevUrl ?? '/'}  
        nextUrl={navigation?.nextUrl ?? '/'}
      />
    </FormLayout>
  )
}

export default SummaryForm
