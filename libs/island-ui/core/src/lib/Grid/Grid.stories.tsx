import React from 'react'
import { GridRow } from './GridRow/GridRow'
import { GridColumn } from './GridColumn/GridColumn'
import { GridContainer } from './GridContainer/GridContainer'
import { Box } from '../Box/Box'
import * as styles from './demostyles.css'

export default {
  title: 'Layout/Grid',
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
      <GridColumn span="4/12">
        <DemoBox text="span 4" />
      </GridColumn>
      <GridColumn span="8/12">
        <GridRow className={styles.demo}>
          <GridColumn span="6/12">
            <DemoBox text="span 6" />
          </GridColumn>
          <GridColumn span="6/12">
            <GridRow className={styles.demo}>
              <GridColumn span="6/12">
                <DemoBox text="span 6" />
              </GridColumn>
              <GridColumn span="6/12">
                <DemoBox text="span 6" />
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridRow>
      </GridColumn>
    </GridRow>
    <GridRow className={styles.demo}>
      <GridColumn span="3/12">
        <DemoBox text="span 3/12" />
      </GridColumn>
      <GridColumn span="9/12">
        <GridRow className={styles.demo}>
          <GridColumn span="3/9">
            <DemoBox text="span 3/9" />
          </GridColumn>
          <GridColumn span="6/9">
            <GridRow className={styles.demo}>
              <GridColumn span="6/12">
                <DemoBox text="span 6/12" />
              </GridColumn>
              <GridColumn span="6/12">
                <DemoBox text="span 6/12" />
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridRow>
      </GridColumn>
    </GridRow>
    <GridRow className={styles.demo}>
      <GridColumn span="3/12">
        <DemoBox text="span 3/12" />
      </GridColumn>
      <GridColumn span="3/12">
        <DemoBox text="span 3/12" />
      </GridColumn>
      <GridColumn span="3/12">
        <DemoBox text="span 3/12" />
      </GridColumn>
      <GridColumn span="3/12">
        <DemoBox text="span 3/12" />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Default = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span="4/12">
        <DemoBox text="span 4" />
      </GridColumn>
      <GridColumn span="4/12">
        <DemoBox text="span 4" />
      </GridColumn>
      <GridColumn span="4/12">
        <DemoBox text="span 4" />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Responsive = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '6/12', '3/12', '2/12']}>
        <DemoBox text="span ['12/12', '6/12', '3/12', '2/12']" />
      </GridColumn>
      <GridColumn span={['12/12', '6/12', '3/12', '2/12']}>
        <DemoBox text="span ['12/12', '6/12', '3/12', '2/12']" />
      </GridColumn>
      <GridColumn span={['12/12', '6/12', '3/12', '2/12']}>
        <DemoBox text="span ['12/12', '6/12', '3/12', '2/12']" />
      </GridColumn>
      <GridColumn span={['12/12', '6/12', '3/12', '2/12']}>
        <DemoBox text="span ['12/12', '6/12', '3/12', '2/12']" />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Order = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span="1/5" order={[0, 1, 2, 3, 4]}>
        <DemoBox text="0, 1, 2, 3, 4" />
      </GridColumn>
      <GridColumn span="1/5" order={0}>
        <DemoBox text="0" />
      </GridColumn>
      <GridColumn span="1/5" order={1}>
        <DemoBox text="1" />
      </GridColumn>
      <GridColumn span="1/5" order={2}>
        <DemoBox text="2" />
      </GridColumn>
      <GridColumn span="1/5" order={3}>
        <DemoBox text="3" />
      </GridColumn>
    </GridRow>
  </GridContainer>
)

export const Offsets = () => (
  <Box paddingY={1}>
    <GridContainer>
      <GridRow>
        <GridColumn span="1/12" offset="11/12">
          <DemoBox text="offset 11" />
        </GridColumn>
        <GridColumn span="2/12" offset="10/12">
          <DemoBox text="offset 10" />
        </GridColumn>
        <GridColumn span="3/12" offset="9/12">
          <DemoBox text="offset 9" />
        </GridColumn>
        <GridColumn span="4/12" offset="8/12">
          <DemoBox text="offset 8" />
        </GridColumn>
        <GridColumn span="5/12" offset="7/12">
          <DemoBox text="offset 7" />
        </GridColumn>
        <GridColumn span="6/12" offset="6/12">
          <DemoBox text="offset 6" />
        </GridColumn>
        <GridColumn span="7/12" offset="5/12">
          <DemoBox text="offset 5" />
        </GridColumn>
        <GridColumn span="8/12" offset="4/12">
          <DemoBox text="offset 4" />
        </GridColumn>
        <GridColumn span="9/12" offset="3/12">
          <DemoBox text="offset 3" />
        </GridColumn>
        <GridColumn span="10/12" offset="2/12">
          <DemoBox text="offset 2" />
        </GridColumn>
        <GridColumn span="11/12" offset="1/12">
          <DemoBox text="offset 1" />
        </GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)

export const ResponsiveOffset = () => (
  <Box paddingY={1}>
    <GridContainer>
      <GridRow>
        <GridColumn span="5/12" offset={['7/12', '4/12', '0']}>
          <DemoBox text="['7/12', '4/12', '0']" />
        </GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)
