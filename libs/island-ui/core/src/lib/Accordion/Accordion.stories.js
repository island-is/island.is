import { DescriptionFigma } from '../../utils/withFigma'
import { Accordion } from './Accordion'
import {
  AccordionItem,
  AccordionCard,
  SidebarAccordion,
} from './AccordionItem/AccordionItem'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Stack } from '../Stack/Stack'

export default {
  title: 'Components/Accordion',
  component: Accordion,
}

export const Default = {
  render: () => (
    <Accordion singleExpand>
      <AccordionItem id="id_1" label={'Hvenær þarf að skila umsókn?'}>
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
      <AccordionItem
        id="id_2"
        label={'Er hægt að leggja inn greiðslur á bankareikning maka?'}
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
      <AccordionItem id="id_3" label={'Hvernig kem ég umsókninni til ykkar?'}>
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
    </Accordion>
  ),

  name: 'Default',
}

export const SmallVariant = {
  render: () => (
    <Accordion singleExpand>
      <AccordionItem
        id="id_1"
        label={'Hvenær þarf að skila umsókn?'}
        labelUse="h5"
        labelVariant="h5"
        iconVariant="small"
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
      <AccordionItem
        id="id_2"
        label={'Er hægt að leggja inn greiðslur á bankareikning maka?'}
        labelUse="h5"
        labelVariant="h5"
        iconVariant="small"
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
      <AccordionItem
        id="id_3"
        label={'Hvernig kem ég umsókninni til ykkar?'}
        labelUse="h5"
        labelVariant="h5"
        iconVariant="small"
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
    </Accordion>
  ),

  name: 'Small variant',
}

export const ColoredLabel = {
  render: () => (
    <Accordion singleExpand>
      <AccordionItem
        id="id_1"
        label={'Hvenær þarf að skila umsókn?'}
        labelColor="blue400"
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
      <AccordionItem
        id="id_2"
        label={'Er hægt að leggja inn greiðslur á bankareikning maka?'}
        labelColor="blue400"
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
      <AccordionItem
        id="id_3"
        label={'Hvernig kem ég umsókninni til ykkar?'}
        labelColor="blue400"
      >
        <Text>
          Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
          faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
          frumritið.
        </Text>
      </AccordionItem>
    </Accordion>
  ),

  name: 'Colored label',
}

export const SingleCard = {
  render: () => (
    <ContentBlock>
      <Box paddingY={[1, 2]}>
        <AccordionCard
          id="id_1"
          label={'Hvenær þarf að skila umsókn?'}
          visibleContent={
            <Box paddingY={2} paddingBottom={1}>
              <Text>
                Hér getur komið eitthvað meira efni sem sést alltaf og er birt
                fyrir neðan titil.
              </Text>
            </Box>
          }
        >
          <Text>
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </Text>
        </AccordionCard>
      </Box>
    </ContentBlock>
  ),

  name: 'Single card',
}

export const SingleRedCard = {
  render: () => (
    <ContentBlock>
      <Box paddingY={[1, 2]}>
        <AccordionCard
          colorVariant="red"
          id="id_1"
          label="Danger zone"
          labelColor="red600"
        >
          <Text color="red600">
            Danger Zone is a 1986 song by Kenny Loggins written exclusively for
            the movie Top Gun starring Tom Cruise.
          </Text>
        </AccordionCard>
      </Box>
    </ContentBlock>
  ),

  name: 'Single red card',
}

export const Sidebar = {
  render: () => (
    <ContentBlock>
      <div
        style={{
          maxWidth: 300,
        }}
      >
        <Box paddingY={[1, 2]}>
          <SidebarAccordion id="mini_accordion" label={'Sýna flokka'}>
            <Stack space={[1, 1, 2]}>
              <Text>Flokkur 1</Text>
              <Text>Flokkur 1</Text>
              <Text>Flokkur 1</Text>
              <Text>Flokkur 1</Text>
            </Stack>
          </SidebarAccordion>
        </Box>
      </div>
    </ContentBlock>
  ),

  name: 'Sidebar',
}
