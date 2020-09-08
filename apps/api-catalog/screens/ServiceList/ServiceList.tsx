import React from 'react'
import { Layout, ServiceCard, ServiceStatusValue } from '../../components'
import {
  Box,
  Stack,
  Typography,
  BulletList,
  Bullet
} from '@island.is/island-ui/core'
import { getAllServices } from '../../components/ServiceRepository/service-repository'

export default function ServiceList({services}) {
  return (
   
      <Layout left={
        <Box className="service-list">

<BulletList type='ul'>
      <Bullet> 
        Þjónusta að virka eins og búist er við
      </Bullet>
      <Bullet>
        Þjónusta svarar með töfum
      </Bullet>
      <Bullet>
        Þjónusta er óaðgengileg
      </Bullet>
      <Bullet>
        Staða þjónustu er ekki þekkt
      </Bullet>
    </BulletList>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={5}>
              <Stack space={3}>
                <Typography variant="h1">
                  Viskuausan
                </Typography>
              </Stack>
              <Stack space={3}>
                <Typography variant="intro">
                  Vefþjónustur
                </Typography>
              </Stack>
              <Stack space={3}>
                {
                  services.map( (item, index) => {
                    return <ServiceCard key={index} service={item} />
                  })
                }
              </Stack>
            </Stack>
          </Box>
        </Box>
        
      } />
  )
}

ServiceList.getInitialProps = async () => {
  /*const services = [
    { owner:"Þjóðskrá",         name:"Fasteignaskrá",       pricing:null,                          categories:null,                   type:["REST"],  access:["API GW"], status:ServiceStatusValue.OK},
    { owner:"Þjóðskrá",         name:"Einstaklingsskrá",    pricing:["free", "custom"],            categories:null,                   type:null,      access:["X-Road"], status:ServiceStatusValue.WARNING},
    { owner:"Þjóðskrá",         name:"Staðfangaskrá",       pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], status:ServiceStatusValue.ERROR},
    { owner:"Skatturinn",       name:"Virðisaukaskattur",   pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.WARNING},
    { owner:"Skatturinn",       name:"Staðgreiðsla",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.OK},
    { owner:"Vinnumálastofnun", name:"Fæðingarorlofssjóður",pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], status:ServiceStatusValue.ERROR},
    { owner:"Samgöngujstofa",   name:"Ökutækjaskrá",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.UNKNOWN},
  ];*/
  //const services = await fetch('http://localhost:3333/api')
  return {services:getAllServices().result};

}