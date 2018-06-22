import {unpublishById} from "./lib/unpublishProducts"


    it('should return status code 200', async function () {
            let data = await unpublishById("c6acb44c-b608-4ed2-bbdd-0a77a8b4598c",5)

        console.log("data",data)
        expect(data.statusCode).toBe(200)
        //return expect().toBeUndefined()

    });

