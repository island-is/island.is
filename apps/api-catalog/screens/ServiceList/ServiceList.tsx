import React, { useState, useEffect } from 'react'
import { Layout, ServiceCard } from '../../components'
import {  Box,  Stack,  BulletList,  Bullet,  Button } from '@island.is/island-ui/core'
import { getServices, GetServicesParameters } from '../../components/ServiceRepository/service-repository'
import { useRouter } from 'next/dist/client/router'
import { ServiceCardInformation } from 'apps/api-catalog/components/ServiceCard/service-card'
import { ParsedUrlQuery } from 'querystring'

export interface ServiceListProps {
  servicesList:Array<ServiceCardInformation>
  nextCursor: number,
  parameters: GetServicesParameters
}


export default function ServiceList(props:ServiceListProps) {
  
  function bullets() {
    return (
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
  </BulletList>)
  }

  function makeNextButton(nextCursor) {
    
    return (
      <Button variant="text" onClick={() => onNextButtonClick(nextCursor)} leftIcon="arrowRight">
         Next
      </Button>
      );
      /*return (
        <Button variant="text" href={makeQueryLink(params, nextCursor)} leftIcon="arrowRight">
        Next
        </Button>
        );*/
      }
      
      function makeQueryLink(query, nextCursor:number) {
        const params:Array<string> = [];
        console.log(query)
        params.push(`cursor=${nextCursor}`)
        if (query.limit !== undefined && !isNaN(Number(query.limit))) {
          params.push(`limit=${query.limit}`)
        }
    if (query.owner !== undefined && !isNaN(Number(query.owner))) {
      params.push(`owner=${query.owner}`)
    }
    if (query.name !== undefined && !isNaN(Number(query.name))) {
      console.log(query.name)
      params.push(`name=${query.name}`)
    }
    console.log(params);
    let link = 'services';
    params.forEach ( (e, index) =>{
      link+= index === 0? '?' : '&'
      link+=e
    });
    console.log(link)
    return link;
    
  }
  const [paramChange, setParamChange] = useState<number>(0);
  
  const onNextButtonClick = (nextC) => {
    props.parameters.cursor = nextC;
    setParamChange(paramChange+1);
  }
  
  const [services, setServices] = useState<Array<ServiceCardInformation>>(props.servicesList);
  const [nextCursor, setNextCursor] = useState<number>(props.nextCursor);
  //const [params, setState] = useState<GetServicesParameters>(props.parameters);
  /*useEffect(() => {
    const loadData = async () => {
      console.log('Mounting')
      const response = await getServices(params);
      setServices(response.result);
      setNextCursor(response.nextCursor);
      //setParameters({cursor:null, limit:null, owner:null, name:null})
    }
    
    loadData();
  }, []);*/

  useEffect(() => {
    const loadData = async () => {
      console.log('updating')
      const response = await getServices(props.parameters);
      setServices(response.result);
      setNextCursor(response.nextCursor);
    }
    
    loadData();
  }, [paramChange, props.parameters]);


  return (
   
      <Layout left={
        <Box className="service-list">
          {bullets()}
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={5}>
              <Stack space={3}>
                <div>
                  Vefþjónustur, nextCursor:{nextCursor}
                  {makeNextButton(nextCursor)}
                  
                </div>
              </Stack>
              <Stack space={3}>
                {
                  services?.map( (item, index) => {
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
ServiceList.getInitialProps = async ():Promise<ServiceListProps> => {
  const params = { cursor:0, limit:null, owner:null, name:null };
  const response = await getServices(params);
  const result = response.result;
  const nextCursor = response.nextCursor;

  return { parameters:params, nextCursor:nextCursor, servicesList: result };
}