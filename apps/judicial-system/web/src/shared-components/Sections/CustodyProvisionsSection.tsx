import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Checkbox,
} from 'libs/island-ui/core/src'
import BlueBox from '../BlueBox/BlueBox'
import {
  Case,
  CaseCustodyProvisions,
  CaseType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import React from 'react'
import { setCheckboxAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  updateCase: (id: string, updateCase: UpdateCase) => Promise<any>
}

const CustodyProvisionsSection: React.FC<Props> = ({
  workingCase,
  setWorkingCase,
  updateCase,
}: Props) => {
  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_A,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_B,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_C,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_D,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_2,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      value: CaseCustodyProvisions._99_1_B,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      brokenLaw: '1. mgr. 100. gr.',
      value: CaseCustodyProvisions._100_1,
      explination:
        'Nú eru skilyrði gæsluvarðhalds skv. 1. eða 2. mgr. 95. gr. fyrir hendi og getur dómari þá, í stað þess að úrskurða sakborning í gæsluvarðhald, mælt fyrir um vistun hans á sjúkrahúsi eða viðeigandi stofnun, bannað honum brottför af landinu ellegar lagt fyrir hann að halda sig á ákveðnum stað eða innan ákveðins svæðis.',
    },
  ]

  const filteredCustodyProvisions =
    // TODO: UNCOMMENT
    /*workingCase.caseType*/ workingCase.comments === CaseType.DETENTION
      ? caseCustodyProvisions
      : caseCustodyProvisions.filter(
          (caseCustodyProvision, _) =>
            caseCustodyProvision.value === CaseCustodyProvisions._95_1_A ||
            caseCustodyProvision.value === CaseCustodyProvisions._95_1_B ||
            caseCustodyProvision.value === CaseCustodyProvisions._100_1,
        )

  return (
    <Box component="section" marginBottom={5}>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          Lagaákvæði sem krafan er byggð á{' '}
          <Text as="span" color={'red600'} fontWeight="semiBold">
            *
          </Text>
        </Text>
      </Box>
      <BlueBox>
        <GridContainer>
          <GridRow>
            {filteredCustodyProvisions.map((provision, index) => {
              return (
                <GridColumn span="6/12" key={index}>
                  <Box
                    marginBottom={
                      // Do not add margins to the last two items
                      index < caseCustodyProvisions.length - 2 ? 3 : 0
                    }
                  >
                    <Checkbox
                      name={provision.brokenLaw}
                      label={provision.brokenLaw}
                      value={provision.value}
                      checked={
                        workingCase.custodyProvisions &&
                        workingCase.custodyProvisions.indexOf(provision.value) >
                          -1
                      }
                      tooltip={provision.explination}
                      onChange={({ target }) =>
                        setCheckboxAndSendToServer(
                          'custodyProvisions',
                          target.value,
                          workingCase,
                          setWorkingCase,
                          updateCase,
                        )
                      }
                      large
                      filled
                    />
                  </Box>
                </GridColumn>
              )
            })}
          </GridRow>
        </GridContainer>
      </BlueBox>
    </Box>
  )
}

export default CustodyProvisionsSection
