import {ServiceStatusValue } from  '..'
const MAX_LIMIT = 5;
const OrgServices =[
    { id:0, owner:"Þjóðskrá",         name:"0 Fasteignaskrá",       pricing:null,                          categories:null,                   type:["REST"],  access:["API GW"], status:ServiceStatusValue.OK},
    { id:1, owner:"Þjóðskrá",         name:"01 Einstaklingsskrá",    pricing:["free", "custom"],            categories:null,                   type:null,      access:["X-Road"], status:ServiceStatusValue.WARNING},
    { id:2, owner:"Þjóðskrá",         name:"02 Staðfangaskrá",       pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], status:ServiceStatusValue.ERROR},
    { id:3, owner:"Skatturinn",       name:"03 Virðisaukaskattur",   pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.WARNING},
    { id:4, owner:"Skatturinn",       name:"4 Staðgreiðsla",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.OK},
    { id:5, owner:"Vinnumálastofnun", name:"5 Fæðingarorlofssjóður",pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], status:ServiceStatusValue.ERROR},
    { id:6, owner:"Samgöngujstofa",   name:"06 Ökutækjaskrá",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], status:ServiceStatusValue.UNKNOWN},
  ];


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getServices(cursor:number, limit:number, ownerFilter:string, nameFilter:string) {
  
  let filtered = OrgServices;
  if (nameFilter !==undefined && nameFilter !== null) {
    filtered = filtered.filter(e => e.name.includes(nameFilter));
  }
  if (ownerFilter !==undefined && ownerFilter !== null) {
    filtered = filtered.filter(e => e.owner.includes(ownerFilter));
  }

  return await limitServices(filtered, cursor, limit);
}

async function limitServices(services, cursor:number, limit:number) {
  await timeout(2000);

  const len = services.length;
  const searchCursor = cursor === null? 0 : cursor;
  let lastIndex = (limit === null || limit > MAX_LIMIT) ? MAX_LIMIT : limit;
  if (len < 1) {
    return { result: null, nextCursor:null }
  }

  
  const startIndex = ( cursor === null || cursor < 0 )? 0 : services.map(function(x) {return x.id; }).indexOf(searchCursor);
  if (startIndex < 0) {
    return { result: null, nextCursor:null };
  }

  lastIndex+=startIndex;
  
  let nextCursor = null;

  if (lastIndex >= len) {
    lastIndex = len;
  } else {
    nextCursor = services[lastIndex].id;
  }

  const ret ={
    result: services.slice(startIndex, lastIndex),
    nextCursor:nextCursor
  }

  return ret;
}
