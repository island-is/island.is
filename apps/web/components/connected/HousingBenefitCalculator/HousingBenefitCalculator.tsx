import { ConnectedComponent } from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  Column,
  GridContainer,
  GridRow,
  Inline,
  Input,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import * as style from './HousingBenefitCalculator.css'
import { useState } from 'react'
import { ConsoleLogger } from '@nestjs/common'
import { set } from 'lodash'
import { value } from '../../Organization/Slice/TimelineSlice/Event.css'

interface HousingBenefitCalculatorProps {
  slice: ConnectedComponent
}

const HousingBenefitCalculator = ({ slice }: HousingBenefitCalculatorProps) => {
  //const { title, body } = slice
  const [radioValue, setRadioValue] = useState(0)
  const [result, setResult] = useState(0)
  const [state, setState] = useState({
    radioValue: radioValue, //TODO: broken
    income: 0,
    assets: 0,
    housingCost: 0,
  })
  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }
  const calculator = () => {
    handleChange
    // if ((outputBox.hidden = true)) {
    //   outputBox.hidden = false
    // }
    // const res =
    //   state.radioValue + state.income + state.assets + state.housingCost
    // setResult(res)
    console.log(state)
  }

  //const outputBox = document.getElementById('outputContainer')
  return (
    <Box>
      <Box
        id="calculator"
        background="blue100"
        paddingX={15}
        paddingY={8}
        marginBottom={5}
      >
        <Stack space={5}>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              Fjöldi heimilismanna í húsnæði?
            </Text>

            <Inline space={5}>
              <RadioButton
                //name="radioValue"
                label="1"
                //value={1}
                //onChange={handleChange}
                onChange={() => setRadioValue(1)}
                checked={radioValue === 1}
              />
              <RadioButton
                //name="radioValue"
                label="2"
                //value={2}
                onChange={() => setRadioValue(2)}
                checked={radioValue === 2}
              />
              <RadioButton
                //name="radioValue"
                label="3"
                //value={3}
                onChange={() => setRadioValue(3)}
                checked={radioValue === 3}
              />
              <RadioButton
                //name="radioValue"
                label="4 eða fleiri"
                //value={4}
                onChange={() => setRadioValue(4)}
                checked={radioValue === 4}
              />
            </Inline>
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              Samanlagðar mánaðartekjur heimilsmanna 18 ára og eldri (tekjur f.
              skatt)?
            </Text>
            <Input
              size="sm"
              label="Tekjur"
              name="income"
              placeholder="Tekjur"
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              Eignir Heimilismanna 18 ára og eldri?
            </Text>
            <Input
              size="sm"
              label="Eignir"
              name="assets"
              placeholder="Eignir"
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              Húsnæðiskostnaður á mánuði?
            </Text>
            <Input
              size="sm"
              label="Húsnæðiskostnaður"
              name="housingCost"
              placeholder="Húsnæðiskostnaður"
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Text variant="eyebrow">
            Útreikningur húsnæðisbóta samkvæmt reiknivélinni byggir á þeim
            forsendum sem þú gafst upp og telst ekki bindandi ákvörðun um
            húsnæðisbætur. Útreikningur miðast við greiðslur húsnæðisbóta fyrir
            heilt almanaksár.
          </Text>
          <Button
            id="calculateButton"
            // todo add click handler
            //onClick={() => setResult(calculator(radioValue, 1, 1, 1))}
            onClick={calculator}
          >
            Reikna
          </Button>
        </Stack>
      </Box>
      <Box
        id="outputContainer"
        background="blue100"
        paddingX={15}
        paddingY={5}
        hidden
      >
        <Text variant="h3">
          <strong>Niðurstöður</strong>
        </Text>
        <Text
          variant="medium"
          fontWeight="light"
          paddingBottom={2}
          paddingTop={5}
        >
          Hámarksbætur miðað við fjölda heimilismanna eru {result} kr. á mánuði.
        </Text>
        <Text variant="medium" fontWeight="light" paddingBottom={3}>
          Skerðing vegna húsnæðiskostnaðar eru {result + 1} kr. á mánuði.
        </Text>
        <Text variant="medium" fontWeight="light">
          Áætlaðar húsnæðisbætur eru <strong>{result + 2} kr.</strong> á mánuði.
        </Text>
      </Box>
    </Box>
  )
}

export default HousingBenefitCalculator
