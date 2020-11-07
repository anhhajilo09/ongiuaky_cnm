var AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId: "AKIAU6Q2TCITTIX7LGS2",
    secretAccessKey: "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"
})

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

var allSanphams = require('./data.json')
allSanphams.forEach(function(sp) {
    var params = {
        TableName: "sanphams",
        Item: {
            "ma": sp.ma,
            "ten": sp.ten,
            "soluong": sp.soluong
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add sanpham", sp.ten, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", sp.ten);
        }
    });
});