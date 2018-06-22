import {client2} from "./ctClient";
import httpRequestService from "./commerceToolsRequestService";

export async function deleteById(id, version) {
        console.log("deleteting product with id", id);
        return client2.execute(httpRequestService.deleteById(id, version));
}
