import {ServiceStatusValue } from  '..'

const services = {
  result:[
    { id:0, owner:"Þjóðskrá",         name:"Fasteignaskrá",       pricing:null,                          categories:null,                   type:["REST"],  access:["API GW"], status:ServiceStatusValue.OK},
    { id:1, owner:"Þjóðskrá",         name:"Einstaklingsskrá",    pricing:["free", "custom"],            categories:null,                   type:null,      access:["X-Road"], status:ServiceStatusValue.WARNING},
    { id:2, owner:"Þjóðskrá",         name:"Staðfangaskrá",       pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], status:ServiceStatusValue.ERROR},
    { id:3, owner:"Skatturinn",       name:"Virðisaukaskattur",   pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.WARNING},
    { id:4, owner:"Skatturinn",       name:"Staðgreiðsla",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.OK},
    { id:5, owner:"Vinnumálastofnun", name:"Fæðingarorlofssjóður",pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], status:ServiceStatusValue.ERROR},
    { id:6, owner:"Samgöngujstofa",   name:"Ökutækjaskrá",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.UNKNOWN},
  ]
};

  export function getAllServices() {

    return services;

  }

  export function getServicePage(cursor:number, limit:number) {

    return services;

  }