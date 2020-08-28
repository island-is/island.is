import React from 'react'
import { GridRow } from './GridRow'
import { GridColumn } from './GridColumn'
import { GridContainer } from './GridContainer'
import { Box } from '../Box/Box'
import * as styles from './demostyles.treat'

export default {
  title: 'Core/Grid',
  component: GridColumn,
}

const DemoBox = ({ text = 'Grid item' }) => (
  <Box
    background="blue300"
    width="full"
    textAlign="center"
    marginY={1}
    paddingY={1}
  >
    {text}
  </Box>
)

export const Nested = () => (
  <GridContainer>
    <GridRow className={styles.demo}>
      <GridColumn span={4}>
        <DemoBox text="span 4" />
      </GridColumn>
      <GridColumn span={8}>
        <GridRow className={styles.demo}>
          <GridColumn span={6}>
            <DemoBox text="span 6" />
          </GridColumn>
          <GridColumn span={6}>
            <GridRow className={styles.demo}>
              <GridColumn span={6}>
                <DemoBox text="span 6" />
              </GridColumn>
              <GridColumn span={6}>
                <DemoBox text="span 6" />
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridRow>
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Default = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={4}>
        <DemoBox text="span 4" />
      </GridColumn>
      <GridColumn span={4}>
        <DemoBox text="span 4" />
      </GridColumn>
      <GridColumn span={4}>
        <DemoBox text="span 4" />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Responsive = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={[12, 6, 3, 2]}>
        <DemoBox text="span [12, 6, 3, 2]" />
      </GridColumn>
      <GridColumn span={[12, 6, 3, 2]}>
        <DemoBox text="span [12, 6, 3, 2]" />
      </GridColumn>
      <GridColumn span={[12, 6, 3, 2]}>
        <DemoBox text="span [12, 6, 3, 2]" />
      </GridColumn>
      <GridColumn span={[12, 6, 3, 2]}>
        <DemoBox text="span [12, 6, 3, 2]" />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Offsets = () => (
  <>
    <Box paddingY={1}>
      <GridContainer>
        <GridRow>
          <GridColumn span={1} offset={11}>
            <DemoBox text="offset 11" />
          </GridColumn>
          <GridColumn span={2} offset={10}>
            <DemoBox text="offset 10" />
          </GridColumn>
          <GridColumn span={3} offset={9}>
            <DemoBox text="offset 9" />
          </GridColumn>
          <GridColumn span={4} offset={8}>
            <DemoBox text="offset 8" />
          </GridColumn>
          <GridColumn span={5} offset={7}>
            <DemoBox text="offset 7" />
          </GridColumn>
          <GridColumn span={6} offset={6}>
            <DemoBox text="offset 6" />
          </GridColumn>
          <GridColumn span={7} offset={5}>
            <DemoBox text="offset 5" />
          </GridColumn>
          <GridColumn span={8} offset={4}>
            <DemoBox text="offset 4" />
          </GridColumn>
          <GridColumn span={9} offset={3}>
            <DemoBox text="offset 3" />
          </GridColumn>
          <GridColumn span={10} offset={2}>
            <DemoBox text="offset 2" />
          </GridColumn>
          <GridColumn span={11} offset={1}>
            <DemoBox text="offset 1" />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  </>
)
