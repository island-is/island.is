import { defineMessages } from 'react-intl'

export const aboutForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.aboutForm.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'About form Page Title',
    },
    pageTitle: {
      id: 'fa.application:section.aboutForm.general.pageTitle',
      defaultMessage: 'Upplýsingar varðandi umsóknina',
      description: 'About form page title',
    },
    description: {
      id: 'fa.application:section.aboutForm.general.description',
      defaultMessage:
        'Þú ert að sækja um fjárhagsaðstoð hjá þínu sveitarfélagi fyrir {currentMonth} mánuð. Áður en þú heldur áfram er gott að hafa eftirfarandi í huga:',
      description: 'About form page description',
    },
  }),
  bulletList: defineMessages({
    first: {
      id: 'fa.application:section.aboutForm.bulletList.first#markdown',
      defaultMessage:
        '* Til að eiga rétt á fjárhagsaðstoð þurfa tekjur og eignir þínar að vera undir ákveðnum viðmiðunarmörkum.\n* Fjárhagsaðstoð getur verið í formi láns eða styrks. \n* Áður en þú sækir um fjárhagsaðstoð skaltu athuga hvort þú eigir rétt á annarskonar aðstoð. Dæmi um önnur úrræði eru [almannatryggingar](https://www.stjornarradid.is/verkefni/almannatryggingar-og-lifeyrir/almannatryggingar/), [atvinnuleysisbætur](https://vinnumalastofnun.is/umsoknir/umsokn-um-atvinnuleysisbaetur), [lífeyrissjóðir](https://www.lifeyrismal.is/is/sjodirnir), [Sjúkratryggingar Íslands](https://www.sjukra.is/) og sjúkrasjóðir stéttarfélaga. \n* Ef þú ert í lánshæfu námi gætir þú átt rétt á námsláni hjá [Menntasjóði námsmanna](https://menntasjodur.is/).',
      description: 'About form Bullet list',
    },
  }),
  personalInformation: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.aboutForm.personalInformation.sectionTitle',
      defaultMessage: 'Vinnsla persónuupplýsinga',
      description: 'About form Page Title',
    },
    accordionTitle: {
      id: 'fa.application:section.aboutForm.personalInformation.accordionTitle',
      defaultMessage: 'Nánar um persónuverndarstefnu þíns sveitarfélags',
      description: 'About form Page Title',
    },
    // accordionAbout: {
    //   id:
    //     'fa.application:section.aboutForm.personalInformation.accordionAbout#markdown',
    //   defaultMessage:
    //     '<b>Umsókn um fjárhagsaðstoð</b> <br/><br/> <p> Til þess að geta unnið úr umsókn þinni og lagt mat á rétt þinn til fjárhagsaðstoðar er sveitarfélaginu nauðsynlegt að vinna með nánar tilgreindar persónuupplýsingar þínar. Unnið er með upplýsingar sem þú lætur af hendi í umsóknarferlinu en einnig aflar sveitarfélagið upplýsinga um þig frá þriðju aðilum. <br/> <br/>Upplýsingarnar gætu verið notaðar til vinnslu tölfræðirannsókna.<br/> <br/>Í samræmi við lög um opinber skjalasöfn þá varðveitir sveitarélagið upplýsingarnar ótímabundið. <br/> <br/>           Verði umbeðnar nauðsynlegar upplýsingar ekki veittar kann það að leiða til þess að ekki er unnt að verða við umsókn þessari. </p> <br/><br/> <b>Tilgangur vinnslu og lagagrundvöllur</b> <br/><br/> <p>  Persónuupplýsingar þær sem óskað er eftir á umsóknarformi þessu og unnið er með, eru nauðsynlegar sveitarfélaginu til að geta metið og tryggt rétt umsækjanda til þjónustu í samræmi við umsókn þessa með vísan til lagaskyldu samkvæmt lögum um félagsþjónustu sveitarfélaga.</p> <br/><br/> <b>Hvaða upplýsingar er unnið með?</b><br/><br/> <p>       Það fer því eftir stöðu þinni hvaða upplýsingar sveitarfélaginu er nauðsynlegt að vinna með í tengslum við umsókn þína. Ákveðnar grunnupplýsingar eru hins vegar unnar um alla umsækjendur sem óska eftir fjárhagsaðstoð. Unnið er með eftirfarandi upplýsingar með hliðsjón af stöðu umsækjanda: </p> <br/><br/> <b>Allir umsækjendur</b> <br/><br/> <p>  Nafn, lögheimili/aðsetur, kyn, hjúskaparstöðu, fjölskyldunúmer, fjölskyldugerð, kennitölu, símanúmer, netfang, stöðu umsækjanda, húsnæðisstaða, skattskyldar tekjur á yfirstandandi ári og allt árið á undan, álagningaskrá: eignir og skuldir auk virðisaukaskattskrá, upplýsingar um ofgreiðslur, bankareikningur, tímabil umsóknar, eðli umsóknar og aðrar upplýsingar sem umsækjandi vill koma á framfæri í umsóknarferli. Ef umsækjandi hefur einhvern á sinni framfærslu þá eru jafnframt sóttar eftirtaldar upplýsingar slíkra aðila frá Þjóðskrá sem eru nafn, kennitala og lögheimili. Ef umsækjandi greiðir meðlag er jafnframt óskað eftir upplýsingum um slíkar greiðslur.</p> <br/><br/>  <b>Vinnufærir umsækjendur</b> <br/><br/> <p>Minnisblað atvinnuleitanda sem kallað er eftir frá umsækjanda. Staðfesting frá Vinnumálastofnun um rétt til atvinnuleysisbóta ásamt staðfestingu á skráningu á Atvinnutorgi.</p><br/><br/> <b>Óvinnufærir umsækjendur</b><br/><br/><p>Sjúkradagpeningavottorð og læknisvottorð frá umsækjanda auk upplýsinga um greiðslur frá stéttarfélagi sem óskað er eftir frá Ríkisskattstjóra.<br/><br/>Umsækjendur sem eru örorku-, endurhæfingar- eða ellilífeyrisþegar<br/><br/>Sundurliðaðar tekjur og greiðslur frá Tryggingastofnun ríkisins í umsóknarmánuði og mánuði þar á undan. Upplýsingar um mæðra- og feðralaun og/eða makabætur, eftir því sem við á.</p> <br/><br/><b>Annað</b><br/><br/><p>Ef umsækjandi er á leigumarkaði þá kann að vera óskað eftir afriti af þinglýstum leigusamningi frá umsækjanda. Dvalarleyfisskírteini ef umsækjandi er erlendur ríkisborgari utan Evrópska efnahagssvæðisins. Vottorð frá sýslumanni varðandi hjúskapar/sambúðarslit, ef við á. </p> <br/><br/><b>Hvaðan koma upplýsingarnar?</b><br/><br/><p>Auk þeirra persónuupplýsinga sem þú veitir sveitarfélaginu í umsóknarferlinu þá er kallað eftir grunnupplýsingum um þig frá Þjóðskrá og fjárhagsupplýsingum frá Ríkisskattstjóra auk þess sem auðkenning þín er sótt til þjónustuveitanda auðkenningarþjónustu. Þá kann sveitarfélagið að kalla eftir persónuupplýsingum frá Vinnumálastofnun, Tryggingastofnun ríkisins og sýslumanni.</p> <br/><br/> <b> Nánar um vinnslu persónuupplýsinga</b> <br/><br/> <p>  Frekari upplýsingar um vinnslu persónuupplýsinga hjá sveitarfélaginu má finna í persónuverndar-stefnu þess sem aðgengileg er á vefsíðunni .</p> ',
    //   description: 'About form Page Title',
    // },
  }),
}
