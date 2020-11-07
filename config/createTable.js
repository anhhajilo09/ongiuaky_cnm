var AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId: "AKIAU6Q2TCITTIX7LGS2",
    secretAccessKey: "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"
})


var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: "sanphams",
    KeySchema: [
        { AttributeName: "ma", KeyType: "HASH" } //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "ma", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});