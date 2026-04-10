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

const SAMPLE_ITEMS = [
  { id: 'id_1', label: 'Hvenær þarf að skila umsókn?' },
  { id: 'id_2', label: 'Er hægt að leggja inn greiðslur á bankareikning maka?' },
  { id: 'id_3', label: 'Hvernig kem ég umsókninni til ykkar?' },
]

const SAMPLE_CONTENT = (
  <Text>
    Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
    Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
  </Text>
)

export default {
  title: 'Components/Accordion',
  component: Accordion,
}

// ---------------------------------------------------------------------------
// Accordion — variant="small" (default)
// labelVariant: h4 | icon: 40x40
// ---------------------------------------------------------------------------
export const SmallVariant = {
  render: () => (
    <Accordion>
      {SAMPLE_ITEMS.map(({ id, label }) => (
        <AccordionItem key={id} id={id} label={label}>
          {SAMPLE_CONTENT}
        </AccordionItem>
      ))}
    </Accordion>
  ),
  name: 'Small (default)',
}

// ---------------------------------------------------------------------------
// Accordion — variant="large"
// labelVariant: h3 | icon: 40x40
// ---------------------------------------------------------------------------
export const LargeVariant = {
  render: () => (
    <Accordion variant="large">
      {SAMPLE_ITEMS.map(({ id, label }) => (
        <AccordionItem key={id} id={id} label={label}>
          {SAMPLE_CONTENT}
        </AccordionItem>
      ))}
    </Accordion>
  ),
  name: 'Large',
}

// ---------------------------------------------------------------------------
// Accordion — variant="mini"
// labelVariant: h5 | icon: 20x20 (sidebar style)
// ---------------------------------------------------------------------------
export const MiniVariant = {
  render: () => (
    <Accordion variant="mini">
      {SAMPLE_ITEMS.map(({ id, label }) => (
        <AccordionItem key={id} id={id} label={label}>
          {SAMPLE_CONTENT}
        </AccordionItem>
      ))}
    </Accordion>
  ),
  name: 'Mini',
}

// ---------------------------------------------------------------------------
// Accordion — singleExpand (only one item open at a time)
// ---------------------------------------------------------------------------
export const SingleExpand = {
  render: () => (
    <Accordion singleExpand>
      {SAMPLE_ITEMS.map(({ id, label }) => (
        <AccordionItem key={id} id={id} label={label}>
          {SAMPLE_CONTENT}
        </AccordionItem>
      ))}
    </Accordion>
  ),
  name: 'Single expand',
}

// ---------------------------------------------------------------------------
// Accordion — no dividers
// ---------------------------------------------------------------------------
export const NoDividers = {
  render: () => (
    <Accordion dividers={false} dividerOnTop={false} dividerOnBottom={false}>
      {SAMPLE_ITEMS.map(({ id, label }) => (
        <AccordionItem key={id} id={id} label={label}>
          {SAMPLE_CONTENT}
        </AccordionItem>
      ))}
    </Accordion>
  ),
  name: 'No dividers',
}

// ---------------------------------------------------------------------------
// AccordionItem — startExpanded
// ---------------------------------------------------------------------------
export const StartExpanded = {
  render: () => (
    <Accordion>
      <AccordionItem id="id_1" label={SAMPLE_ITEMS[0].label} startExpanded>
        {SAMPLE_CONTENT}
      </AccordionItem>
      <AccordionItem id="id_2" label={SAMPLE_ITEMS[1].label}>
        {SAMPLE_CONTENT}
      </AccordionItem>
    </Accordion>
  ),
  name: 'Start expanded',
}

// ---------------------------------------------------------------------------
// AccordionItem — colored label
// ---------------------------------------------------------------------------
export const ColoredLabel = {
  render: () => (
    <Accordion>
      {SAMPLE_ITEMS.map(({ id, label }) => (
        <AccordionItem key={id} id={id} label={label} labelColor="blue400">
          {SAMPLE_CONTENT}
        </AccordionItem>
      ))}
    </Accordion>
  ),
  name: 'Colored label',
}

// ---------------------------------------------------------------------------
// AccordionCard — variant="small" (default)
// ---------------------------------------------------------------------------
export const CardSmall = {
  render: () => (
    <ContentBlock>
      <Stack space={2}>
        {SAMPLE_ITEMS.map(({ id, label }) => (
          <AccordionCard key={id} id={id} label={label}>
            {SAMPLE_CONTENT}
          </AccordionCard>
        ))}
      </Stack>
    </ContentBlock>
  ),
  name: 'Card — Small (default)',
}

// ---------------------------------------------------------------------------
// AccordionCard — variant="large"
// ---------------------------------------------------------------------------
export const CardLarge = {
  render: () => (
    <ContentBlock>
      <Stack space={2}>
        {SAMPLE_ITEMS.map(({ id, label }) => (
          <AccordionCard key={id} id={id} label={label} variant="large">
            {SAMPLE_CONTENT}
          </AccordionCard>
        ))}
      </Stack>
    </ContentBlock>
  ),
  name: 'Card — Large',
}

// ---------------------------------------------------------------------------
// AccordionCard — red color variant
// ---------------------------------------------------------------------------
export const CardRed = {
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
  name: 'Card — Red',
}

// ---------------------------------------------------------------------------
// AccordionCard — with visibleContent (always-visible subtitle)
// ---------------------------------------------------------------------------
export const CardWithVisibleContent = {
  render: () => (
    <ContentBlock>
      <Box paddingY={[1, 2]}>
        <AccordionCard
          id="id_1"
          label={SAMPLE_ITEMS[0].label}
          visibleContent={
            <Box paddingY={2} paddingBottom={1}>
              <Text>
                Hér getur komið eitthvað meira efni sem sést alltaf og er birt
                fyrir neðan titil.
              </Text>
            </Box>
          }
        >
          {SAMPLE_CONTENT}
        </AccordionCard>
      </Box>
    </ContentBlock>
  ),
  name: 'Card — With visible content',
}

// ---------------------------------------------------------------------------
// SidebarAccordion — mini sidebar style (standalone, no Accordion wrapper needed)
// ---------------------------------------------------------------------------
export const Sidebar = {
  render: () => (
    <ContentBlock>
      <div style={{ maxWidth: 300 }}>
        <Box paddingY={[1, 2]}>
          <SidebarAccordion id="sidebar_1" label="Sýna flokka">
            <Stack space={[1, 1, 2]}>
              <Text>Flokkur 1</Text>
              <Text>Flokkur 2</Text>
              <Text>Flokkur 3</Text>
              <Text>Flokkur 4</Text>
            </Stack>
          </SidebarAccordion>
        </Box>
      </div>
    </ContentBlock>
  ),
  name: 'Sidebar (SidebarAccordion)',
}
