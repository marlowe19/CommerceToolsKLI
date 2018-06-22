import {client2} from "../commercetools/ctClient";
import requestService from '../commercetools/commerceToolsRequestService'

import * as colors from "colors";

export async function publishById(id, version){

    try{
        const request = await client2.execute(requestService.unpublishById(id, version))
        console.log("description: %s", colors.blue(`publishing by id: ${id}`));
        return request;
    } catch (error){
        console.log("description: %s", colors.red(`attempt to publish by id: ${id} failed`));

    }

}