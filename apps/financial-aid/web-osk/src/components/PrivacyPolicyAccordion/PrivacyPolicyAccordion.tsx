import React from 'react'
import { Accordion, AccordionItem, Link, Text } from '@island.is/island-ui/core'

interface Props {
  municipalityHomePage?: string
}

const PrivacyPolicyAccordion = ({ municipalityHomePage }: Props) => {
  return (
    <Accordion singleExpand>
      <AccordionItem
        id="id_1"
        label="Nánar um persónuverndarstefnu þíns sveitarfélags"
      >
        <Text marginBottom={2} fontWeight="semiBold">
          Umsókn um fjárhagsaðstoð
        </Text>

        <Text marginBottom={2}>
          Til þess að geta unnið úr umsókn þinni og lagt mat á rétt þinn til
          fjárhagsaðstoðar er sveitarfélaginu nauðsynlegt að vinna með nánar
          tilgreindar persónuupplýsingar þínar. Unnið er með upplýsingar sem þú
          lætur af hendi í umsóknarferlinu en einnig aflar sveitarfélagið
          upplýsinga um þig frá þriðju aðilum.
        </Text>
        <Text marginBottom={2}>
          Upplýsingarnar gætu verið notaðar til vinnslu tölfræðirannsókna.
        </Text>
        <Text marginBottom={2}>
          Í samræmi við lög um opinber skjalasöfn þá varðveitir sveitarélagið
          upplýsingarnar ótímabundið.
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Verði umbeðnar nauðsynlegar upplýsingar ekki veittar kann það að leiða
          til þess að ekki er unnt að verða við umsókn þessari.{' '}
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Tilgangur vinnslu og lagagrundvöllur
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Persónuupplýsingar þær sem óskað er eftir á umsóknarformi þessu og
          unnið er með, eru nauðsynlegar sveitarfélaginu til að geta metið og
          tryggt rétt umsækjanda til þjónustu í samræmi við umsókn þessa með
          vísan til lagaskyldu samkvæmt lögum um félagsþjónustu sveitarfélaga{' '}
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Hvaða upplýsingar er unnið með?
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Það fer því eftir stöðu þinni hvaða upplýsingar sveitarfélaginu er
          nauðsynlegt að vinna með í tengslum við umsókn þína. Ákveðnar
          grunnupplýsingar eru hins vegar unnar um alla umsækjendur sem óska
          eftir fjárhagsaðstoð. Unnið er með eftirfarandi upplýsingar með
          hliðsjón af stöðu umsækjanda:
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Allir umsækjendur
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Nafn, lögheimili/aðsetur, kyn, hjúskaparstöðu, fjölskyldunúmer,
          fjölskyldugerð, kennitölu, símanúmer, netfang, stöðu umsækjanda,
          húsnæðisstaða, skattskyldar tekjur á yfirstandandi ári og allt árið á
          undan, álagningaskrá: eignir og skuldir auk virðisaukaskattskrá,
          upplýsingar um ofgreiðslur, bankareikningur, tímabil umsóknar, eðli
          umsóknar og aðrar upplýsingar sem umsækjandi vill koma á framfæri í
          umsóknarferli. Ef umsækjandi hefur einhvern á sinni framfærslu þá eru
          jafnframt sóttar eftirtaldar upplýsingar slíkra aðila frá Þjóðskrá sem
          eru nafn, kennitala og lögheimili. Ef umsækjandi greiðir meðlag er
          jafnframt óskað eftir upplýsingum um slíkar greiðslur.
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Vinnufærir umsækjendur
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Minnisblað atvinnuleitanda sem kallað er eftir frá umsækjanda.
          Staðfesting frá Vinnumálastofnun um rétt til atvinnuleysisbóta ásamt
          staðfestingu á skráningu á Atvinnutorgi.
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Óvinnufærir umsækjendur
        </Text>
        <Text marginBottom={2}>
          Sjúkradagpeningavottorð og læknisvottorð frá umsækjanda auk upplýsinga
          um greiðslur frá stéttarfélagi sem óskað er eftir frá
          Ríkisskattstjóra.{' '}
        </Text>
        <Text marginBottom={2}>
          Umsækjendur sem eru örorku-, endurhæfingar- eða ellilífeyrisþegar
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Sundurliðaðar tekjur og greiðslur frá Tryggingastofnun ríkisins í
          umsóknarmánuði og mánuði þar á undan. Upplýsingar um mæðra- og
          feðralaun og/eða makabætur, eftir því sem við á.
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Annað{' '}
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Ef umsækjandi er á leigumarkaði þá kann að vera óskað eftir afriti af
          þinglýstum leigusamningi frá umsækjanda. Dvalarleyfisskírteini ef
          umsækjandi er erlendur ríkisborgari utan Evrópska efnahagssvæðisins.
          Vottorð frá sýslumanni varðandi hjúskapar/sambúðarslit, ef við á.
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Hvaðan koma upplýsingarnar?
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          Auk þeirra persónuupplýsinga sem þú veitir sveitarfélaginu í
          umsóknarferlinu þá er kallað eftir grunnupplýsingum um þig frá
          Þjóðskrá og fjárhagsupplýsingum frá Ríkisskattstjóra auk þess sem
          auðkenning þín er sótt til þjónustuveitanda auðkenningarþjónustu. Þá
          kann sveitarfélagið að kalla eftir persónuupplýsingum frá
          Vinnumálastofnun, Tryggingastofnun ríkisins og sýslumanni.
        </Text>

        <Text marginBottom={2} fontWeight="semiBold">
          Nánar um vinnslu persónuupplýsinga
        </Text>
        <Text marginBottom={[3, 3, 7]}>
          {municipalityHomePage ? (
            <>
              Frekari upplýsingar um vinnslu persónuupplýsinga hjá
              sveitarfélaginu má finna í persónuverndar-stefnu þess sem
              aðgengileg er á vefsíðunni
              {` `}
              <Link
                href={municipalityHomePage}
                color="blue400"
                underline="small"
                underlineVisibility="always"
              >
                {municipalityHomePage}
              </Link>
              .
            </>
          ) : (
            <>
              Frekari upplýsingar um vinnslu persónuupplýsinga má finna vefsíðu
              sveitarfélags þíns
            </>
          )}
        </Text>
      </AccordionItem>
    </Accordion>
  )
}

export default PrivacyPolicyAccordion
