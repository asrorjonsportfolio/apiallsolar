const axios = require('axios');
module.exports = {
    callMongo: async function (config) {
        return axios(config);
    },
    insertOne: function (cluster, database, collection, document) {
        return JSON.stringify({
            "dataSource": cluster,
            "database": database,
            "collection": collection,
            "document": document
        });
    },
    findOne: function (cluster, database, collection, filter, sort) {
        return JSON.stringify({
            "dataSource": cluster,
            "database": database,
            "collection": collection,
            "filter": filter,
            "sort": sort
        });
    },
    updateOne: function (cluster, database, collection, filter, update) {
        return JSON.stringify({
            "dataSource": cluster,
            "database": database,
            "collection": collection,
            "filter": filter,
            "update": update
        });
    },
    config: function (method, command, data) {
        return {
            method: `${method}`,
            url: `https://eu-west-2.aws.data.mongodb-api.com/app/data-tnwvh/endpoint/data/v1/action/${command}`,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': 'UhSHOWfFUbQR4RCcFbNB4aINPTSAmF6enl6stwAYckSDh9EvxJMYoOOnXGkGb4Ig',
            },
            data: data,
        };
    }
}