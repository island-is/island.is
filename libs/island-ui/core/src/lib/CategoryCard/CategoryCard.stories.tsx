import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { withFigma } from '../../utils/withFigma'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { CategoryCard } from './CategoryCard'

export default {
  title: 'Cards/CategoryCard',
  component: CategoryCard,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=96%3A581',
  }),
}

const getDemoTags = (amount) => {
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

  return Array.from({ length: amount }, (_, i) => ({
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
