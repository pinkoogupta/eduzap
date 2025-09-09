src/
├── businesses/
│   ├── apparels/
│   │   ├── controllers/
│   │   │   ├── apparelsProduct.controller.js
│   │   │   ├── apparelsCart.controller.js
│   │   │   └── apparelsOrder.controller.js
│   │   ├── routes/
│   │   │   ├── apparelsProduct.route.js
│   │   │   ├── apparelsCart.route.js
│   │   │   └── apparelsOrder.route.js
│   │   ├── services/
│   │   │   ├── apparelsProduct.service.js
│   │   │   ├── apparelsCart.service.js
│   │   │   └── apparelsOrder.service.js
│   │   ├── middlewares/
│   │   │   └── apparelsAuth.middleware.js
│   │   └── apparels.js
│   ├── electronics/
│   │   ├── controllers/
│   │   │   ├── electronicsProduct.controller.js
│   │   │   ├── electronicsCart.controller.js
│   │   │   └── electronicsOrder.controller.js
│   │   ├── routes/
│   │   │   ├── electronicsProduct.route.js
│   │   │   ├── electronicsCart.route.js
│   │   │   └── electronicsOrder.route.js
│   │   ├── services/
│   │   │   ├── electronicsProduct.service.js
│   │   │   ├── electronicsCart.service.js
│   │   │   └── electronicsOrder.service.js
│   │   ├── middlewares/
│   │   │   └── electronicsAuth.middleware.js
│   │   └── electronics.js
│   ├── groceries/
│   │   ├── controllers/
│   │   │   ├── groceriesProduct.controller.js
│   │   │   ├── groceriesCart.controller.js
│   │   │   └── groceriesOrder.controller.js
│   │   ├── routes/
│   │   │   ├── groceriesProduct.route.js
│   │   │   ├── groceriesCart.route.js
│   │   │   └── groceriesOrder.route.js
│   │   ├── services/
│   │   │   ├── groceriesProduct.service.js
│   │   │   ├── groceriesCart.service.js
│   │   │   └── groceriesOrder.service.js
│   │   ├── middlewares/
│   │   │   └── groceriesAuth.middleware.js
│   │   └── groceries.js
│   ├── cosmetics/
│   │   ├── controllers/
│   │   │   ├── cosmeticsProduct.controller.js
│   │   │   ├── cosmeticsCart.controller.js
│   │   │   └── cosmeticsOrder.controller.js
│   │   ├── routes/
│   │   │   ├── cosmeticsProduct.route.js
│   │   │   ├── cosmeticsCart.route.js
│   │   │   └── cosmeticsOrder.route.js
│   │   ├── services/
│   │   │   ├── cosmeticsProduct.service.js
│   │   │   ├── cosmeticsCart.service.js
│   │   │   └── cosmeticsOrder.service.js
│   │   ├── middlewares/
│   │   │   └── cosmeticsAuth.middleware.js
│   │   └── cosmetics.js
│   ├── user/
│   │   ├── controllers/
│   │   │   └── user.controller.js
│   │   ├── routes/
│   │   │   └── user.route.js
│   │   ├── services/
│   │   │   └── user.service.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   └── user.js
│   └── businesses.js
├── db/
│   ├── models/
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   └── user.model.js
│   └── db.js
├── middlewares/
│   ├── upload.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
├── utils/
│   ├── kafka/
│   │   ├── producer.js
│   │   ├── consumer.js
│   │   └── events.js
│   ├── helpers/
│   │   ├── apiResponse.js
│   │   ├── logger.js
│   │   └── redis.js
│   ├── constants.js
│   └── email.js
├── config/
│   ├── app.config.js
│   ├── db.config.js
│   └── kafka.config.js
├── app.js
└── server.js