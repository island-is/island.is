import React, { useState, useEffect } from 'react'
import {  Box,  
          Stack,  
          BulletList,  
          Bullet,  
          Button, 
          Checkbox, 
          GridContainer, 
          GridRow, 
          GridColumn, 
          SidebarAccordion 
} from '@island.is/island-ui/core'

import { Layout, 
         ServiceCard,
         ServiceCardInformation, 
         CategoryCheckBox
       } from '../../components'
       
import { getServices, 
         GetServicesParameters, 
         getAllPriceCategories, 
         getAllDataCategories 
       } from '../../components/ServiceRepository/service-repository'


export interface ServiceListProps {
  servicesList:Array<ServiceCardInformation>
  nextCursor: number,
  prevCursor: number,
  parameters: GetServicesParameters
}


export default function ServiceList(props:ServiceListProps) {
  
  if (!props.parameters === null) {
    props.parameters = { cursor:0, limit:null, owner:null, name:null, pricing:null, data:null };
  }
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
  
  const makeNavigation = () => {
    return (
      <div className="navigation">
        <Button disabled={prevCursor === null} variant="text" onClick={() => onPageButtonClick(prevCursor)} leftIcon="arrowLeft">
          Fyrri
        </Button>
        <Button disabled={nextCursor === null} variant="text" onClick={() => onPageButtonClick(nextCursor)} icon="arrowRight">
          Næsta
        </Button>     
      </div>
    )
  }
        
  const onPageButtonClick = (nextC) => {
    props.parameters.cursor = nextC;
    setParamCursor(props.parameters.cursor);
  }
  
  
  const [services, setServices] = useState<Array<ServiceCardInformation>>(props.servicesList);
  const [prevCursor, setPrevCursor] = useState<number>(props.prevCursor);
  const [nextCursor, setNextCursor] = useState<number>(props.nextCursor);
  const [paramCursor, setParamCursor] = useState<number>(null);
  const [checkPricingFree, setCheckPricingFree] = useState<boolean>(props.parameters.pricing.includes('free'));
  const [checkDataPersonal, setCheckDataPersonal] = useState<boolean>(props.parameters.data.includes('personal'));
  
  /*
  useEffect(() => {
      setCheckPricingFree(true);
      setCheckDataPersonal(true);
  }, []);*/
  
  useEffect(() => {
    const loadData = async () => {
      const response = await getServices(props.parameters);
      setServices(response.result);
      setPrevCursor(response.prevCursor);
      setNextCursor(response.nextCursor);
    }
      loadData();
  }, [checkDataPersonal,checkPricingFree, paramCursor, props.parameters]);

  const updateCategoryCheckBox = event => {
    console.log(event.target.value, event.target.checked);
    
    props.parameters.cursor = null;
    let filter:Array<string>;
    switch(event.target.value){
      case 'free'    : filter = props.parameters.pricing; break;
      case 'personal': filter = props.parameters.data; break;
      default:
        console.error('Invalid checkbox value')
        return;
    }

    if (filter === null) {
      filter = [];
    }
    if (event.target.checked) {
        if (!filter.includes(event.target.value)) {
          filter.push(event.target.value)
        }
    } else {
      filter.splice(filter.indexOf(event.target.value), 1);
    }

    
    switch(event.target.value){
      case 'free'    : setCheckPricingFree(event.target.checked); break;
      case 'personal': setCheckDataPersonal(event.target.checked); break;
    }

    setParamCursor(props.parameters.cursor);
    console.log(event.target.value, event.target.checked);
  }
  return (   
      <Layout left={
        <Box className="service-list">
          {bullets()}
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <GridContainer>
              <GridRow className="service-items">
                <GridColumn span={9}>
                  {makeNavigation()}
                  <Stack space={3}>
                    {
                      services?.map( (item, index) => {
                        return <ServiceCard key={index} service={item} />
                      })
                    }
                  </Stack>
                    {makeNavigation()}
                </GridColumn>
                <GridColumn span={3} className="filter">
                    <SidebarAccordion id="pricing" label="Verð">
                      <CategoryCheckBox label="Frítt" value="free" onChange={updateCategoryCheckBox} checkValue={checkPricingFree}/>
                    </SidebarAccordion>
                    <SidebarAccordion id="data" label="Gögn">
                      <CategoryCheckBox label="Persónuleg" value="personal" onChange={updateCategoryCheckBox} checkValue={checkDataPersonal}/>
                    </SidebarAccordion>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        </Box>
      } />
  )
}
ServiceList.getInitialProps = async ():Promise<ServiceListProps> => {
  const params:GetServicesParameters = { cursor:null, limit:null, owner:null, name:null, pricing:getAllPriceCategories(), data:getAllDataCategories() };
  const response = await getServices(params);
  const result = await response.result;

  return { parameters:params, prevCursor:response.prevCursor, nextCursor:response.nextCursor, servicesList: result };
}