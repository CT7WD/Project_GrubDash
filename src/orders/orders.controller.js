const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass




// *****CRUDL FLOW*****




// ***LIST***
function list(req, res) {
    res.json({ data: orders });
}













//  ***EXPORTS***
module.exports = {
    list,
    // read: [userExists, read],
    // userExists,
};