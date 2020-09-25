import React, { Dispatch, SetStateAction, useState } from 'react'
import { Box, Checkbox, GridColumn } from '@island.is/island-ui/core'
import { Case, CustodyRestrictions } from '../../types'
import { parseArray } from '../formatters'
import { updateState } from '../stepHelper'
import * as api from '../../api'

const useRestrictions = (
  workingCase: Case,
  setWorkingCase: Dispatch<SetStateAction<Case>>,
) => {
  const [restrictionCheckboxOne, setRestrictionCheckboxOne] = useState(
    workingCase?.custodyRestrictions?.indexOf(CustodyRestrictions.ISOLATION) >
      -1,
  )
  const [restrictionCheckboxTwo, setRestrictionCheckboxTwo] = useState(
    workingCase?.custodyRestrictions?.indexOf(CustodyRestrictions.VISITAION) >
      -1,
  )
  const [restrictionCheckboxThree, setRestrictionCheckboxThree] = useState(
    workingCase?.custodyRestrictions?.indexOf(
      CustodyRestrictions.COMMUNICATION,
    ) > -1,
  )
  const [restrictionCheckboxFour, setRestrictionCheckboxFour] = useState(
    workingCase?.custodyRestrictions?.indexOf(CustodyRestrictions.MEDIA) > -1,
  )
  const restrictions = [
    {
      restriction: 'B - Einangrun',
      value: CustodyRestrictions.ISOLATION,
      getCheckbox: restrictionCheckboxOne,
      setCheckbox: setRestrictionCheckboxOne,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      value: CustodyRestrictions.VISITAION,
      getCheckbox: restrictionCheckboxTwo,
      setCheckbox: setRestrictionCheckboxTwo,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CustodyRestrictions.COMMUNICATION,
      getCheckbox: restrictionCheckboxThree,
      setCheckbox: setRestrictionCheckboxThree,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabanns',
      value: CustodyRestrictions.MEDIA,
      getCheckbox: restrictionCheckboxFour,
      setCheckbox: setRestrictionCheckboxFour,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

  return workingCase
    ? restrictions.map((restriction, index) => (
        <GridColumn span="3/7" key={index}>
          <Box marginBottom={3}>
            <Checkbox
              name={restriction.restriction}
              label={restriction.restriction}
              value={restriction.value}
              checked={restriction.getCheckbox}
              tooltip={restriction.explination}
              onChange={({ target }) => {
                // Toggle the checkbox on or off
                restriction.setCheckbox(target.checked)

                // Create a copy of the state
                const copyOfState = Object.assign(workingCase, {})
                console.log(copyOfState)
                // If the user is checking the box, add the restriction to the state
                if (target.checked) {
                  copyOfState.custodyRestrictions.push(
                    target.value as CustodyRestrictions,
                  )
                }
                // If the user is unchecking the box, remove the restriction from the state
                else {
                  const restrictions = copyOfState.custodyRestrictions
                  restrictions.splice(
                    restrictions.indexOf(target.value as CustodyRestrictions),
                    1,
                  )
                }

                // Set the updated state as the state
                setWorkingCase(copyOfState)

                // Save case
                api.saveCase(
                  workingCase.id,
                  parseArray(
                    'custodyRestrictions',
                    copyOfState.custodyRestrictions,
                  ),
                )

                updateState(
                  workingCase,
                  'restrictions',
                  copyOfState.custodyRestrictions,
                  setWorkingCase,
                )
              }}
              large
            />
          </Box>
        </GridColumn>
      ))
    : null
}

export default useRestrictions
