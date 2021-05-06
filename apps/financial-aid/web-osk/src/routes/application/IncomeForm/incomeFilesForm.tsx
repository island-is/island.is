import React, { useEffect, useState, useContext, useReducer } from 'react'
import { Text, InputFileUpload, Box} from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout,  } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import * as styles from './incomeForm.treat'
import useFormNavigation from '../../../utils/formNavigation'
import cn from 'classnames'

const IncomeFilesForm = () => {

  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const [state, dispatch] = useReducer(form?.incomeFiles, form?.incomeFiles)
  const [error, setError] = useState<string | undefined>(undefined)

  // const navigation = useFormNavigation({currentId: 'income'});




  return (
    <FormLayout activeSection={2}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={2}>
          Tekjugögn
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Við þurfum að sjá gögn um tekjur í þessum og síðasta mánuði. 
          Þú getur smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.
        </Text>

        <div className={styles.fileContainer}>

          <Box
            className={styles.files}
          >

            <InputFileUpload
              fileList={state}
              header="Dragðu gögn hingað"
              description="Tekið er við öllum hefðbundnum skráargerðum"
              buttonLabel="Bættu við gögnum"
              onChange={() => {}}
              onRemove={() => {}}
              // errorMessage={state.length > 0 ? error : undefined}
            />

          </Box>



        </div>
        
      </FormContentContainer>

      <FormFooter 
        previousUrl={'/'}  
        nextButtonText="Skila gögnum seinna"
        onNextButtonClick={() => {

          // if(form?.hasIncome !== undefined){
          //   router.push(navigation?.nextUrl ?? '/')
          // }
          // else{
          //   setError(true)
          // }
        }}
      />
    </FormLayout>
  )
}

export default IncomeFilesForm
