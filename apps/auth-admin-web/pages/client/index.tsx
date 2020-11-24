import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
import React, { useCallback } from 'react';

export default function Index(){
    const handlePage1 = (sdf) => console.log("kkd");

    return <Client client={ new ClientDTO() } handleSaved={handlePage1}/> 

}