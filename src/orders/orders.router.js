const router = require("express").Router({ mergeParams: true });
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const dishesRouter = require("../dishes/dishes.router");
// TODO: Implement the /orders routes needed to make the tests pass



// router.use("/:orderId/pastes", controller.orderExists, dishesRouter);

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

router
    .route("/:orderId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.destroy)
    .all(methodNotAllowed);

















module.exports = router;
