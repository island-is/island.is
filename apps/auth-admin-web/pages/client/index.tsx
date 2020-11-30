import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
import React, { useState } from 'react';
import ClientClaim from './../../components/ClientClaim';
import { ClientClaimDTO } from './../../models/dtos/client-claim.dto';
import ClientRedirectUri from './../../components/ClientRedirectUri';
import { ClientRedirectUriDTO } from './../../models/dtos/client-redirect-uri.dto';
import ClientIdpRestrictions from './../../components/ClientIdpRestrictions';

export default function Index(){
    
    const [step, setStep] = useState(1);
    const [clientId, SetClientId] = useState(null);
    // let clientObj: ClientDTO = new ClientDTO();

    const handleNext = () => {
        setStep(step+1);
    }

    const handleBack = () => {
        setStep(step-1);
    }

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
        setStep(step+1);
    }

    const handleClaimSaved = (claim: ClientClaimDTO) => {
        console.log(claim.clientId);
    }

    console.log(step);

    switch (step){
        case 1:
            // Set up the client properties
            return <Client client={ new ClientDTO() } onNextButtonClick={handleClientSaved}/> 
        case 2: {
            // Set the callback URI .. ALLT
            const rObj = new ClientRedirectUriDTO();
            rObj.clientId = clientId;
            return <ClientRedirectUri redirectObject={rObj} uris={null} handleNext={handleNext} handleBack={handleBack} />
            }
        case 3: {
            return <ClientIdpRestrictions clientId={clientId} restrictions={[]} handlePageChange={handleNext} />
        }
        case 4: {
            // Allowed Scopes
            // Ákveðin scope sem við eigum og veljum úr lista - Skilgreinum scopes fyrir resource-a
            // Sett á bið?
        }
        case 5: {
            // Allowed Cors Origin
            // Default Display URL ?
        }
        case 6: {
            // Grant Types
            // Authorization code ALLT NEMA SERVICE TO SERVICE - [Client credentials - SERVICE to SERVICE]
        }
        case 7: {
            // ClientPostLogoutRedirectUri
            // Loggaður út -> viltu fara aftur á þína síðu
        }
        case 8: {
           // Add Claims - Custom Claims (Vitum ekki alveg) - Setja í BID
           const claim = new ClientClaimDTO();
           console.log("Client ID: " + clientId);
           claim.clientId = clientId;
           return <ClientClaim claim={claim} handleSaved={handleClaimSaved} />
        }
        case 9: {
            //ClientSecret
            // EF SPA eða NATIVE þá sýna ekkert
            // Generate og sýna
        }
    }
}