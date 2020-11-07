const aws = require('aws-sdk');

aws.config.update({
    region: "ap-southeast-1",
    accessKeyId: "",
    secretAccessKey: ""
})

const tableName = "sanphams";

const docClient = new aws.DynamoDB.DocumentClient();

module.exports = {
    getAll() {
        return new Promise((resolve, reject) => {
            docClient.scan({
                TableName: tableName,

            }, (err, data) => {
                if (err)
                    reject(err);
                else {
                    const { Items } = data;
                    resolve(Items);
                }
            });
        })
    },
    put(item) {
        return new Promise((resolve, reject) => {
            docClient.put({
                TableName: tableName,
                Item: item
            }, (err, data) => {
                if (err)
                    reject(err);
                else {
                    resolve(true);
                }
            });
        })
    },
    getOneById(id) {
        return new Promise((resolve, reject) => {
            docClient.get({
                TableName: tableName,
                Key: {
                    "ma": id
                }
            }, (err, data) => {
                if (err)
                    reject(err);
                else {
                    const { Item } = data;
                    resolve(Item);
                }
            });
        })
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            docClient.delete({
                TableName: tableName,
                Key: {
                    "ma": id
                },
                ReturnValues: "ALL_OLD"
            }, (err, data) => {
                if (err)
                    reject(err);
                else {
                    resolve(data.Attributes);
                }
            });
        })
    },
    deleteMuti(lstID) {

        const array = []
        lstID.forEach(e => {
            array.push({
                DeleteRequest: {
                    Key: {
                        "ma": e.toString()
                    }
                }
            })
        })
        return new Promise((resolve, reject) => {
            docClient.batchWrite({
                RequestItems: {
                    "sanphams": array
                }
            }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
}