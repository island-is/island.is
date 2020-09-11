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

  const updatePricingFree = event => {
    console.log(event.target.value, event.target.checked);
    
    props.parameters.cursor = null;
    
    if (props.parameters.pricing === null) {
      props.parameters.pricing = [];
    }
    if (event.target.checked) {
        if (!props.parameters.pricing.includes('free')){
          props.parameters.pricing.push('free')
        }
    } else {
      props.parameters.pricing.splice(props.parameters.pricing.indexOf('free'), 1);
    }

    setCheckPricingFree(event.target.checked);
    setParamCursor(props.parameters.cursor);
    console.log(event.target.value);
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
                      <Stack space="gutter">
                        <CategoryCheckBox label="Frítt" value="free" onChange={updatePricingFree} checkValue={checkPricingFree}/>
                      </Stack>
                    </SidebarAccordion>
                    <SidebarAccordion id="data" label="Gögn" >
                      <Stack space={[1, 1, 1]}>
                        <Checkbox name="checkboxPersonal" label="Personal"
                          onChange={({ target }) => {
                            props.parameters.cursor = null;
                            if (props.parameters.data === null) {
                              props.parameters.data = [];
                            }
                            if (target.checked) {
                              if (!props.parameters.data.includes('personal')){
                                props.parameters.data.push('personal')
                              }
                            } else {
                              props.parameters.data.splice(props.parameters.data.indexOf('personal'), 1);
                            }
                            setParamCursor(props.parameters.cursor);
                            setCheckDataPersonal(target.checked)
                          }}
                          checked={checkDataPersonal}
                          />
                      </Stack>
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