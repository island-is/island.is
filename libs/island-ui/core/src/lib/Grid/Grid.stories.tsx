import React from 'react'
import { Grid } from './Grid'
import { GridItem } from './GridItem'
import { Box } from '../Box/Box'

export default {
  title: 'Core/Grid',
  component: GridItem,
}

const DemoBox = ({ text = 'Grid item' }) => (
  <Box
    background="blue300"
    width="full"
    height="full"
    textAlign="center"
    marginY={1}
    paddingY={1}
  >
    {text}
  </Box>
)

export const Default = () => (
  <Grid>
    <GridItem span={4}>
      <DemoBox text="span 4" />
    </GridItem>
    <GridItem span={4}>
      <DemoBox text="span 4" />
    </GridItem>
    <GridItem span={4}>
      <DemoBox text="span 4" />
    </GridItem>
  </Grid>
)

export const Responsive = () => (
  <Grid>
    <GridItem span={[12, 6, 3, 2]}>
      <DemoBox text="span [12, 6, 3, 2]" />
    </GridItem>
    <GridItem span={[12, 6, 3, 2]}>
      <DemoBox text="span [12, 6, 3, 2]" />
    </GridItem>
    <GridItem span={[12, 6, 3, 2]}>
      <DemoBox text="span [12, 6, 3, 2]" />
    </GridItem>
    <GridItem span={[12, 6, 3, 2]}>
      <DemoBox text="span [12, 6, 3, 2]" />
    </GridItem>
  </Grid>
)

export const Offsets = () => (
  <>
    <Box paddingY={1}>
      <Grid>
        <GridItem span={1} offset={11}>
          <DemoBox text="offset 11" />
        </GridItem>
        <GridItem span={2} offset={10}>
          <DemoBox text="offset 10" />
        </GridItem>
        <GridItem span={3} offset={9}>
          <DemoBox text="offset 9" />
        </GridItem>
        <GridItem span={4} offset={8}>
          <DemoBox text="offset 8" />
        </GridItem>
        <GridItem span={5} offset={7}>
          <DemoBox text="offset 7" />
        </GridItem>
        <GridItem span={6} offset={6}>
          <DemoBox text="offset 6" />
        </GridItem>
        <GridItem span={7} offset={5}>
          <DemoBox text="offset 5" />
        </GridItem>
        <GridItem span={8} offset={4}>
          <DemoBox text="offset 4" />
        </GridItem>
        <GridItem span={9} offset={3}>
          <DemoBox text="offset 3" />
        </GridItem>
        <GridItem span={10} offset={2}>
          <DemoBox text="offset 2" />
        </GridItem>
        <GridItem span={11} offset={1}>
          <DemoBox text="offset 1" />
        </GridItem>
      </Grid>
    </Box>
  </>
)
