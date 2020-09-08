import React, { useState, useEffect } from 'react'
import { Layout, ServiceCard, ServiceStatusValue } from '../../components'
import {
  Box,
  Stack,
  Typography,
  BulletList,
  Bullet
} from '@island.is/island-ui/core'
import { getServices } from '../../components/ServiceRepository/service-repository'
import { useRouter } from 'next/dist/client/router'


const getQueryParams = function (query) {

  if (query === undefined || query === null) {
    return {cursor:null, limit:null, owner:null, name:null};  
  }
  return {
    cursor: query.cursor !== undefined && !isNaN(Number(query.cursor))? Number(query.cursor) : null, 
    limit : query.limit  !== undefined && !isNaN(Number(query.limit ))? Number(query.limit ) : null, 
    owner : query.owner  !== undefined && query.owner.length > 0 ? query.owner : null, 
    name  : query.name   !== undefined && query.name.length  > 0 ? query.name  : null
  };
}


export default function ServiceList({nextCursor,servicesList}) {
  
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


  const [services, setServices] = useState(servicesList);
  useEffect(() => {
    
    const query = router !== undefined? getQueryParams(router.query) : {cursor:null, limit:null, owner:null, name:null}; 
    async function loadData(nextCursor) {
      const response = await getServices(query.cursor, query.limit, query.owner, query.name);
      console.log('called if getInitialProps returns response.result === null ');
      setServices({servicesList:response.result});
    }

    if(servicesList === null || servicesList.length === 0) {
      loadData(nextCursor);
    }

  }, [nextCursor, router, servicesList]);

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
                  Vefþjónustur, nextCursor:{nextCursor}
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

ServiceList.getInitialProps = async (ctx) => {
 
  /*
  if(!ctx.req) {
    return { serviceList: [] } ;
}*/
  const { query } = ctx;
 
  const queryParams = getQueryParams(query);
  
  const response = await getServices(queryParams.cursor, queryParams.limit, queryParams.owner, queryParams.name);
  const result = response.result;
  const nextCursor = response.nextCursor;

  return { nextCursor:nextCursor, servicesList: result };
}

