import React, { useContext } from 'react'
import {
  Text,
  BulletList,
  Bullet,
  Box,
  Link,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const AboutFormApplicant = () => {
  const { municipality } = useContext(AppContext)

  return (
    <>
      <Text as="h1" variant="h2" marginBottom={2}>
        Upplýsingar varðandi umsóknina
      </Text>

      <Text variant="h3" fontWeight="light" marginBottom={3}>
        Þú ert að sækja um fjárhagsaðstoð hjá þínu sveitarfélagi fyrir{' '}
        {currentMonth()} mánuð. Áður en þú heldur áfram er gott að hafa
        eftirfarandi í huga:
      </Text>

      <Box marginBottom={5}>
        <BulletList type={'ul'} space={2}>
          <Bullet>
            Til að eiga rétt á fjárhagsaðstoð þurfa tekjur og eignir þínar að
            vera undir ákveðnum viðmiðunarmörkum.
          </Bullet>
          <Bullet>Fjárhagsaðstoð getur verið í formi láns eða styrks.</Bullet>

          <Bullet>
            Áður en þú sækir um fjárhagsaðstoð skaltu athuga hvort þú eigir rétt
            á annarskonar aðstoð. Dæmi um önnur úrræði eru{' '}
            <Link
              href="https://www.stjornarradid.is/verkefni/almannatryggingar-og-lifeyrir/almannatryggingar/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              almannatryggingar
            </Link>
            {', '}
            <Link
              href="https://vinnumalastofnun.is/umsoknir/umsokn-um-atvinnuleysisbaetur"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              atvinnuleysisbætur
            </Link>
            {', '}
            <Link
              href="https://www.lifeyrismal.is/is/sjodirnir"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              lífeyrissjóðir
            </Link>
            {', '}
            <Link
              href="https://www.sjukra.is/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              Sjúkratryggingar Íslands
            </Link>{' '}
            og sjúkrasjóðir stéttarfélaga.
          </Bullet>
          <Bullet>
            Ef þú ert í lánshæfu námi gætir þú átt rétt á námsláni hjá{' '}
            <Link
              href="https://menntasjodur.is/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              Menntasjóði námsmanna
            </Link>
            .
          </Bullet>
        </BulletList>
      </Box>
      <Text as="h2" variant="h3" marginBottom={2}>
        Vinnsla persónuupplýsinga
      </Text>

      <Accordion singleExpand>
        <AccordionItem
          id="id_1"
          label="Nánar um persónuverndarstefnu þíns sveitarfélags"
        >
          <Text marginBottom={[2, 2, 4]}>
            Til að geta sannreynt rétt umsækjanda skv. umsókn þessari, í samræmi
            við reglur Hafnarfjarðarkaupstaðar og gildandi lög varðandi veitingu
            þjónustunnar, þá þarf fjölskyldu- og barnamálasvið
            Hafnarfjarðarkaupstaðar að afla persónuupplýsinga um umsækjanda.
            Verði umbeðnar nauðsynlegar upplýsingar ekki veittar kann það að
            leiða til þess að ekki er unnt að verða við umsókn þinni.
          </Text>

          <Text marginBottom={[1, 1, 2]}>
            Með því að senda inn umsókn þessa staðfestir umsækjandi að hann hafi
            kynnt sér efni varðandi vinnslu persónuupplýsinga af hálfu
            fjölskyldu- og barnamálasvið Hafnarfjarðarkaupstaðar vegna umsóknar
            þessarar og fylgir umsóknarformi þessu "persónuvernd og vinnsla
            persónuupplýsinga".
          </Text>

          <Text marginBottom={[1, 1, 2]}>
            Persónuvernd og vinnsla persónuupplýsinga
          </Text>

          <Text marginBottom={[1, 1, 2]}>
            Svo unnt sé að vinna úr umsókn þinni og leggja mat á rétt þinn til
            þjónustu hjá Hafnarfjarðarkaupstað samkvæmt umsókninni, þá þarf
            fjölskyldu- og barnamálasvið Hafnarfjarðarkaupstaðar að vinna með
            nánar tilgreindar persónuupplýsingar þínar. Unnið er með þær
            upplýsingar sem þú veitir í umsóknarferlinu og jafnframt þær
            upplýsingar sem nauðsynlegar eru og tilgreindar eru hér til að
            sannreyna að skilyrði reglna Hafnarfjarðarkaupstaðar séu uppfyllt
            við upphaf og á meðan þjónustusamband aðila stendur yfir.
          </Text>

          <Text marginBottom={[1, 1, 2]}>
            Tilgangur vinnslu og lagagrundvöllur Persónuupplýsingar þær sem
            óskað er eftir á umsóknarformi þessu og unnið er með, eru
            nauðsynlegar fjölskyldusviði Hafnarfjarðarkaupstaðar til að geta
            sannreynt og tryggt rétt umsækjanda til þjónustu í samræmi við
            umsókn þessa, skv. eftirfarandi lögum: <br /> V, VI. og VII kafli
            laga um félagsþjónustu sveitarfélaga nr. 40/1991.
          </Text>
          <Text marginBottom={[2, 2, 4]}>
            Reglur Hafnarfjarðarkaupstaðar um fjárhagsaðstoð hjá
            Hafnarfjarðarbæ, síðast breytt 15. mars 2020.
          </Text>

          <Text marginBottom={[2, 2, 4]}>
            Tegundir persónuupplýsinga: Unnið er með eftirfarandi flokkar
            upplýsinga um umsækjendur: Almennar persónuupplýsingar:
            Íbúaupplýsingar (s.s. nafn, kt., lögheimili/aðsetur, símanúmer,
            netfang, fjölskyldugerð), fjárhags- og eignaupplýsingar,
            húsnæðisstaða, atvinnustaða, félagsleg staða og aðstaða,
            þjónustuþörf og aðrar upplýsingar sem umsækjandi vill koma á
            framfæri í umsóknarferli. Viðkvæmar persónuupplýsingar:
            heilsufarsupplýsingar.
          </Text>

          <Text marginBottom={[1, 1, 2]}>
            Hvaðan koma upplýsingarnar? Umsækjandi veitir þær upplýsingar sem
            unnið er með vegna framkominnar umsóknar auk þess sem
            Hafnarfjarðarkaupstaður sækir grunnupplýsingar um umsækjanda til
            Þjóðskrár.
          </Text>

          <Text marginBottom={[1, 1, 2]}>
            Þá er sérstaklega aflað upplýsinga um umsækjanda í tengslum við
            umsókn þessa frá:
          </Text>

          <Text marginBottom={[1, 1, 2]}>Ríkisskattstjóra </Text>

          <Text marginBottom={[2, 2, 4]}>
            Ef við á getur þurft að afla upplýsinga frá fleiri aðilum:
            Tryggingastofnun ríkisins, Hagstofa Íslands,
            atvinnuleysistryggingasjóði og útlendingastofnun.{' '}
          </Text>

          <Text marginBottom={[2, 2, 4]}>
            Hversu lengi eru persónuupplýsingarnar varðveittar:
            Persónuupplýsingar þínar eru geymdar ótímabundið á grundvelli
            lagaskyldu sem hvílir á Hafnarfjarðarkaupstað skv. lögum um opinber
            skjalasöfn nr. 77/2014. Almennt að liðnum 30 árum er
            Hafnarfjarðarkaupstað skylt að afhenda Þjóðskjalasafni til
            varðveislu þau skjöl sem myndast við umsókn þína.
          </Text>

          <Text marginBottom={[2, 2, 4]}>
            Öryggi persónuupplýsinganna: Hafnarfjarðarkaupstaður gætir öryggis
            persónuupplýsinga með viðeigandi skipulagslegum og tæknilegum
            ráðstöfunum, þ. á m. aðgangsstýringum og dulkóðun. Allt það
            starfsfólk sem kemur að vinnslu persónuupplýsinga umsækjanda er
            bundið þagnarskyldu.
          </Text>

          <Text marginBottom={[2, 2, 4]}>
            Miðlun persónuupplýsinganna til þriðja aðila Tilteknum upplýsingum
            sem Hafnarfjarðarkaupstaður hefur aflað í tengslum við umsókn þessa
            er miðlað til þriðja aðila. Aðeins er miðlað þeim upplýsingum sem
            eru nauðsynlegar til að veita hér umbeðna þjónustu.
            Persónuupplýsingar eru ekki sendar annað án leyfis umsækjanda. Nánar
            tiltekið er um að ræða:
          </Text>

          <Text marginBottom={[2, 2, 4]}>
            Réttindi: Þú kannt að eiga rétt til þess að fá aðgang að þeim
            persónuupplýsingum sem Hafnarfjarðarkaupstaður vinnur með í tengslum
            við umsókn þína. Þá kannt þú að hafa rétt til að andmæla vinnslunni,
            fá upplýsingar leiðréttar, krefjast þess að þeim verði eytt eða fara
            fram á að vinnslan verði takmörkuð.
          </Text>

          <Text marginBottom={[2, 2, 4]}>
            Kvörtun yfir vinnslu persónuupplýsinga: Sérstök athygli er vakin á
            því að ef þú ert ósátt/ur við meðferð Hafnarfjarðarkaupstaðar á
            persónuupplýsingum þínum getur þú ávallt haft samband við
            persónuverndarfulltrúa Hafnarfjarðarkaupstaðar{' '}
            <a
              href={`mailto:personuvernd@hafnarfjordur.is`}
              rel="noreferrer noopener"
            >
              <span className="linkInText">
                {' '}
                (personuvernd@hafnarfjordur.is)
              </span>
            </a>{' '}
            eða sent erindi til Persónuverndar.
          </Text>

          <Text marginBottom={1}>
            Frekari upplýsingar um vinnslu persónuupplýsinga hjá
            Hafnarfjarðarkaupstað má finna í persónuverndarstefnu
            sveitarfélagsins sem aðgengileg er á vefsíðunni
            <a
              href={municipality?.homepage}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="linkInText"> {municipality?.homepage}</span>
            </a>
          </Text>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default AboutFormApplicant
