import React, { FC, useState } from 'react'
import { ExternalDataProviderScreen } from '../types'
import { Box, Checkbox } from '@island.is/island-ui/core'

const FormExternalDataProvider: FC<{
  externalDataProvider: ExternalDataProviderScreen
}> = ({ externalDataProvider }) => {
  const [hasAccepted, setHasAccepted] = useState(false)
  const { name, dataProviders } = externalDataProvider
  return (
    <Box>
      <Checkbox
        id={name}
        checked={hasAccepted}
        value="hasAccepted"
        onChange={() => {
          console.log({ hasAccepted })
          setHasAccepted(!hasAccepted)
        }}
        label="Ég samþykki að sækja megi ofangreindar upplýsingar til að nýta við úrvinnslu umsóknarinnar ásamt innslegnum upplýsingum og þar með til að meta hvort ég uppfylli skilyrði til að fá stuðningslán. Auk þess er mér kunnugt um að í kjölfarið verði upplýsingunum miðlað til lánastofnunar minnar. Fjármála- og efnahagsráðuneytið mun, á grundvelli upplýsinga sem Seðlabankinn móttekur frá lánastofnunum, birta opinberlega upplýsingar um rekstraraðila sem njóta ábyrgðar, innan 12 mánaða frá því lán með ábyrgð er veitt."
      />
    </Box>
  )
}

export default FormExternalDataProvider
