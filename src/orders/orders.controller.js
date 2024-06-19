const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// FIND IF REQUIRED ORDER PROPERTY EXISTS IN REQUEST BODY 
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next()
        }
        next({
            status: 400,
            message: `Order must include a ${propertyName}`
        })
    }
}


// FIND IF ORDER EXISTS
function orderExists(req, res, next) {
    const { id } = req.params;
    const foundOrder = orders.find(order => order.id === Number(id));
    if (foundOrder) {
      res.locals.order = foundOrder;
      return next();
    }
    next({
      status: 404,
      message: `Order id not found: ${id}`,
    });
  };


// *****CRUDL FLOW*****

// ***CREATE***
// *ASSIGN NEW ID TO ORDER USING nextId()*
// How do I account for quantity?
function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

// ***READ***
function read(req, res) {
    res.json({ data: res.locals.order })
  }


// ***UPDATE***
function update(req, res) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
    // update the order
    order.deliverTo = deliverTo;
    order.mobilmobileNumber =mobileNumber;
    order.status = status;
    order.dishes = dishes;
  
    res.json({ data: order });
  }


// ***DELETE*** 
// based on order id

function destroy(req,res){
    const { id } = req.params;
    const index = orders.findIndex((order) => order.id === Number(id));
    
    //now that we have found the index of the specific Id, splice it from the uses data
    
    const deletedOrder = order.splice(index, 1);
    res.sendStatus(204);
  }

// ***LIST***
function list(req, res) {
    res.json({ data: orders });
}













//  ***EXPORTS***
module.exports = {
    list,
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        create
    ],
    read: [
        orderExists, 
        read
    ],
    destroy: [
        orderExists,
        destroy
    ]
};