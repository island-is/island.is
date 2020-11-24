import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
import React, { useState } from 'react';
import ClientClaim from './../../components/ClientClaim';
import { ClientClaimDTO } from './../../models/dtos/client-claim.dto';
import ClientRedirectUri from './../../components/ClientRedirectUri';
import { ClientRedirectUriDTO } from './../../models/dtos/client-redirect-uri.dto';

export default function Index(){
    
    const [step, setStep] = useState(1);
    const [clientId, SetClientId] = useState(null);
    // let clientObj: ClientDTO = new ClientDTO();

    const handleClientSaved = (client: ClientDTO) => {
        if (client.clientId){
            SetClientId(client.clientId);
            if (client.clientType === 'spa'){
                setStep(2);
            }
            else{
                setStep(3);
            }
        }
    }

    const handleRedirectSaved = (redirectObj: ClientRedirectUriDTO) => {
        if (redirectObj.clientId)
        {
            console.log(redirectObj);    
        }
    }

    const handleClaimSaved = (claim: ClientClaimDTO) => {
        console.log(claim.clientId);
    }

    switch (step){
        case 1:
            // Set up the client properties
            return <Client client={ new ClientDTO() } onNextButtonClick={handleClientSaved}/> 
        case 2: {
            // Set the callback URI
            const rObj = new ClientRedirectUriDTO();
            rObj.clientId = clientId;
            return <ClientRedirectUri redirectObject={rObj} handleSaved={handleRedirectSaved} />
            }
        case 3: {
            // Add Claims?
            const claim = new ClientClaimDTO();
            console.log("Client ID: " + clientId);
            claim.clientId = clientId;
            return <ClientClaim claim={claim} handleSaved={handleClaimSaved} />
        }
        case 4: {
            // Allowed Scopes
        }
        case 5: {
            // Allowed Cors Origin
        }
        case 6: {
            // Grant Types
        }
        case 7: {
            // Grant Types
        }
        case 8: {
            // ClientPostLogoutRedirectUri
        }
        case 9: {
            // ClientPostLogoutRedirectUri
        }
        case 10: {
            // ClientIdpRestrictions
        }
        case 11: {
            // ClientSecret
        }
    }
}