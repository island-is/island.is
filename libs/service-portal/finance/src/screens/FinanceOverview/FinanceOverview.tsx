import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
  ShoppingFigure,
} from '@island.is/service-portal/core'

export const FinanceOverview: ServicePortalModuleComponent = () => {
  return (
    <InfoScreen
      title="Fjármál"
      intro={`
		Hér eru upplýsingar um það sem kemur til með að koma inn undir
		fjármál á næstunni.
	`}
      list={{
        title: 'Á döfinni',
        items: [
          'Yfirlit og hægt verður að greiða öll opinber gjöld',
          'Ganga frá skattskýrsla og sjá eldi skattskýrslur',
          'Sjá yfirlit og ráðstafa séreignarsparnaði',
        ],
      }}
      institutionTitle="Ríkisskattstjóri"
      institutionDescription={`
		Vinnumálastofnun heyrir undir félagsmálráðuneytið og fer m.a. með
		yfirstjórn vinnumiðlunar í landinu og daglega afgreiðslu
		Atvinnuleysistryggingasjóðs, Fæðingarorlofssjóðs, Ábyrgðarsjóðs
		launa auk fjölmargra annara vinnumarkaðstengdra verkefna.
	`}
      institutionHref="https://www.rsk.is/"
      institutionLinkTitle="Vefur ríkisskattstjóra - www.rsk.is"
      renderFigure={() => <ShoppingFigure />}
    />
  )
}

export default FinanceOverview
