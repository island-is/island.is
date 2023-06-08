import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { CategoryCard, CategoryCardImage, STACK_WIDTH } from './CategoryCard'

export default {
  title: 'Cards/CategoryCard',
  component: CategoryCard,
  parameters: withFigma('CategoryCard'),
}

const getDemoTags = (amount: number) => {
  const demoTags = [
    'Fæðingarorlof',
    'Leikskóli',
    'Skólaganga',
    'Vinnumarkaður',
    'Fjármál',
    'Fréttir',
    'Tölfræði',
    'Atvinnulífið',
    'Hagkerfið',
    'Barneignir',
    'Eftirlaun',
  ]

  const getRandomTag = () =>
    demoTags[Math.floor(Math.random() * demoTags.length)]

  return Array.from({ length: amount }, () => ({
    label: getRandomTag(),
    href: '/',
  }))
}

export const Default = () => (
  <CategoryCard heading="Heading" text="Text here" tags={getDemoTags(4)} />
)

export const Layout = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span="6/12" paddingBottom={3}>
        <CategoryCard
          heading="Fæðingarorlof"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(3)}
        />
      </GridColumn>
      <GridColumn span="6/12" paddingBottom={3}>
        <CategoryCard
          heading="Fjármál"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(4)}
        />
      </GridColumn>
      <GridColumn span="6/12" paddingBottom={3}>
        <CategoryCard
          heading="Tölfræði"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(2)}
        />
      </GridColumn>
      <GridColumn span="6/12" paddingBottom={3}>
        <CategoryCard
          heading="Hagkerfið"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(5)}
        />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const RedColorSchemeLayout = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Fæðingarorlof"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(3)}
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Fjármál"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(4)}
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Tölfræði"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(2)}
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Hagkerfið"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          tags={getDemoTags(5)}
        />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const NoTags = () => (
  <CategoryCard
    heading="Atvinnurekstur og sjálfstætt starfandi"
    text="Stofnun fyrirtækja, launagreiðslur, gjaldþrot, löggildingar, starfsleyfi, vinnuvernd og fleira"
  />
)

export const NoTagsLayout = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          heading="Atvinnurekstur og sjálfstætt starfandi"
          text="Stofnun fyrirtækja, launagreiðslur, gjaldþrot, löggildingar, starfsleyfi, vinnuvernd og fleira"
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          heading="Fjármál"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          heading="Tölfræði"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          heading="Hagkerfið"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
        />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const OnlyLabelTag = () => (
  <CategoryCard
    heading="Atvinnurekstur og sjálfstætt starfandi"
    text="Stofnun fyrirtækja, launagreiðslur, gjaldþrot, löggildingar, starfsleyfi, vinnuvernd og fleira"
    tags={[{ label: 'Not clickable', disabled: true }]}
  />
)

export const TruncatedHeading = () => (
  <CategoryCard
    heading="Unbroken.Very.Long.String.Used.As.The.Heading"
    truncateHeading
    text="The heading above is truncated instead of overflowing"
    tags={getDemoTags(4)}
  />
)

export const HyphenatedHeading = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          heading="Vaðlaheiðarvegavinnuverkfærageymsluskúraútidyralyklakippuhringur"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          hyphenate
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          heading="Vaðlaheiðarvegavinnuverkfærageymsluskúraútidyralyklakippuhringur"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          hyphenate
        />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

const imageProps: CategoryCardImage = {
  alt: 'Logo',
  objectFit: 'contain',
  src: 'data:image/svg+xml;base64,PHN2ZwogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iNDAiCiAgaGVpZ2h0PSI0MCIKICBmaWxsPSJub25lIgogIHZpZXdCb3g9IjAgMCA0MCA0MCIKICBjbGFzcz0iTG9nb19yb290X18xZXNhcWRzMCIKICBzdHlsZT0iY29sb3I6ICNmZmYiCiAgYXJpYS1sYWJlbD0iaXNsYW5kLmlzIGxvZ28iCj4KICA8cGF0aAogICAgZmlsbD0idXJsKCNwYWludDBfbGluZWFyX2Zvb3Rlcl9sb2dvKSIKICAgIGQ9Ik04LjIyMjU0IDE2LjIzMzJWMzkuMDQ1OEM4LjIyMjU0IDM5LjU3NjMgNy45NTcyOSAzOS44NDE1IDcuNDI2ODEgMzkuODQxNUgyLjAxNTE4QzEuNDg0NjkgMzkuODQxNSAxLjIxOTQ1IDM5LjU3NjMgMS4yMTk0NSAzOS4wNDU4VjE2LjIzMzJDMS4yMTk0NSAxNS43MDI3IDEuNDg0NjkgMTUuNDM3NSAyLjAxNTE4IDE1LjQzNzVINy40MjY4MUM3Ljk1NzI5IDE1LjQzNzUgOC4yMjI1NCAxNS43MDI3IDguMjIyNTQgMTYuMjMzMlpNMjAgMzAuNTU4QzE3LjM0OTIgMzAuNTU4IDE1LjI3OSAzMi42Mjk5IDE1LjI3OSAzNS4yNzlDMTUuMjc5IDM3LjkyOTggMTcuMzUwOSA0MCAyMCA0MEMyMi42NTA4IDQwIDI0LjcyMSAzNy45MjgxIDI0LjcyMSAzNS4yNzlDMjQuNzIxIDMyLjYyOTkgMjIuNjUwOCAzMC41NTggMjAgMzAuNTU4Wk0zNS4yNzkgMzAuNTU4QzMyLjYyODIgMzAuNTU4IDMwLjU1OCAzMi42Mjk5IDMwLjU1OCAzNS4yNzlDMzAuNTU4IDM3LjkyOTggMzIuNjI5OSA0MCAzNS4yNzkgNDBDMzcuOTI5OCA0MCA0MCAzNy45MjgxIDQwIDM1LjI3OUM0MCAzMi42Mjk5IDM3LjkyODEgMzAuNTU4IDM1LjI3OSAzMC41NThaTTIwIDE1LjI3OUMxNy4zNDkyIDE1LjI3OSAxNS4yNzkgMTcuMzUwOSAxNS4yNzkgMjBDMTUuMjc5IDIyLjY1MDggMTcuMzUwOSAyNC43MjEgMjAgMjQuNzIxQzIyLjY1MDggMjQuNzIxIDI0LjcyMSAyMi42NDkxIDI0LjcyMSAyMEMyNC43MjEgMTcuMzUwOSAyMi42NTA4IDE1LjI3OSAyMCAxNS4yNzlaTTM1LjI3OSAxNS4yNzlDMzIuNjI4MiAxNS4yNzkgMzAuNTU4IDE3LjM1MDkgMzAuNTU4IDIwQzMwLjU1OCAyMi42NTA4IDMyLjYyOTkgMjQuNzIxIDM1LjI3OSAyNC43MjFDMzcuOTI5OCAyNC43MjEgNDAgMjIuNjQ5MSA0MCAyMEM0MCAxNy4zNTA5IDM3LjkyODEgMTUuMjc5IDM1LjI3OSAxNS4yNzlaTTIwIDBDMTcuMzQ5MiAwIDE1LjI3OSAyLjA3MTkgMTUuMjc5IDQuNzIwOTlDMTUuMjc5IDcuMzcxNzYgMTcuMzUwOSA5LjQ0MTk5IDIwIDkuNDQxOTlDMjIuNjUwOCA5LjQ0MTk5IDI0LjcyMSA3LjM3MDA5IDI0LjcyMSA0LjcyMDk5QzI0LjcyMSAyLjA3MTkgMjIuNjUwOCAwIDIwIDBaTTM1LjI3OSA5LjQ0MTk5QzM3LjkyOTggOS40NDE5OSA0MCA3LjM3MDA5IDQwIDQuNzIwOTlDNDAgMi4wNzAyMyAzNy45MjgxIDAgMzUuMjc5IDBDMzIuNjI4MiAwIDMwLjU1OCAyLjA3MTkgMzAuNTU4IDQuNzIwOTlDMzAuNTU4IDcuMzcxNzYgMzIuNjI4MiA5LjQ0MTk5IDM1LjI3OSA5LjQ0MTk5Wk00LjcyMDk5IDBDMi4wNzE5IDAgMCAyLjA3MTkgMCA0LjcyMDk5QzAgNy4zNzE3NiAyLjA3MTkgOS40NDE5OSA0LjcyMDk5IDkuNDQxOTlDNy4zNzE3NiA5LjQ0MTk5IDkuNDQxOTkgNy4zNzAwOSA5LjQ0MTk5IDQuNzIwOTlDOS40NDE5OSAyLjA3MTkgNy4zNzE3NiAwIDQuNzIwOTkgMFoiCiAgPjwvcGF0aD4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICBpZD0icGFpbnQwX2xpbmVhcl9mb290ZXJfbG9nbyIKICAgICAgeDE9IjEuMTI3NiIKICAgICAgeTE9IjEuNjA2MjkiCiAgICAgIHgyPSIzOC4zOTQxIgogICAgICB5Mj0iMzguODcyOCIKICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICA+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAxNjFGRCI+PC9zdG9wPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuMjQ1NyIgc3RvcC1jb2xvcj0iIzNGNDZEMiI+PC9zdG9wPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNTA3OSIgc3RvcC1jb2xvcj0iIzgxMkVBNCI+PC9zdG9wPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNzcyNiIgc3RvcC1jb2xvcj0iI0MyMTU3OCI+PC9zdG9wPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRDAwNTAiPjwvc3RvcD4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgo8L3N2Zz4K',
}

export const WithLogo = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Fæðingarorlof"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          {...imageProps}
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Fjármál"
          text="Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður."
          {...imageProps}
        />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const AutoStackLogo = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
        <CategoryCard
          colorScheme="red"
          heading="Fæðingarorlof"
          text={`The image is automatically stacked below the content once the card width goes below the given 'stackWidth' value. Defaults to ${STACK_WIDTH}px.`}
          {...imageProps}
          autoStack
          stackWidth={200}
        />
      </GridColumn>
    </GridRow>
  </GridContainer>
)
