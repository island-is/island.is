import React, { useContext } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box } from '@island.is/island-ui/core'
import { informationForDefendantMap } from '@island.is/judicial-system/types'
import {
  CheckboxList,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'

export const InformationForDefendant = ({
  defendant,
}: {
  defendant: Defendant
}) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const { setAndSendVerdictToServer } = useVerdict()

  const { verdict } = defendant
  if (!verdict) return null

  const defendantCheckboxes = Array.from(
    informationForDefendantMap.entries(),
  ).map(([key, value]) => ({
    label: value.label,
    value: key,
    tooltip: value.detail,
  }))

  return (
    <AnimatePresence>
      <Box>
        <SectionHeading
          title="Upplýsingagjöf til dómfellda"
          heading="h4"
          description="Vinsamlegast hakið við þau atriði sem upplýsa verður dómfellda um við
          birtingu dómsins."
        />
        <CheckboxList
          blueBox={false}
          fullWidth
          checkboxes={defendantCheckboxes.map((checkbox) => ({
            id: `${verdict.id}-${checkbox.value}`,
            title: checkbox.label['is'],
            info: checkbox.tooltip,
            checked:
              verdict.serviceInformationForDefendant?.includes(
                checkbox.value,
              ) ?? false,
            onChange: (checked) => {
              setAndSendVerdictToServer(
                {
                  defendantId: defendant.id,
                  caseId: workingCase.id,
                  serviceInformationForDefendant: checked
                    ? [
                        ...(verdict.serviceInformationForDefendant || []),
                        checkbox.value,
                      ]
                    : (verdict.serviceInformationForDefendant || []).filter(
                        (item) => item !== checkbox.value,
                      ),
                },
                setWorkingCase,
              )
            },
          }))}
        />
      </Box>
    </AnimatePresence>
  )
}
