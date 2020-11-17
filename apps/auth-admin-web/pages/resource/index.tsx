import IdentityResourcesDTO from './../../models/dtos/identity-resources-dto';
import React from 'react';
import IdentityResource from './../../components/IdentityResource';

export default function Index(){
    return <IdentityResource resource={new IdentityResourcesDTO()} />
}