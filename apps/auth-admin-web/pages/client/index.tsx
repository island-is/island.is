import ClientDTO from '../../models/dtos/client-dto'
import Client from './../../components/Client'
export default function Index(){
    return <Client client={ new ClientDTO()}/> 

}