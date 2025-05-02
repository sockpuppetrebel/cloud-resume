const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const client = new CosmosClient({ endpoint, key });

const database = client.database("counter-db");
const container = database.container("views");

module.exports = async function (context, req) {
    const { resource: item } = await container.item("resume", "resume").read();
    item.count += 1;
    await container.item("resume", "resume").replace(item);

    context.res = {
        body: { count: item.count },
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    };
};