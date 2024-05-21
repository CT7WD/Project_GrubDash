const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


// ***LIST DISHES***
function list(req, res) {
    const { id } = req.params;
    res.json({ data: dishes.filter(id ? url => url.id === id : () => true) });
}


// *****CRUD FLOW*****
// ****DISHES CANNOT BE DELETED****

//FIND IF PROPERTY EXISTS IN REQUEST BODY
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next()
        }
        next({
            status: 400,
            message: `Must include a ${propertyName}`
        })
    }
}














// ***EXPORTS***
module.exports = {
    list
}