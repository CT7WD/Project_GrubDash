const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass





// *****CRUDL FLOW*****
// ****DISHES CANNOT BE DELETED****

// ****FUNCTIONS****

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

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === dishId);
    if (foundDish) {
      res.locals.dish = foundDish;
      return next();
    }
    next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
  };


// VALIDATE DISH ID MATCH
function dishIdMatches(req, res, next) {
    const { dishId } = req.params;
    const { data: { id } = {} } = req.body;

    if (id && id !== dishId) {
        return next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        });
    }

    next();
}

// ****HANDLERS****
// ***LIST DISHES***
function list(req, res) {
    res.json({ data: dishes });
}

// ***CREATE***
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(), 
        name,
        description,
        price,
        image_url,
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
        message: `Dish must include a name.`
    })

}

// DESCRIPTION VALIDATION
function descriptionIsValid(req, res, next) {
    const { data: { description } = {} } = req.body;
    if ( description !== "") {
        return next();
    }
    next({
        status: 400,
        message: `Dish must include a description.`
    })
}

// PRICE VALIDATION
/*price property is missing	Dish must include a price
price property 0 or less	Dish must have a price that is an integer greater than 0
price property is not an integer	Dish must have a price that is an integer greater than 0*/

function priceIsValid(req, res, next) {
    const { data: { price } = {} } = req.body;
    if ( price !== undefined && price !== "" && typeof price === 'number' && price > 0) {
        return next();
    }
    next({
        status: 400,
        message: `Dish have a price that is an integer greater than 0.`
    })
}

// IMAGE URL VALIDATION
function    imageUrlIsValid(req, res, next) {
    const { data: { image_url } = {} } = req.body;
    if ( image_url !== "") {
        return next();
    }
    next({
        status: 400,
        message: `Dish must include a image_url.`
    })
}

// ***READ***
function read(req, res) {
    res.json({ data: res.locals.dish })
  }

// ***UPDATE***
  function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    // update the dish
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
  
    res.json({ data: dish });
  }




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
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        dishIdMatches,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        nameIsValid,
        descriptionIsValid,
        priceIsValid,
        imageUrlIsValid,
        update
    ]
}