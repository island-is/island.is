import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
import React from 'react';

export default function Index(){
    const handlePage1 = (clientId: string) => {
        console.log("ClientID from page");
        console.log(clientId);
    }

    return <Client client={ new ClientDTO()} handleSaved={handlePage1}/> 

}