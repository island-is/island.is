import { defineMessage, defineMessages } from 'react-intl'

// Strings on policeDemandsForm
export const policeDemandsForm = {
  courtClaim: {
    heading: defineMessage({
      id: 'judicial.system:forms.policeDemands.courtClaim.heading',
      defaultMessage: 'Dómkröfur',
      description: 'Police Demands form Court claim: Heading',
    }),
    label: defineMessage({
      id: 'judicial.system:forms.policeDemands.courtClaim.label',
      defaultMessage: 'Krafa lögreglu',
      description: 'Police Demands form Court claim: label',
    }),
    placeholder: defineMessage({
      id: 'judicial.system:forms.policeDemands.courtClaim.placeholder',
      defaultMessage: 'Krafa ákæranda',
      description: 'Police Demands form Court claim: placeholder',
    }),
    prefill: defineMessages({
      searchWarrant: {
        id:
          'judicial.system:forms.policeDemands.courtClaim.prefill.searchWarrant',
        defaultMessage:
          'Í þágu rannsóknar sakamáls er þess krafist að Héraðsdómur Reykjavíkur veiti lögreglustjóranum á höfuðborgarsvæðinu heimild til leitar í {address}, þar sem {accusedName} á dvalarstað, í því skyni að handtaka hann og hafa uppi á munum sem hald skal leggja á. Heimildin nái til leitar í læstum hirslum og í geymslum tilheyrandi framangreindu húsnæði svo og til rannsóknar á efnisinnihaldi raftækja, svo sem símum, tölvum og öðrum rafrænum gagnavörslumunum, sem þar er að finna.',
        description: 'Police Demands form Court claim prefill: Search Warrant',
      },
      bankingSecrecyWaiver: {
        id:
          'judicial.system:forms.policeDemands.courtClaim.prefill.bankingSecrecyWaiver',
        defaultMessage:
          'Þess er krafist að [fjármálafyrirtæki - aðrir sem hafa uppl.], verði með úrskurði Héraðsdóms Reykjavíkur gert skylt að láta lögreglu í hendur allar upplýsingar sem þessi fyrirtæki kunna að hafa um banka og fjármálaviðskipti, þ.á.m. bankareikninga, verðbréfa- og afleiðuviðskipti, lánaviðskipti og greiðslukortaviðskipti, gjaldeyriskaup, peningasendingar og bankahólf er varða [aðili, kt.], vegna tímabilsins frá [DD.MM.ÁÁ]',
        description:
          'Police Demands form Court claim prefill: Banking Secrecy Waiver',
      },
      phoneTapping: {
        id:
          'judicial.system:forms.policeDemands.courtClaim.prefill.phoneTapping',
        defaultMessage:
          'Þess er krafist að Héraðsdómur Reykjavíkur úrskurði að lögreglustjóranum á höfuðborgarsvæðinu sé heimilt að hlusta og hljóðrita símtöl úr og í símanúmerin [###-####] auk annara símanúmera sem {accusedName}, hefur í notkun og umráð yfir, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ], og jafnframt sé heimilt að nema sms sendingar, þar með taldar sms sendingar á lesanlegu formi, sem sendar eru eða mótteknar með símanúmerunum á sama tíma og hlusta og hljóðrita samtöl við talhólf greindra númera og símtækja á sama tíma.',
        description: 'Police Demands form Court claim prefill: Phone Tapping',
      },
      teleCommunications: {
        id:
          'judicial.system:forms.policeDemands.courtClaim.prefill.teleCommunications',
        defaultMessage:
          'Þess er krafist að Héraðsdómur Reykjavíkur úrskurði að [fjarskiptafyrirtæki], verði gert skylt að veita lögreglustjóranum á höfuðborgarsvæðinu upplýsingar um hvaða símanúmer hafi verið í sambandi við símanúmerið [###-####] eða önnur númer og símtæki sem {accusedName}, hefur haft til umráða frá og með [DD.MM.ÁÁ] til [DD.MM.ÁÁ] og IMEI númer sem viðkomandi símanúmer nota á sama tímabili, jafnframt sendar og mótteknar sms sendingar, sem og samtöl við talhólf greinds númers, en jafnframt verði upplýst hverjir eru rétthafar þeirra númera sem þannig tengjast greindum númerum á sama tíma. Þá er krafist upplýsinga um netnotkun símanúmersins og símtækja sem og tengingar við símsenda, hvort sem er vegna símtala eða netnotkunar og upplýsinga um gagnanotkun og gagnamagn á sama tímabili. Jafnframt er krafist upplýsinga um þau símanúmer sem tengst hafa IMEI/IMSEI númerum símtækjanna sem ofangreint númer er notað í á sama tímabili. Þá er krafist upplýsinga um hvaða endurvarpa (BASE-stöðvar) í fjarskiptakerfum fyrirtækjanna hafa farið símtöl úr og í ofangreint númer og önnur símanúmer og símtæki sem umráðamaður hefur haft í umráðum á sama tíma.',
        description:
          'Police Demands form Court claim prefill: Telecommunications',
      },
      trackingEquipment: {
        id:
          'judicial.system:forms.policeDemands.courtClaim.prefill.trackingEquipment',
        defaultMessage:
          'Þess er krafist að Héraðsdómur Reykjavíkur úrskurði um að lögreglustjóranum á höfuðborgarsvæðinu sé heimilt að koma fyrir eftirfararbúnaði á eða í bifreiðunum [#] svo og öðrum þeim bifreiðum sem {accusedName}, kann að hafa umráð yfir á úrskurðartímanum, og fylgjast með staðsetningum/ferðum bifreiðanna án þess að eigandi hennar, ökumaður, farþegar og aðrir hlutaðeigandi viti af því, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ]',
        description:
          'Police Demands form Court claim prefill: Tracking Equipment',
      },
    }),
  },
}
