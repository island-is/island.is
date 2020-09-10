import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'
import { ServiceCardInformation, ServiceStatusValue } from 'apps/api-catalog/components/ServiceCard/service-card';
import { getAllPriceCategories, GetServicesParameters, getAllDataCategories } from 'apps/api-catalog/components/ServiceRepository/service-repository';

describe(' ServiceList ', () => {
  const services:Array<ServiceCardInformation> = [
    { id:0, name:"service one Name",   owner:"Owner of service 1", pricing:["free", "custom"],            categories:["personal"],                   type:null,      access:["X-Road"], url:"", status:ServiceStatusValue.OK},
    { id:1, name:"service two Name",   owner:"Owner of service 2", pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], url:"", status:ServiceStatusValue.OK},
    { id:2, name:"service three Name", owner:"Owner of service 3", pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], url:"", status:ServiceStatusValue.OK},
    { id:3, name:"Þjóðskrá",           owner:"Fasteignaskrá",      pricing:null,                          categories:["personal"],                   type:["REST"],  access:["API GW"], url:"", status:ServiceStatusValue.OK},
  ];

  const params:GetServicesParameters = { cursor:null, limit:null, owner:null, name:null, pricing:getAllPriceCategories(), data:getAllDataCategories() };
  
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceList parameters={params} prevCursor={null} nextCursor={0} servicesList={services}/>);
    expect(baseElement).toBeTruthy();
  })
  it('Service names should all be visible', () => {
    const { getByText } = render(<ServiceList parameters={params}  prevCursor={null} nextCursor={0} servicesList={services}/>);
    expect(getByText(services[0].name)).toBeTruthy();
    expect(getByText(services[1].name)).toBeTruthy();
    expect(getByText(services[2].name)).toBeTruthy();
    expect(getByText(services[3].name)).toBeTruthy();
  })

  it('Service owners should all be visible', () => {
    const { getByText } = render(<ServiceList parameters={params}  prevCursor={null} nextCursor={0} servicesList={services}/>);
    expect(getByText(services[0].owner)).toBeTruthy();
    expect(getByText(services[1].owner)).toBeTruthy();
    expect(getByText(services[2].owner)).toBeTruthy();
    expect(getByText(services[3].owner)).toBeTruthy();
  })
})
