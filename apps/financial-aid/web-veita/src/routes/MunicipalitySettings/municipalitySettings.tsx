import React from 'react'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Input } from '@island.is/island-ui/core'

import { useMunicipality } from '@island.is/financial-aid/shared/components'

export const MunicipalitySettings = () => {
  const { municipality, error, loading } = useMunicipality()
  const maxAmountLength = 6

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      {municipality && (
        <>
          <Box className={`contentUp delay-25`} marginTop={15}>
            <Text as="h1" variant="h1" marginBottom={[2, 2, 7]}>
              Sveitarfélagsstillingar
            </Text>
            <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
              Reglur um fjárhagsaðstoð {municipality.name}
            </Text>
          </Box>
          <Box marginBottom={[1, 1, 2]} className={`contentUp delay-25`}>
            <Input
              label="Slóð"
              name="financialAidRules"
              value={municipality.rulesHomepage ?? ''}
              backgroundColor="blue"
              onChange={() => console.log('bla')}
            />
          </Box>
          <Box className={`contentUp delay-50`}>
            <Text marginBottom={[2, 2, 7]} variant="small">
              Þegar umsóknum er synjað er hlekkur á slóð um reglur um
              fjárhagsaðstoð sveitarfélagsins birtur í tölvupósti sem er sendur
              á umsækjanda.
            </Text>
          </Box>
          <Box className={`contentUp delay-75`}>
            <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
              Almennt netfang sveitarfélagsins (félagsþjónusta)
            </Text>
          </Box>
          <Box marginBottom={[1, 1, 2]} className={`contentUp delay-75`}>
            <Input
              label="Netfang"
              name="municipalityEmail"
              value={municipality.email ?? ''}
              type="email"
              backgroundColor="blue"
              onChange={() => console.log('bla')}
            />
          </Box>
          <Box className={`contentUp delay-100`}>
            <Text marginBottom={[2, 2, 7]} variant="small">
              Ef ske kynni að tæknilegir örðugleikar yllu því að umsækjandi næði
              ekki að senda athugasemdir eða gögn í gegnum sína stöðusíðu þá er
              umsækjanda bent á að hægt sé að hafa samband með því að senda
              tölvupóst. Þá er þetta netfang birt umsækjanda til upplýsinga.
            </Text>

            <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
              Vefur sveitarfélagsins
            </Text>
          </Box>
          <Box marginBottom={[1, 1, 2]} className={`contentUp delay-100`}>
            <Input
              label="Slóð"
              name="municipalityWeb"
              value={municipality.homepage ?? ''}
              backgroundColor="blue"
              onChange={() => console.log('bla')}
            />
          </Box>
          <Text marginBottom={[2, 2, 7]} variant="small">
            Ef vísað er til þess að upplýsingar megi finna á vef
            sveitarfélagsins er notanda bent á þessa slóð.
          </Text>
          <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
            Einstaklingar
          </Text>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Eigin húsnæði"
              name="individualsOwnPlace"
              id="individualsOwnPlace"
              maximumInputLength={maxAmountLength}
              value={municipality.individualAid.ownPlace.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Leiga með þinglýstan leigusamning"
              name="individualsRegisteredRenting"
              id="individualsRegisteredRenting"
              maximumInputLength={maxAmountLength}
              value={municipality.individualAid.registeredRenting.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Leiga með óþinglýstan leigusamning"
              name="individualsUnregisteredRenting"
              id="individualsUnregisteredRenting"
              maximumInputLength={maxAmountLength}
              value={municipality.individualAid.unregisteredRenting.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Býr eða leigir hjá öðrum án þinglýsts leigusamnings"
              name="individualsWithOthers"
              id="individualsWithOthers"
              maximumInputLength={maxAmountLength}
              value={municipality.individualAid.withOthers.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Býr hjá foreldrum"
              name="individualsWithParents"
              id="individualsWithParents"
              maximumInputLength={maxAmountLength}
              value={municipality.individualAid.livesWithParents.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Ekkert að ofantöldu"
              name="individualsOther"
              id="individualsOther"
              maximumInputLength={maxAmountLength}
              value={municipality.individualAid.unknown.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
            Hjón/sambúð
          </Text>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Eigin húsnæði"
              name="cohabitationOwnPlace"
              id="cohabitationOwnPlace"
              maximumInputLength={maxAmountLength}
              value={municipality.cohabitationAid.ownPlace.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Leiga með þinglýstan leigusamning"
              name="cohabitationRegisteredRenting"
              id="cohabitationRegisteredRenting"
              maximumInputLength={maxAmountLength}
              value={municipality.cohabitationAid.registeredRenting.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Leiga með óþinglýstan leigusamning"
              name="cohabitationUnregisteredRenting"
              id="cohabitationUnregisteredRenting"
              maximumInputLength={maxAmountLength}
              value={municipality.cohabitationAid.unregisteredRenting.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Býr eða leigir hjá öðrum án þinglýsts leigusamnings"
              name="cohabitationWithOthers"
              id="cohabitationWithOthers"
              maximumInputLength={maxAmountLength}
              value={municipality.cohabitationAid.withOthers.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Býr hjá foreldrum"
              name="cohabitationWithParents"
              id="cohabitationWithParents"
              maximumInputLength={maxAmountLength}
              value={municipality.cohabitationAid.livesWithParents.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
          <Box marginBottom={[1, 1, 3]}>
            <NumberInput
              label="Ekkert að ofantöldu"
              name="cohabitationOther"
              id="cohabitationOther"
              maximumInputLength={maxAmountLength}
              value={municipality.cohabitationAid.unknown.toString()}
              onUpdate={(n) => console.log(n)}
            />
          </Box>
        </>
      )}

      {error && (
        <div>
          Abbabab mistókst að sækja sveitarfélagsstillingar, ertu örugglega með
          aðgang að þessu upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default MunicipalitySettings
