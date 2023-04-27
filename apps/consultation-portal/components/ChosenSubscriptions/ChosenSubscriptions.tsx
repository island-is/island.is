import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { ChosenSubscriptionCard } from '../Card'
import { Area } from '../../types/enums'
import {
  ArrOfIdAndName,
  CaseForSubscriptions,
  SubscriptionArray,
  TypeForSubscriptions,
} from '../../types/interfaces'

interface Props {
  subscriptionArray: SubscriptionArray
  typeData: Array<TypeForSubscriptions>
  casesData: Array<CaseForSubscriptions>
  institutionsData: Array<ArrOfIdAndName>
  policyAreasData: Array<ArrOfIdAndName>
  setSubscriptionArray: (arr: SubscriptionArray) => void
  onClear: () => void
  onSubmit: () => void
  buttonText: string
}

const ChosenSubscriptions = ({
  subscriptionArray,
  typeData,
  casesData,
  institutionsData,
  policyAreasData,
  setSubscriptionArray,
  onClear,
  onSubmit,
  buttonText,
}: Props) => {
  const {
    caseIds,
    institutionIds,
    policyAreaIds,
    generalSubscription,
  } = subscriptionArray

  return (
    <Stack space={0}>
      {!(
        caseIds.length === 0 &&
        institutionIds.length === 0 &&
        policyAreaIds.length === 0 &&
        generalSubscription.length === 0
      ) && (
        <>
          <Text paddingBottom={1} variant="eyebrow" paddingTop={2}>
            Valin mál
          </Text>

          {generalSubscription.length !== 0 &&
            typeData
              .filter((item) => generalSubscription == item.id)
              .map((filteredItem) => {
                return (
                  <ChosenSubscriptionCard
                    data={{
                      name: filteredItem.name,
                      caseNumber: filteredItem.nr,
                      id: filteredItem.id.toString(),
                      area: Area.case,
                    }}
                    subscriptionArray={subscriptionArray}
                    setSubscriptionArray={(
                      newSubscriptionArray: SubscriptionArray,
                    ) => setSubscriptionArray(newSubscriptionArray)}
                    key={`type-${filteredItem.nr}`}
                  />
                )
              })}
          {caseIds.length !== 0 &&
            caseIds.map((caseId) => {
              return casesData
                .filter((item) => caseId.id === item.id)
                .map((filteredItem) => (
                  <ChosenSubscriptionCard
                    data={{
                      name: filteredItem.name,
                      caseNumber: filteredItem.caseNumber,
                      id: filteredItem.id.toString(),
                      area: Area.case,
                    }}
                    subscriptionArray={subscriptionArray}
                    setSubscriptionArray={(
                      newSubscriptionArray: SubscriptionArray,
                    ) => setSubscriptionArray(newSubscriptionArray)}
                    key={`case-${caseId}`}
                  />
                ))
            })}
          {institutionIds.length !== 0 &&
            institutionIds.map((institutionId) => {
              return Object.values(institutionsData).map((filteredItem) => {
                if (filteredItem.id == institutionId.id.toString()) {
                  return (
                    <ChosenSubscriptionCard
                      data={{
                        name: filteredItem.name.toString(),
                        id: filteredItem.id,
                        area: Area.institution,
                      }}
                      subscriptionArray={subscriptionArray}
                      setSubscriptionArray={(
                        newSubscriptionArray: SubscriptionArray,
                      ) => setSubscriptionArray(newSubscriptionArray)}
                      key={`institution-${institutionId}`}
                    />
                  )
                }
              })
            })}
          {policyAreaIds.length !== 0 &&
            policyAreaIds.map((policyAreaId) => {
              return Object.values(policyAreasData)
                .filter((item) => policyAreaId.id.toString() === item.id)
                .map((filteredItem) => (
                  <ChosenSubscriptionCard
                    data={{
                      name: filteredItem.name.toString(),
                      id: filteredItem.id,
                      area: Area.policyArea,
                    }}
                    subscriptionArray={subscriptionArray}
                    setSubscriptionArray={(
                      newSubscriptionArray: SubscriptionArray,
                    ) => setSubscriptionArray(newSubscriptionArray)}
                    key={`policyArea-${policyAreaId}`}
                  />
                ))
            })}
          <Box
            marginTop={1}
            display={'flex'}
            justifyContent={'flexEnd'}
            alignItems="center"
          >
            <Box marginRight={3}>
              <Button
                size="small"
                icon="reload"
                variant="text"
                onClick={onClear}
                loading={false}
              >
                Hreinsa val
              </Button>
            </Box>
            <Button size="small" onClick={onSubmit}>
              {buttonText}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  )
}

export default ChosenSubscriptions
