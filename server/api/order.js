const router = require('express').Router()
const withCart = require('./withCart');
const { OrderItem, Order, Product } = require('../db/models')

module.exports = router

router.use(withCart);

router.get('/', (req, res, next) => {

    res.json(req.cart)
});

// put /incart
/*
  find the orderItem and update it (swap out quantity values)
*/

router.put('/incart', async (req, res, next) => {
  const { quantity, productId } = req.body.productInfo;

  const orderItem = await OrderItem.findOne({
    where: { productId: productId, orderId: req.cart.id }
  })

  await orderItem.update({ quantity: quantity })
  req.cart = await Order.findById(req.cart.id)
  res.json(req.cart);
})

//working !
router.put('/inproduct', async (req, res, next) => {
  let { quantity, productId } = req.body.productInfo;

  const orderItem = await OrderItem.findOne({
    where: { productId: productId, orderId: req.cart.id },
    include: [{ model: Product }]
  })

  if (!orderItem) {
    req.method = 'POST';
    res.redirect('/api/order/neworderitem');
  }
  // get the previous quantity, add the new quantity to it... if that's higher than the stock, update with the stock and if its not, update with the new quantity
  let oldQuan, newQuan, stock;
  stock = Number(orderItem.product.stock);
  oldQuan = Number(orderItem.quantity);
  quantity = Number(quantity);
  newQuan = (quantity + oldQuan) > stock ?
              stock
              : (quantity + oldQuan);

  await orderItem.update({ quantity: newQuan })

  req.cart = await Order.findById(req.cart.id)
  res.json(req.cart);

})

router.post('/neworderitem', (req, res, next) => {
  const { currentPrice, quantity, productId } = req.body.productInfo;

  OrderItem.create({ currentPrice, quantity, productId, orderId: req.cart.id })
    .then(async () => {
      req.cart = await Order.findById(req.cart.id)
      res.json(req.cart);
    })
    .catch(next);

})
// put /inproduct
/*
  see if there is an order item... if there is add the new quantity up to the item's stock
  if there isn't that order item yet, create it
*/

// router.put('/', async (req, res, next) => {
//   const { currentPrice, quantity, productId } = req.body.productInfo;
//   console.log('inside of put request', productId, req.cart.id);

// 	const orderItem = await OrderItem.findOne( {
//     where: {productId: productId, orderId: req.cart.id},
//     include: [{model: Product }] })

//   console.log('order item is: ', orderItem);
//   console.log('item stock: ', orderItem.product.stock)
//   	if (orderItem) {
//       let oldQuan, newQuan, stock;
//       stock = Number(orderItem.product.stock);
//       oldQuan = Number(orderItem.quantity);
//       newQuan = Number(quantity) + oldQuan > stock ?
//         stock
//         : Number(quantity) + oldQuan;

//       await orderItem.update({ quantity: newQuan })

//       req.cart = await Order.findById(req.cart.id)
//       res.json(req.cart);
//   	} else {
//   		OrderItem.create({currentPrice, quantity, productId, orderId: req.cart.id })
// 		    .then( async () => {
// 		      req.cart = await Order.findById(req.cart.id)
// 		      res.json(req.cart);
// 		    })
// 		    .catch(next);
//   	}
// })




//?take the else statement in the put request and turn it into a post request?
