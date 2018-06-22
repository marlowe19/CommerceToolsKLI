import {client2} from "../commercetools/ctClient";
import requestService from "../commercetools/commerceToolsRequestService"

import * as colors from "colors";

export async function unpublishById(id, version){

    try{
        const request = await client2.execute(requestService.unpublishById(id, version))
        console.log(colors.blue(`unpublishing by id: ${id}`));
        return request
    } catch(error) {
        console.log(colors.red(`attempt to unpublish by id: ${id} failed`));

    }
}