import {
  Box,
  Breadcrumbs,
  Button,
  GridContainer,
  ResponsiveSpace,
  Text,
} from '@island.is/island-ui/core'
import SubscriptionTable from '../../components/Table/SubscriptionTable'
import { useState } from 'react'
import { Layout } from '../../components/Layout/Layout'

type dummyCases = Array<info>
type info = {
  id: number
  caseNumber: string
  caseTitle: string
  checked: boolean
}

const Subscriptions = () => {
  const cases: dummyCases = [
    {
      id: 0,
      caseNumber: 'Öll mál',
      caseTitle: 'Tilkynningar um ný mál',
      checked: false,
    },
    {
      id: 1,
      caseNumber: 'Öll mál',
      caseTitle:
        'Tilkynningar um ný mál, breyttan umsagnarfrest, umsagnarfrest sem er að renna út og birtingu niðurstaðna',
      checked: false,
    },
    {
      id: 2,
      caseNumber: '26/2023',
      caseTitle: 'Brottfall úreltra reglugerða á fjármálamarkaði',
      checked: true,
    },
    {
      id: 3,
      caseNumber: '25/2023',
      caseTitle:
        'Drög að reglugerð um (2.) breytingu á reglugerð nr. 241/2004 um val, geymslu og meðferð lyfja á sjúkrahúsum og öðrum heilbrigðisstofnunum',
      checked: false,
    },
    {
      id: 4,
      caseNumber: '24/2023',
      caseTitle:
        'Frumvarp til laga um breytingu á lögum um tæknifrjóvgun og notkun kynfrumna og fósturvísa manna til stofnfrumurannsókna, nr. 55/1996 (geymsla og nýting fósturvísa og kynfrumna)',
      checked: false,
    },
    {
      id: 5,
      caseNumber: '23/2023',
      caseTitle: 'Áform um breytingu á lögum um ríkislögmann, nr. 51/1985',
      checked: false,
    },
    {
      id: 6,
      caseNumber: '2/2023',
      caseTitle:
        'Tillaga til þingsályktunar um aðgerðaáætlun gegn hatursorðræðu 2023-2026',
      checked: false,
    },
    {
      id: 7,
      caseNumber: '22/2023',
      caseTitle:
        'Frumvarp til laga um breytingu á lögum nr. 116/2006, um stjórn fiskveiða (svæðaskipting strandveiða)',
      checked: false,
    },
    {
      id: 8,
      caseNumber: '20/2023',
      caseTitle: 'Neyðarbirgðir eldsneytis',
      checked: false,
    },
    {
      id: 9,
      caseNumber: '15/2023',
      caseTitle: 'Drög að reglugerð um notkunar mannalyfja af mannúðarástæðum',
      checked: false,
    },
    {
      id: 10,
      caseNumber: '19/2023',
      caseTitle: 'Reglugerð um atvinnusjúkdóma',
      checked: false,
    },
    {
      id: 11,
      caseNumber: '21/2023',
      caseTitle:
        'Drög að frumvarpi til laga um breytingu á lögum um heilbrigðisstarfsmenn, nr. 34/2012 (heimilisofbeldi)',
      checked: false,
    },
    {
      id: 12,
      caseNumber: '215/2022',
      caseTitle: 'Reglugerð um íbúakosningar sveitarfélaga',
      checked: false,
    },
    {
      id: 13,
      caseNumber: '253/2022',
      caseTitle:
        'Drög að þingsályktunartillögu um aðgerðaáætlun um þjónustu við eldra fólk 2023-2027',
      checked: false,
    },
    {
      id: 14,
      caseNumber: '7/2023',
      caseTitle:
        'Bráðabirgðaniðurstöður starfshópa - Auðlindin okkar - stefna um sjávarútveg',
      checked: false,
    },
    {
      id: 15,
      caseNumber: '18/2023',
      caseTitle:
        'Frumvarp til laga um breytingu á lögum um réttindi sjúklinga nr. 74/1997',
      checked: false,
    },
    {
      id: 16,
      caseNumber: '12/2023',
      caseTitle:
        'Drög að reglugerð um útgáfu vottorða, álitsgerða, faglegra yfirlýsinga og skýrslur heilbrigðisstarfsmanna',
      checked: false,
    },
    {
      id: 17,
      caseNumber: '17/2023',
      caseTitle:
        'Breyting á lögum í tengslum við raforkueftirlit Orkustofnunar',
      checked: false,
    },
    {
      id: 18,
      caseNumber: '247/2022',
      caseTitle:
        'Drög að þingsályktunartillögu um aðgerðaáætlun í geðheilbrigðismálum 2023-2027',
      checked: false,
    },
    {
      id: 19,
      caseNumber: '16/2023',
      caseTitle:
        'Drög að reglugerð um breytingu á reglugerð nr. 944/2014, um öryggi leikfanga og markaðssetningu þeirra á Evrópska efnahagssvæðinu',
      checked: false,
    },
  ]

  const [currentTab, setCurrentTab] = useState('Mál')
  const [data, setData] = useState(cases)
  const settingData = (newData: dummyCases) => setData(newData)
  const paddingYBreadCrumbs = [3, 3, 5, 5] as ResponsiveSpace
  const paddingXContent = [0, 0, 15, 15] as ResponsiveSpace
  const paddingXTable = [0, 0, 15, 15] as ResponsiveSpace
  const paddingBottom = [3, 3, 3, 3] as ResponsiveSpace

  const onLoadMore = () => {
    console.log('clicked on load more')
  }

  return (
    <Layout>
      <GridContainer>
        <Box paddingY={paddingYBreadCrumbs}>
          <Breadcrumbs
            items={[
              { title: 'Samráðsgátt', href: '/samradsgatt' },
              { title: 'Mínar áskriftir ', href: '/samradsgatt/askriftir' },
              { title: currentTab },
            ]}
          />
        </Box>
        <Box paddingX={paddingXContent} paddingBottom={3}>
          <Text variant="h1" color="dark400">
            {'Áskriftir'}
          </Text>
        </Box>
        <Box paddingX={paddingXContent} paddingBottom={5}>
          <Text variant="default">
            {
              'Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig inn á Ísland.is, \
                        hakar við einn eða fleiri flokka, velur hvort þú vilt tilkynningar um ný mál \
                        eða fleiri atriði og smellir á „Staðfesta“. ferð svo og staðfestir áskriftina \
                        í gegnum tölvupóstfangið sem þú varst að skrá.'
            }
          </Text>
          <Text variant="default" paddingTop={2}>
            {'Kerfið er uppfært einu sinni á sólarhring.'}
          </Text>
        </Box>
        <Box paddingX={paddingXTable}>
          <SubscriptionTable data={data} setData={settingData} />
        </Box>
        <Box
          paddingX={paddingXContent}
          paddingBottom={paddingBottom}
          paddingTop={3}
        >
          <Button icon="eye" variant="text" onClick={onLoadMore}>
            Sýna fleiri mál
          </Button>
        </Box>
      </GridContainer>
    </Layout>
  )
}

export default Subscriptions
