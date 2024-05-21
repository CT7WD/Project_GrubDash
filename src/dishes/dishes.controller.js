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



// ***CREATE***
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId, // Increment last id then assign as the current ID
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

// NAME VALIDATION
function nameIsValid(req, res, next) {
    const { data: { name } = {} } = req.body;
    if ( name !== "" ) {
        return next();
    }
    next({
        status: 400,
        message: `Must include a ${name}.`
    })

}

// DESCRIPTION VALIDATION
function descriptionIsValid(req, res, next) {
    const { data: }
}

// PRICE VALIDATION

// IMAGE URL VALIDATION








// ***EXPORTS***
module.exports = {
    list,
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        nameIsValid,
        descriptionIsValid,
        priceIsValid,
        imageUrlIsValid,
        create
    ],
}