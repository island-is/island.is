import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'

describe(' ServiceList ', () => {
  const services = [
    { name:"Þjóðskrá",     owner:"Fasteignaskrá",     pricing:null,                          categories:null,                   type:["REST"],  access:["API GW"]},
    { name:"serviceName1", owner:"serviceOwnerName1", pricing:["free", "custom"],            categories:null,                   type:null,      access:["X-Road"]},
    { name:"serviceName2", owner:"serviceOwnerName2", pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"]},
    { name:"serviceName3", owner:"serviceOwnerName3", pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"]}
  ];
  
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceList services={services}/>);
    expect(baseElement).toBeTruthy();
  })
  it('Service names should all be visible', () => {
    const { getByText } = render(<ServiceList services={services}/>);
    expect(getByText(services[0].name)).toBeTruthy();
    expect(getByText(services[1].name)).toBeTruthy();
    expect(getByText(services[2].name)).toBeTruthy();
    expect(getByText(services[3].name)).toBeTruthy();
  })

  it('Service owners should all be visible', () => {
    const { getByText } = render(<ServiceList services={services}/>);
    expect(getByText(services[0].owner)).toBeTruthy();
    expect(getByText(services[1].owner)).toBeTruthy();
    expect(getByText(services[2].owner)).toBeTruthy();
    expect(getByText(services[3].owner)).toBeTruthy();
  })
})
