import { useContext } from 'react'
import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import {
  getDefendantVerdictAppealDecisionLabel,
  getServiceRequirementText,
} from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  Feature,
  informationForDefendantMap,
  ServiceRequirement,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  FeatureContext,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'

export const ConfirmationInformation = ({
  uploadFiles,
}: {
  uploadFiles: TUploadFile[]
}) => {
  const { features } = useContext(FeatureContext)

  const { workingCase } = useContext(FormContext)
  const criminalRecordUploadFileNames = uploadFiles
    .filter((file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE)
    .map((file) => file.name)

  const verdictFileNames = uploadFiles
    .filter((file) => file.category === CaseFileCategory.RULING)
    .map((file) => file.name)

  const isRuling =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
  const defendants = workingCase.defendants || []

  const requiresVerdictDeliveryToDefendant = defendants.some(
    ({ verdict }) =>
      verdict?.serviceRequirement === ServiceRequirement.REQUIRED,
  )

  return (
    <Box display="flex" rowGap={3} flexDirection="column">
      <Box>
        <Text>Gögn verða send til Ríkissaksóknara til yfirlesturs. </Text>
        {features?.includes(Feature.VERDICT_DELIVERY) && (
          <Text>Ef birta þarf dóm verður hann sendur í rafræna birtingu.</Text>
        )}
      </Box>
      <Box>
        <Text>Staðfestið eftirfarandi upplýsingar:</Text>
      </Box>
      <Box>
        <Text fontWeight="semiBold" as="span">
          Tilkynning til sakaskrár:{' '}
        </Text>
        <Text as="span">
          {isNonEmptyArray(criminalRecordUploadFileNames)
            ? criminalRecordUploadFileNames.join(', ')
            : 'Engu skjali hefur verið hlaðið upp'}
        </Text>
      </Box>
      {isRuling && features?.includes(Feature.VERDICT_DELIVERY) && (
        <>
          {requiresVerdictDeliveryToDefendant && (
            <Box>
              <Text fontWeight="semiBold" as="span">
                Skjal sem fer í birtingu í stafrænt pósthólf:{' '}
              </Text>
              <Text as="span">
                {isNonEmptyArray(verdictFileNames)
                  ? verdictFileNames.join(', ')
                  : 'Engu skjali hefur verið hlaðið upp'}
              </Text>
            </Box>
          )}
          {defendants.map((defendant) => {
            const { verdict } = defendant
            if (!verdict) return null

            return (
              <BlueBox key={defendant.id}>
                <Box
                  key={defendant.id}
                  display="flex"
                  rowGap={2}
                  flexDirection="column"
                >
                  <Box>
                    <Text fontWeight="semiBold" as="span">
                      Dómfelldi:{' '}
                    </Text>
                    <Text as="span">{defendant.name}</Text>
                  </Box>
                  {verdict.serviceRequirement && (
                    <Box>
                      <Text fontWeight="semiBold" as="span">
                        Ákvörðun um birtingu:{' '}
                      </Text>
                      <Text as="span">
                        {getServiceRequirementText(verdict.serviceRequirement)}
                      </Text>
                    </Box>
                  )}
                  {isNonEmptyArray(verdict.serviceInformationForDefendant) && (
                    <Box>
                      <Text fontWeight="semiBold" marginBottom={1}>
                        Upplýsingar til dómfellda
                      </Text>
                      <Box as="ul" marginLeft={2}>
                        {verdict.serviceInformationForDefendant.map(
                          (information, i) => {
                            const info =
                              informationForDefendantMap.get(information)
                            if (!info) return null

                            return (
                              <li key={defendant.id + i}>
                                <Text as="span">{info.label}</Text>
                              </li>
                            )
                          },
                        )}
                      </Box>
                    </Box>
                  )}
                  {verdict.appealDecision && (
                    <Box>
                      <Text fontWeight="semiBold" as="span">
                        Afstaða dómfellda til dóms:{' '}
                      </Text>
                      <Text as="span">
                        {getDefendantVerdictAppealDecisionLabel(
                          verdict.appealDecision,
                        )}
                      </Text>
                    </Box>
                  )}
                </Box>
              </BlueBox>
            )
          })}
        </>
      )}
    </Box>
  )
}
