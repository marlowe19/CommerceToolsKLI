
import * as configStore from "configstore"
const pkg = require('../../package.json');

const store = new configStore(pkg.name)


export default store