import React from 'react'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Input } from '@island.is/island-ui/core'

import { useMunicipality } from '@island.is/financial-aid/shared/components'

export const MunicipalitySettings = () => {
  const { municipality, error, loading } = useMunicipality()
  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box className={`contentUp delay-25`} marginTop={15}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 7]}>
          Sveitarfélagsstillingar
        </Text>
      </Box>

      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Reglur um fjárhagsaðstoð {municipality?.name}
      </Text>
      <Box marginBottom={[1, 1, 2]}>
        <Input
          label="Slóð"
          name="financialAidRules"
          value={municipality?.rulesHomepage}
          backgroundColor="blue"
        />
      </Box>
      <Text marginBottom={[2, 2, 7]} variant="small">
        Þegar umsóknum er synjað er hlekkur á slóð um reglur um fjárhagsaðstoð
        sveitarfélagsins birtur í tölvupósti sem er sendur á umsækjanda.
      </Text>

      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Almennt netfang sveitarfélagsins (félagsþjónusta)
      </Text>
      <Box marginBottom={[1, 1, 2]}>
        <Input
          label="Netfang"
          name="municipalityEmail"
          value={municipality?.email}
          type="email"
          backgroundColor="blue"
        />
      </Box>
      <Text marginBottom={[2, 2, 7]} variant="small">
        Ef ske kynni að tæknilegir örðugleikar yllu því að umsækjandi næði ekki
        að senda athugasemdir eða gögn í gegnum sína stöðusíðu þá er umsækjanda
        bent á að hægt sé að hafa samband með því að senda tölvupóst. Þá er
        þetta netfang birt umsækjanda til upplýsinga.
      </Text>

      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Vefur sveitarfélagsins
      </Text>
      <Box marginBottom={[1, 1, 2]}>
        <Input
          label="Slóð"
          name="municipalityWeb"
          value={municipality?.homepage}
          backgroundColor="blue"
        />
      </Box>
      <Text marginBottom={[2, 2, 7]} variant="small">
        Ef vísað er til þess að upplýsingar megi finna á vef sveitarfélagsins er
        notanda bent á þessa slóð.
      </Text>

      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Einstaklingar
      </Text>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Eigin húsnæði"
          name="individualsOwnPlace"
          value={municipality?.individualAid.ownPlace}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Leiga með þinglýstan leigusamning"
          name="individualsRegisteredRenting"
          value={municipality?.individualAid.registeredRenting}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Leiga með óþinglýstan leigusamning"
          name="individualsUnregisteredRenting"
          value={municipality?.individualAid.unregisteredRenting}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Býr eða leigir hjá öðrum án þinglýsts leigusamnings"
          name="individualsWithOthers"
          value={municipality?.individualAid.withOthers}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Býr hjá foreldrum"
          name="individualsWithParents"
          value={municipality?.individualAid.livesWithParents}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Ekkert að ofantöldu"
          name="individualsOther"
          value={municipality?.individualAid.unknown}
          backgroundColor="blue"
        />
      </Box>

      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Einstaklingar
      </Text>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Eigin húsnæði"
          name="cohabitationOwnPlace"
          value={municipality?.cohabitationAid.ownPlace}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Leiga með þinglýstan leigusamning"
          name="cohabitationRegisteredRenting"
          value={municipality?.cohabitationAid.registeredRenting}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Leiga með óþinglýstan leigusamning"
          name="cohabitationUnregisteredRenting"
          value={municipality?.cohabitationAid.unregisteredRenting}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Býr eða leigir hjá öðrum án þinglýsts leigusamnings"
          name="cohabitationWithOthers"
          value={municipality?.cohabitationAid.withOthers}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Býr hjá foreldrum"
          name="cohabitationWithParents"
          value={municipality?.cohabitationAid.livesWithParents}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={[1, 1, 3]}>
        <Input
          label="Ekkert að ofantöldu"
          name="cohabitationOther"
          value={municipality?.cohabitationAid.unknown}
          backgroundColor="blue"
        />
      </Box>

      {error && (
        <div>
          Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að þessu
          upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default MunicipalitySettings
