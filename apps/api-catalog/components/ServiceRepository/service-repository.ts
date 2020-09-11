import {ServiceStatusValue } from  '..'
import { ServiceCardInformation } from '../ServiceCard/service-card';

const MAX_LIMIT = 4;
const OrgServices:Array<ServiceCardInformation> =[
    { id:0, owner:"Þjóðskrá",        name:"Fasteignaskrá",       pricing:["free"],                      categories:["open"],                 type:["REST"], access:["API GW"], url:"http://fasteignaskra.thodskra.is:4700",    status:ServiceStatusValue.OK},
    { id:1, owner:"Þjóðskrá",        name:"Einstaklingsskrá",    pricing:["free", "custom"],            categories:["personal"],             type:["REACT"],access:["X-Road"], url:"http://einstaklingskra.thodskra.is:4700",  status:ServiceStatusValue.WARNING},
    { id:2, owner:"Þjóðskrá",        name:"Staðfangaskrá",       pricing:["usage"],                     categories:["personal", "public"],   type:["REACT"],access:["API GW"], url:"http://stadfangaskra.thodskra.is:4700",    status:ServiceStatusValue.ERROR},
    { id:3, owner:"Skatturinn",      name:"Virðisaukaskattur",   pricing:["daily","monthly", "yearly"], categories:["personal", "public"],   type:["SOAP"], access:["API GW"], url:"http://vsk.skattur.is/:2100",              status:ServiceStatusValue.WARNING},
    { id:4, owner:"Skatturinn",      name:"Staðgreiðsla",        pricing:["daily","monthly", "yearly"], categories:["personal", "financial"],type:["SOAP"], access:["API GW"], url:"http://stadgreidsla.skattur.is:2100",      status:ServiceStatusValue.OK},
    { id:5, owner:"Vinnumálastofnun",name:"Fæðingarorlofssjóður",pricing:["yearly"],                    categories:["personal", "public"],   type:["REACT"],access:["API GW"], url:"http://faedingarorlofssjodur.vms.is:74200",status:ServiceStatusValue.ERROR},
    { id:6, owner:"Samgöngustofa",   name:"Ökutækjaskrá",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"],   type:["SOAP"], access:["API GW"], url:"http://okutaeki.samgongustofa.is:74200",  status:ServiceStatusValue.UNKNOWN}
];

export interface ServicesResult {
    result:Array<ServiceCardInformation>,
    prevCursor:number;
    nextCursor:number;
}

export interface GetServicesParameters {
    cursor:number, 
    limit:number, 
    owner:string, 
    name:string,
    pricing:Array<string>,
    data:Array<string>
}

const isValidNumber = (value:unknown):boolean => {
    return value !==null && !isNaN(Number(value));
}

const isValidString = (value:unknown):boolean => {
    return value !==null && typeof value === "string" && String(value).length > 0;
}

export async function getServices(parameters:GetServicesParameters):Promise<ServicesResult> {
    const params:GetServicesParameters = parameters !== null? parameters : {cursor:null, limit:null, owner:null, name:null, pricing:null, data:null};
    let filtered = OrgServices;
    if (isValidString(params.name)) {
        filtered = filtered.filter(e => e.name.includes(params.name));
    }
    if (isValidString(params.owner)) {
        filtered = filtered.filter(e => e.owner.includes(params.owner));
    }
    if ( params.pricing !== null && params.pricing.length > 0) {
        const missingValues = getAllPriceCategories().filter(e => !params.pricing.includes(e));
            filtered = filtered.filter(function (e) { 
                return e.pricing !== null && !e.pricing.some(r=> missingValues.indexOf(r) >=0)
            }
        );
    }

    if ( params.data !== null && params.data.length > 0) {
        const missingValues = getAllDataCategories().filter(e => !params.data.includes(e));
            filtered = filtered.filter(function (e) { 
                return e.categories !== null && !e.categories.some(r=> missingValues.indexOf(r) >=0)
            }
        );
    }


    if (!isValidNumber(params.cursor)) {
        params.cursor = null;
    }
    if (!isValidNumber(params.limit)) {
        params.limit = null;
    }
    return await limitServices(filtered, params.cursor, params.limit);
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function limitServices(services, cursor:number, limit:number): Promise<ServicesResult> {
    await timeout(1000);
    const errorResult:ServicesResult = { result: null, prevCursor:null, nextCursor:null };
    const len = services.length;
    const searchCursor = cursor === null? 0 : cursor;
    const safeLimit = (limit === null || limit < 0 || limit > MAX_LIMIT)? MAX_LIMIT : limit;

    if (len < 1) {
        return errorResult;
    }

    const startIndex = ( cursor === null || cursor < 0 )? 0 : services.map(function(x) {return x.id; }).indexOf(searchCursor);

    if (startIndex < 0) {
        return errorResult;
    }



    let lastIndex = safeLimit + startIndex;

    let nextCursor = null;

    if (lastIndex >= len) {
        lastIndex = len;
    } else {
        nextCursor = services[lastIndex].id;
    }

    let prevCursor = null;

    if (startIndex > 0) {
        const prevIndex = startIndex-safeLimit < 0? 0 : startIndex-safeLimit;
        prevCursor = services[prevIndex].id;
    }



    const ret:ServicesResult = {
        result: services.slice(startIndex, lastIndex),
        nextCursor:nextCursor,
        prevCursor:prevCursor
    }

    return ret;
}

export const getAllPriceCategories = ():Array<string>  => {
    return ['free', 'usage', 'daily','monthly', 'yearly', 'custom'];
}

export const getAllDataCategories = ():Array<string> => {
    return ['open', 'official', 'personal','health', 'financial'];
}

export const  getAllTypeCategories = ():Array<string> => {
    return ['REACT', 'SOAP', 'GraphQl'];
}

export const  getAllAccessCategories = ():Array<string> => {
    return ['X-Road', 'API GW'];
}
