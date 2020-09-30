import React from 'react'
import {
  ShoppingFigure,
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

export const EducationOverview: ServicePortalModuleComponent = () => {
  return (
    <InfoScreen
      title="Menntun"
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
      institutionTitle="Samgöngustofa"
      institutionDescription={`
		Vinnumálastofnun heyrir undir félagsmálráðuneytið og fer m.a. með
		yfirstjórn vinnumiðlunar í landinu og daglega afgreiðslu
		Atvinnuleysistryggingasjóðs, Fæðingarorlofssjóðs, Ábyrgðarsjóðs
		launa auk fjölmargra annara vinnumarkaðstengdra verkefna.
	`}
      institutionHref="https://www.heilsuvera.is/"
      institutionLinkTitle="Vefur heilsuveru - www.heilsuvera.is/"
      renderFigure={() => <ShoppingFigure />}
    />
  )
}

export default EducationOverview
