import {client2} from "../commercetools/ctClient";
import * as colors from "colors";
import {requestService} from "../commercetools/product";
import store from './store'

const httpRequestService = new requestService(store.all)

export async function unpublishById(id, version){

    try{
        let request = await client2.execute(httpRequestService.unpublishById(id,version))
        console.log('description: %s', colors.bold(`unpublishing by id: ${id}`));
        return request
    }catch(error){
        let request = await client2.execute(httpRequestService.unpublishById(id,version))
        console.log('description: %s', colors.bold(`unpublishing by id: ${id}`));
        console.log("the type",typeof(error));
        return "hallo"
    }




}