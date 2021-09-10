import React from 'react'
import { Box } from '@island.is/island-ui/core'

// Get disclaimer.

const AssetDisclaimer = () => {
  return (
    <Box>
      <p style={{ marginTop: 32, fontWeight: 100 }}>
        22. gr. laga nr. 6/2001 um skráningu og mat fasteigna segir að skráður
        eigandi fasteignar sé sá sem hefur þinglýsta eignarheimild hverju sinni
        og skal eigendaskráning Þjóðskrár Íslands þar af leiðandi byggja á
        þinglýstum heimildum. Það athugist því ef misræmi er á eigendaskráningu
        í fasteignaskrá annars vegar og þinglýsingabók hins vegar gildir
        skráning þinglýsingabókar.
      </p>
      <p style={{ marginTop: 24, fontWeight: 100 }}>
        Þjóðskrá Íslands hefur umsjón með fasteignaskrá. Í skránni er að finna
        grunnupplýsingar um lönd og lóðir auk mannvirkja sem á þeim standa. Þar
        er meðal annars að finna upplýsingar um fasteigna- og brunabótamat,
        stærðir, byggingarár, byggingarefni, notkun og auðkennisnúmer eigna.
      </p>
    </Box>
  )
}

export default AssetDisclaimer
