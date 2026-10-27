export const icDemands = {
  heading: 'Dómkröfur og lagagrundvöllur',
  sections: {
    demands: {
      heading: 'Dómkröfur',
      label: 'Dómkröfur',
      placeholder: 'Kröfur ákæruvalds',
      prefill: {
        searchWarrant:
          'Í þágu rannsóknar sakamáls er þess krafist að [héraðsdómstóll] veiti lögreglustjóranum á höfuðborgarsvæðinu heimild til leitar í {address}, þar sem {accusedName} á dvalarstað, í því skyni að handtaka hann og hafa uppi á munum sem hald skal leggja á. Heimildin nái til leitar í læstum hirslum og í geymslum tilheyrandi framangreindu húsnæði svo og til rannsóknar á efnisinnihaldi raftækja, svo sem símum, tölvum og öðrum rafrænum gagnavörslumunum, sem þar er að finna.',
        searchWarrant2:
          'Í þágu rannsóknar sakamáls er þess krafist að {court} veiti {institution} heimild til leitar í {address}, þar sem {accused} {live, plural, one {býr} other {búa}}, í því skyni að handtaka hann og hafa uppi á munum sem hald skal leggja á. Þess er krafist að heimildin nái til leitar í læstum hirslum og í geymslum tilheyrandi framangreindu húsnæði, svo og til rannsóknar á efnisinnihaldi raftækja, svo sem símum, tölvum og öðrum rafrænum gagnavörslumunum, sem þar er að finna.',
        bankingSecrecyWaiver:
          'Þess er krafist að [fjármálafyrirtæki - aðrir sem hafa uppl.], verði með úrskurði [héraðsdómstóll] gert skylt að láta lögreglu í hendur allar upplýsingar sem þessi fyrirtæki kunna að hafa um banka og fjármálaviðskipti, þ.á.m. bankareikninga, verðbréfa- og afleiðuviðskipti, lánaviðskipti og greiðslukortaviðskipti, gjaldeyriskaup, peningasendingar og bankahólf er varða [aðili, kt.], vegna tímabilsins frá [DD.MM.ÁÁ]',
        bankingSecrecyWaiver2:
          'Þess er krafist að Arion banka hf., kt. 581008-0150, Íslandsbanka hf., kt. 491008-0160, Kass Íslandsbanka, kt. 421289-2399, Ergo fjármögnunarþjónustu Íslandsbanka, kt. 490503-3230, Kviku banka hf., 540502-2930, Straumi greiðslumiðlun hf., kt. 620922-1020, Lykli fjármögnun, kt. 690121-2200, Aur appi, kt. 510122-2750, Landsbankanum, kt. 471008-0280, Sparisjóði Austurlands hf., kt. 621214-0630, Sparisjóð Höfðhverfinga ses., kt. 610269-6569, Sparisjóði Strandamanna ses., kt. 610269-4199, Sparisjóði Suður-Þingeyinga ses., kt. 530990-2149, Indó Sparisjóð hf., 411018-0400, Teya Iceland hf., kt. 440686-1259, Rapyd Europe hf., kt. 500683-0589, Greiðslumiðlun ehf. v/Pei ehf., kt. 540612-1020, Skiptimynt ehf., kt. 481014-0500, Monerium EMI ehf., kt. 571110-0240, Myntkaup ehf., kt. 520717-0800, Bálkum miðlun ehf., kt. 550819-1200, IsMynt ehf., kt. 600422-0650, Rafmyntarsjóði Íslands ehf., kt. 431121-1580, og Íslandspósti ohf., v/Western Union Payment Services Ireland Limited, kt. 701296-6139, verði með úrskurði {court} gert skylt að láta lögreglu í hendur allar upplýsingar sem þessi fyrirtæki kunna að hafa um banka- og fjármálaviðskipti, þ. á m. bankareikninga, verðbréfa- og afleiðuviðskipti, lánaviðskipti og greiðslukortaviðskipti, gjaldeyriskaup, peningasendingar og bankahólf er varða, {accused}, vegna tímabilsins frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ] og allar upplýsingar sem framangreind fjármálafyrirtæki kunna að hafa um þau banka- og fjármálaviðskipti, þ. á m. bankareikninga, verðbréfa- og afleiðuviðskipti, lánaviðskipti og greiðslukortaviðskipti, gjaldeyriskaup, peningasendingar, peningaúttektir og bankahólf er {accused}, kann að hafa samkvæmt umboði frá öðrum aðilum eða lögaðilum vegna tímabilsins frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ].',
        phoneTapping:
          'Þess er krafist að [héraðsdómstóll] úrskurði að lögreglustjóranum á höfuðborgarsvæðinu sé heimilt að hlusta og hljóðrita símtöl úr og í símanúmerin [###-####] auk annara símanúmera sem {accusedName}, hefur í notkun og umráð yfir, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ], og jafnframt sé heimilt að nema sms sendingar, þar með taldar sms sendingar á lesanlegu formi, sem sendar eru eða mótteknar með símanúmerunum á sama tíma og hlusta og hljóðrita samtöl við talhólf greindra númera og símtækja á sama tíma.',
        phoneTapping2:
          'Þess er krafist að {court} úrskurði að {institution} sé heimilt að hlusta og hljóðrita símtöl úr og í símanúmerin [###-####] auk annara símanúmera sem {accused}, hefur í notkun og umráð yfir, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ], og jafnframt sé heimilt að nema sms sendingar, þar með taldar sms sendingar á lesanlegu formi, sem sendar eru eða mótteknar með símanúmerunum á sama tíma og hlusta og hljóðrita samtöl við talhólf greindra númera og símtækja á sama tíma.',
        teleCommunications:
          'Þess er krafist að [héraðsdómstóll] úrskurði að [fjarskiptafyrirtæki] verði gert skylt að veita lögreglustjóranum á höfuðborgarsvæðinu upplýsingar um hvaða símanúmer hafi verið í sambandi við símanúmerið [###-####] eða önnur númer og símtæki sem {accusedName}, hefur haft til umráða frá og með [DD.MM.ÁÁ] til [DD.MM.ÁÁ] og IMEI númer sem viðkomandi símanúmer nota á sama tímabili, jafnframt sendar og mótteknar sms sendingar, sem og samtöl við talhólf greinds númers, en jafnframt verði upplýst hverjir eru rétthafar þeirra númera sem þannig tengjast greindum númerum á sama tíma. Þá er krafist upplýsinga um netnotkun símanúmersins og símtækja sem og tengingar við símsenda, hvort sem er vegna símtala eða netnotkunar og upplýsinga um gagnanotkun og gagnamagn á sama tímabili. Jafnframt er krafist upplýsinga um þau símanúmer sem tengst hafa IMEI/IMSEI númerum símtækjanna sem ofangreint númer er notað í á sama tímabili. Þá er krafist upplýsinga um hvaða endurvarpa (BASE-stöðvar) í fjarskiptakerfum fyrirtækjanna hafa farið símtöl úr og í ofangreint númer og önnur símanúmer og símtæki sem umráðamaður hefur haft í umráðum á sama tíma.',
        teleCommunications2:
          'Þess er krafist að {court} úrskurði að [fjarskiptafyrirtæki], verði gert skylt að veita {institution} upplýsingar um hvaða símanúmer hafi verið í sambandi við símanúmerið [###-####] eða önnur númer og símtæki sem {accused}, hefur haft til umráða frá og með [DD.MM.ÁÁ] til [DD.MM.ÁÁ] og IMEI númer sem viðkomandi símanúmer nota á sama tímabili, jafnframt sendar og mótteknar sms sendingar, sem og samtöl við talhólf greinds númers, en jafnframt verði upplýst hverjir eru rétthafar þeirra númera sem þannig tengjast greindum númerum á sama tíma. Þá er krafist upplýsinga um netnotkun símanúmersins og símtækja sem og tengingar við símsenda, hvort sem er vegna símtala eða netnotkunar og upplýsinga um gagnanotkun og gagnamagn á sama tímabili. Jafnframt er krafist upplýsinga um þau símanúmer sem tengst hafa IMEI/IMSEI númerum símtækjanna sem ofangreint númer er notað í á sama tímabili. Þá er krafist upplýsinga um hvaða endurvarpa (BASE-stöðvar) í fjarskiptakerfum fyrirtækjanna hafa farið símtöl úr og í ofangreint númer og önnur símanúmer og símtæki sem umráðamaður hefur haft í umráðum á sama tíma.',
        trackingEquipment:
          'Þess er krafist að [héraðsdómstóll] úrskurði um að lögreglustjóranum á höfuðborgarsvæðinu sé heimilt að koma fyrir eftirfararbúnaði á eða í bifreiðunum [#] svo og öðrum þeim bifreiðum sem {accusedName}, kann að hafa umráð yfir á úrskurðartímanum, og fylgjast með staðsetningum/ferðum bifreiðanna án þess að eigandi hennar, ökumaður, farþegar og aðrir hlutaðeigandi viti af því, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ]',
        trackingEquipment2:
          'Þess er krafist að {court} úrskurði að {institution} sé heimilt að koma fyrir eftirfararbúnaði á eða í bifreiðunum [#] svo og öðrum þeim bifreiðum sem {accused}, kann að hafa umráð yfir á úrskurðartímanum, og fylgjast með staðsetningum/ferðum bifreiðanna án þess að eigandi hennar, ökumaður, farþegar og aðrir hlutaðeigandi viti af því, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ]',
        electronicDataDiscoveryInvestigation:
          '​​Þess er krafist að {court} úrskurði að {institution} sé heimil rannsókn á rafrænu efnisinnihaldi eftirfarandi muna: x snjallsíma, munur í munaskrá lögreglu nr. xxxx, og snjallsíma af gerðinni y, munur í munaskrá lögreglu nr. xxxxxxx, sem lögregla fann í fórum {accused}, á heimili hans að {address} og haldlagði við húsleit á heimili hans/hennar/háns þann x.x.{year}. Þess er krafist að heimildin nái til leitar, skoðunar og afritunar á þeim rafrænu gögnum sem hinir haldlögðu munir kunna að geyma og þeim skýjaþjónustum sem hafa verið notaðar með símanum hvort sem um er að ræða samfélagsmiðla, samskiptaforrit, tölvupósta eða gagnageymslur.',
        paroleRevocation:
          'Þess er krafist að {court} úrskurði að {accused}, verði á grundvelli 2. mgr. 82. gr. laga um fullnustu refsinga nr. 15/2016 gert að sæta afplánun á [FJÖLDI DAGA] daga eftirstöðvum refsingar, samkvæmt dómi [DÓMSTÓLL], uppkveðnum [DAGSETNING UPPKVAÐNINGAR], sem honum var veitt reynslulausn á með ákvörðun Fangelsismálastofnunar frá [DAGSETNING REYNSLULAUSNAR].',
      },
    },
    lawsBroken: {
      heading: 'Lagaákvæði sem brot varða við',
      label: 'Lagaákvæði sem ætluð brot {defendant} þykja varða við',
      placeholder:
        'Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940...',
    },
    legalBasis: {
      heading: 'Lagaákvæði sem krafan er byggð á',
      label: 'Lagaákvæði sem krafan er byggð á',
      placeholder: 'Hvaða lagaákvæðum byggir krafan á?',
    },
  },
}
