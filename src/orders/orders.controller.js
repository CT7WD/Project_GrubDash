const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign IDs when necessary
const nextId = require("../utils/nextId");

// FIND IF REQUIRED ORDER PROPERTY EXISTS IN REQUEST BODY 
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName] !== undefined && data[propertyName] !== null && data[propertyName] !== "") {
            return next();
        }
        next({
            status: 400,
            message: `Order must include a ${propertyName}`,
        });
    };
}

// FIND IF ORDER EXISTS
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find(order => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id not found: ${orderId}`,
    });
}

// VALIDATE DISHES
function dishesIsValid(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (!Array.isArray(dishes) || dishes.length === 0) {
        return next({
            status: 400,
            message: `Order must include at least one dish.`,
        });
    }

    dishes.forEach((dish, index) => {
        if (!dish.quantity || typeof dish.quantity !== "number" || dish.quantity <= 0) {
            return next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0.`,
            });
        }
    });

    next();
}

// VALIDATE STATUS
function statusIsValid(req, res, next) {
    const { data: { status } = {} } = req.body;
    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];

    if (!status || !validStatuses.includes(status)) {
        return next({
            status: 400,
            message: `Order must have a status of pending, preparing, out-for-delivery, or delivered`,
        });
    }

    next();
}

// VALIDATE ORDER ID MATCH
function orderIdMatches(req, res, next) {
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body;

    if (id && id !== orderId) {
        return next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
        });
    }

    next();
}

// *****CRUDL FLOW*****

// ***CREATE***
// *ASSIGN NEW ID TO ORDER USING nextId()*
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
    res.json({ data: res.locals.order });
}

// ***UPDATE***
function update(req, res) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    // update the order
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;

    res.json({ data: order });
}

// ***DELETE*** 
// based on order id
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);

    if (index !== -1) {
        const order = orders[index];
        if (order.status !== "pending") {
            return res.status(400).json({ error: "An order cannot be deleted unless it is pending." });
        }
        orders.splice(index, 1);
    }

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
        bodyDataHas("dishes"),
        dishesIsValid,
        create
    ],
    read: [
        orderExists,
        read
    ],
    update: [
        orderExists,
        orderIdMatches,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        dishesIsValid,
        statusIsValid,
        update
    ],
    destroy: [
        orderExists,
        destroy
    ]
};
