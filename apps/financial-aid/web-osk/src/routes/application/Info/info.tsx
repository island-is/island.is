import React, { useEffect, useState, useCallback } from 'react'
import { Text, Icon, Box, Checkbox } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'

import * as styles from './info.treat'

const ApplicationInfo = () => {

  const [accept, setAccept] = useState(false)
  
  return (
    <FormLayout activeSection={0}>

      <FormContentContainer>

        <Text as="h1" variant="h2" marginBottom={5}>
          Gagnaöflun
        </Text>

        <Box display="flex" alignItems="center" marginBottom={3}>

          <Icon
            color="blue400"
            icon="fileTrayFull"
            size="large"
            type="outline"
            className={styles.iconMargin}
          />

          <Text as="h2" variant="h4">
            Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.
          </Text>

        </Box>

        <Text marginBottom={2}>
          Við þurfum að fá þig til að renna yfir nokkur atriði og 
          gefa upplýsingar um búsetu og laun yfir síðustu 2 mánuði, 
          ef einhver, til að reikna út aðstoð til útgreiðslu í byrjun apríl.
        </Text>
        <Text marginBottom={3}>
          Í lokin velurðu að senda inn umsóknina eða eyða henni og öllum tengdum gögnum.
        </Text>

     
        <Text  as="h3" variant="h4"   color="blue400">
          Upplýsingar um styrki og bætur
        </Text>
        <Text marginBottom={2}>
          T.a.m. hjá Vinnumálastofnun, Sjúkratryggingum Íslands, o.fl.
        </Text>

          
        <Text  as="h3" variant="h4"   color="blue400">
          Upplýsingar um stöðu og eignir
        </Text>
        <Text marginBottom={5}>
        T.a.m. hjá þjóðskrá og Skattinum.
        </Text>

        <Box marginBottom={10}>
          <Checkbox
            name={'accept'}
            backgroundColor="blue"
            label="Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu"
            large checked={accept}
            onChange={(event) => {
              setAccept(event.target.checked)
            }}
          />
        </Box>


      </FormContentContainer>

      <FormFooter 
        previousIsDestructive={true} 
        nextUrl="/umsokn/netfang" 
        nextIsDisabled={!accept} 
        nextButtonText="Staðfesta"
      />

    </FormLayout>
  )
}

export default ApplicationInfo
