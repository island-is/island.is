import IdentityResourcesDTO from '../../models/dtos/identity-resources.dto';
import React from 'react';
import IdentityResourceForm from '../../components/IdentityResourceForm';

export default function Index(){
    return <IdentityResourceForm resource={new IdentityResourcesDTO()} />
}