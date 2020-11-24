import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
import React, { useCallback } from 'react';
import ClientClaim from './../../components/ClientClaim';
import { ClientClaimDTO } from 'apps/auth-admin-web/models/dtos/client-claim.dto';

export default function Index(){
    const handlePage1 = () => console.log("kkd");

    return <ClientClaim claim={new ClientClaimDTO()} handleSaved={handlePage1} />

    // return <Client client={ new ClientDTO() } handleSaved={handlePage1}/> 

}