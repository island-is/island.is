import React from 'react'
import { ServicePortalModuleComponent, m } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import {
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
  Input,
  Button,
  Divider,
} from '@island.is/island-ui/core'

export const Lookup: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  // const { data, loading, error, called } = useQuery<Query>()
  // const vehicles = data?.getVehiclesForUser?.vehicleList || []

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={3}>
              <Text variant="h3" as="h1">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-title',
                  defaultMessage: 'Uppfletting í ökutækjaskrá',
                })}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-intro',
                  defaultMessage: `Þú getur flett upp allt að 5 ökutækjum á dag.`,
                })}
              </Text>
              <Text variant="h5">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-terms-title',
                  defaultMessage: `Skilmálar fyrir leit í ökutækjaskrá`,
                })}
              </Text>
              <Text as="p" variant="small">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-terms-intro',
                  defaultMessage: `Við uppflettingu í og vinnslu upplýsinga úr ökutækjaskrá skal farið eftir lögum um persónuvernd og meðferð persónuupplýsinga.
                  Vakin er athygli á að uppflettingar upplýsinga í ökutækjaskrá eru færðar í aðgerðaskrár (log –skrár).
                  Þeim er flettir upp er heimilt að skrá upplýsingar úr ökutækjaskrá í eigið kerfi eftir því sem við á en óheimilt að safna þeim í sérstakan gagnagrunn yfir ökutæki.
                  Óheimilt er að breyta upplýsingum úr ökutækjaskrá.
                  Sá er flettir upp er aðeins heimilt að nota upplýsingarnar í eigin þágu. Óheimilt er að miðla upplýsingum úr ökutækjaskrá til þriðja aðila eða birta þær opinberlega nema að því leyti sem það getur talist eðlilegur þáttur í starfsemi viðtakanda. Persónuupplýsingar má þó aldrei birta opinberlega.`,
                })}
              </Text>
              <Button size="small">
                {' '}
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-terms-button',
                  defaultMessage: `Samþykkja skilmála`,
                })}
              </Button>
              <Divider />
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '4/12', '4/12', '4/12']}>
            <Stack space={2}>
              <Input
                icon="search"
                backgroundColor="blue"
                size="xs"
                value={''}
                onChange={(ev) => console.log(ev.target.value)}
                name="uppfletting-okutaekjaskra-leit"
                label={formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-label',
                  defaultMessage: `Uppfletting ökutækis`,
                })}
                placeholder={formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-placeholder',
                  defaultMessage: `Leitaðu eftir VIN / Fastanr / Skráningarnr.`,
                })}
              />
            </Stack>
          </GridColumn>
        </GridRow>
      </Stack>
    </>
  )
}

export default Lookup
