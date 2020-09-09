import React, { useState, useEffect } from 'react'
import { Layout, ServiceCard } from '../../components'
import {
  Box,
  Stack,
  Typography,
  BulletList,
  Bullet,
  ContentBlock,
  RadioButton,
  Button
} from '@island.is/island-ui/core'
import { getServices, GetServicesParameters } from '../../components/ServiceRepository/service-repository'
import { useRouter } from 'next/dist/client/router'
import { ServiceCardInformation } from 'apps/api-catalog/components/ServiceCard/service-card'
import { ParsedUrlQuery } from 'querystring'

const isValidNumber = (value:unknown):boolean => {
  return value !== undefined && value !==null && !isNaN(Number(value));
}

const isValidString = (value:unknown):boolean => {
  return value !== undefined && value !==null && typeof value === "string" && String(value).length > 0;
}

const getQueryParams = (query):GetServicesParameters => {

  const params:GetServicesParameters = { cursor:null, limit:null, owner:null, name:null };

  if (query !== undefined && query !== null) {
    params.cursor = isValidNumber(query.cursor)? Number(query.cursor) : null;
    params.limit  = isValidNumber(query.limit) ? Number(query.limit ) : null;
    params.owner  = isValidString(query.owner) ? query.owner : null; 
    params.name   = isValidString(query.name) ? query.name  : null;
  }

  return params;
}

export interface ServiceListProps {
  nextCursor: number,
  servicesList:Array<ServiceCardInformation>
}


export default function ServiceList(props:ServiceListProps) {
  
  const router = useRouter();

  function bullets(){
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

  function makeNextButton(router, nextCursor) {
    const query = router !== null? router.query : { cursor:null, limit:null, owner:null, name:null };

    return (
      <Button variant="text" href={makeQueryLink(query, nextCursor)} leftIcon="arrowRight">
         Next
      </Button>
    );
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


  const [services, setServices] = useState<Array<ServiceCardInformation>>(props.servicesList);
  const [nextCursor, setNextCursor] = useState<number>(props.nextCursor);
  useEffect(() => {
    
    async function loadData() {
      const query = router !== null? getQueryParams(router.query) : {cursor:null, limit:null, owner:null, name:null}; 
      const response = await getServices(query);
      console.log('called if getInitialProps returns response.result === null ');
      setServices(response.result);
      setNextCursor(response.nextCursor);
      
    }

    if(props.servicesList === null || props.servicesList.length === 0) {
      loadData();
    }

  }, [props.nextCursor, props.servicesList]);

  if(!services || !services[0]) {
    return <div>Nothing found</div>
  }

  return (
   
      <Layout left={
        <Box className="service-list">
          {bullets()}
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={5}>
              <Stack space={3}>
                <Typography variant="intro">
                  Vefþjónustur, nextCursor:{nextCursor};
                  {makeNextButton(router, nextCursor)}
                  
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

ServiceList.getInitialProps = async (ctx):Promise<ServiceListProps> => {
 
  const { query } = ctx;
 
  const response = await getServices(getQueryParams(query));
  const result = response.result;
  const nextCursor = response.nextCursor;

  return { nextCursor:nextCursor, servicesList: result };
}

