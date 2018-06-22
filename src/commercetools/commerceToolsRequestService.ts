import {RequestFactory} from "./productsServices";
import store from '../lib/store'

const httpRequestService = new RequestFactory(store.all)

export default httpRequestService