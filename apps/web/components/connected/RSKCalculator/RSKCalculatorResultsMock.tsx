import { Box, Stack, Text } from '@island.is/island-ui/core'

// NOT wired into Calculator.tsx, richText.tsx, or index.ts. This renders
// hardcoded placeholder figures from the Figma results design
// (figma.com/design/dUTnvqkWA2uFpLrTTP5f7T, node 7098:6309) for visual
// review only -- it must never be imported into a page that real users can
// reach, since the numbers are not derived from any calculation.

interface MockResultLine {
  label: string
  value: string
  emphasis?: boolean
}

interface MockResultGroup {
  title: string
  lines: MockResultLine[]
}

const MOCK_HERO_TOTAL = 'Heildarlaun eftir frádrátt: 692.762 kr.'

const MOCK_GROUPS: MockResultGroup[] = [
  {
    title: 'Útreikningar skattstofns',
    lines: [
      { label: 'Mánaðarlaun', value: '1.000.000 kr.' },
      { label: 'Greitt í lífeyrissjóð', value: '-40.000 kr.' },
      { label: 'Greitt í séreignarsparnað', value: '-20.000 kr.' },
      { label: 'Skattstofn', value: '940.000 kr.', emphasis: true },
    ],
  },
  {
    title: 'Staðgreiðsla og persónuafsláttur',
    lines: [
      { label: 'Skattþrep 1 (31,49%)', value: '-156.859 kr.' },
      { label: 'Skattþrep 2 (37,99%)', value: '-175.467 kr.' },
      { label: 'Skattþrep 3 (46,29%)', value: '0 kr.' },
      { label: 'Samanlögð staðgreiðsla', value: '-324.728 kr.', emphasis: true },
      { label: 'Eigin persónuafsláttur', value: '72.492 kr.' },
      { label: 'Persónuafsláttur maka', value: '14.498 kr.' },
      { label: 'Uppsafnaður persónuafsláttur nýttur', value: '100.000 kr.' },
      {
        label: 'Staðgreiðsla eftir persónuafslátt',
        value: '-137.738 kr.',
        emphasis: true,
      },
    ],
  },
  {
    title: 'Heildarlaun',
    lines: [
      {
        label: 'Heildarlaun eftir frádrátt',
        value: '692.762 kr.',
        emphasis: true,
      },
    ],
  },
  {
    title: 'Önnur gjöld launagreiðanda',
    lines: [
      { label: 'Mótframlag í lífeyrissjóð', value: '80.000 kr.' },
      { label: 'Ökutækjastyrkur utan staðgreiðslu', value: '100.000 kr.' },
      { label: 'Tryggingagjaldsstofn', value: '1.180.000 kr.' },
      { label: 'Tryggingagjald', value: '74.930 kr.' },
    ],
  },
]

export const RSKCalculatorResultsMock = () => (
  <Box background="blue100" paddingY={[3, 3, 6]} paddingX={[3, 3, 3, 3, 6]}>
    <Stack space={4}>
      <Stack space={2}>
        <Text variant="h2" as="h2">
          {MOCK_HERO_TOTAL}
        </Text>
      </Stack>
      {MOCK_GROUPS.map((group) => (
        <Stack key={group.title} space={2}>
          <Text variant="h5" as="h4">
            {group.title}
          </Text>
          <Stack space={1}>
            {group.lines.map((line) => (
              <Box
                key={line.label}
                display="flex"
                justifyContent="spaceBetween"
                columnGap={2}
              >
                <Text
                  variant="medium"
                  fontWeight={line.emphasis ? 'semiBold' : 'light'}
                >
                  {line.label}
                </Text>
                <Text
                  variant="medium"
                  fontWeight={line.emphasis ? 'semiBold' : 'light'}
                >
                  {line.value}
                </Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  </Box>
)

export default RSKCalculatorResultsMock
