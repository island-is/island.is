import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
import React, { useState } from 'react';
import ClientClaim from './../../components/ClientClaim';
import { ClientClaimDTO } from './../../models/dtos/client-claim.dto';
import ClientRedirectUri from './../../components/ClientRedirectUri';
import { ClientRedirectUriDTO } from './../../models/dtos/client-redirect-uri.dto';
import ClientIdpRestrictions from './../../components/ClientIdpRestrictions';
import ClientPostLogoutRedirectUri from './../../components/ClientPostLogoutRedirectUri';
import { useRouter } from 'next/router'

export default function Index(){
    
    const [step, setStep] = useState(1);
    const [client, setClient] = useState<ClientDTO>(null);
    const router = useRouter();

    // let clientObj: ClientDTO = new ClientDTO();

    const handleNext = () => {
        console.log(step);
        console.log("handle next called");
        setStep(step+1);
        console.log(step);
    }

    const handleBack = () => {
        setStep(step-1);
    }

    const handleCancel = () => {
        router.back();
    }

    const handleClientSaved = (clientSaved: ClientDTO) => {
        console.log("Client SAVED");
        console.log(clientSaved);
        if (clientSaved.clientId){
            setClient(clientSaved);
            if (clientSaved.clientType === 'spa'){
                setStep(2);
                console.log("Setting step 2");
            }
            else{
                console.log("Setting step 3");
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
            return <Client handleCancel={handleCancel} client={ new ClientDTO() } onNextButtonClick={handleClientSaved}/> 
        case 2: {
            // Set the callback URI .. ALLT
            const rObj = new ClientRedirectUriDTO();
            rObj.clientId = client.clientId;
            return <ClientRedirectUri redirectObject={rObj} uris={null} handleNext={handleNext} handleBack={handleBack} />
            }
        case 3: {
            return <ClientIdpRestrictions clientId={client.clientId} restrictions={[]} handleNext={handleNext} handleBack={handleBack} />
        }
        case 4: {
            return <ClientPostLogoutRedirectUri clientId={client.clientId} defaultUrl={""} uris={null} handleNext={handleNext} handleBack={handleBack} />
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
            // Allowed Scopes
            // Ákveðin scope sem við eigum og veljum úr lista - Skilgreinum scopes fyrir resource-a
            // Sett á bið?
        }
        case 8: {
           // Add Claims - Custom Claims (Vitum ekki alveg) - Setja í BID
           const claim = new ClientClaimDTO();
           console.log("Client ID: " + client);
           claim.clientId = client;
           return <ClientClaim claim={claim} handleSaved={handleClaimSaved} />
        }
        case 9: {
            //ClientSecret
            // EF SPA eða NATIVE þá sýna ekkert
            // Generate og sýna
        }
    }
}