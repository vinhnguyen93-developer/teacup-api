require('dotenv').config();
const dateFormat = require('dateformat');
const querystring = require('qs');
const crypto = require('crypto');

const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');

class OrderController {
  // [GET] order/show
  show(req, res, next) {
    if (!req.session.cart) {
      return res.redirect('/');
    } else if (Object.keys(req.session.cart.items).length === 0) {
      return res.redirect('/');
    }

    const { email, _id } = req.user;
    const message = req.flash('error')[0];
    const cart = new Cart(req.session.cart);

    res.render('orders/checkout-order', {
      totalPrice: cart.totalPrice,
      totalQuantity: cart.totalQuantity,
      products: cart.generateArray(),
      email: email,
      userId: _id,
      message: message,
    });
  }

  // [GET] order/my-order
  showMyOrder(req, res, next) {
    Order.find({ user: req.user })
      .then((orders) => {
        let cart;

        orders.forEach((order) => {
          cart = new Cart(order.cart);
          order.items = cart.generateArray();
        });

        res.render('orders/my-order', {
          orders: orders,
          countOrder: orders.length,
        });
      })
      .catch(next);
  }

  // [POST] order/create
  create(req, res, next) {
    const { name, phone, city, district, wards, address, note, paymentType } = req.body;
    const payload = {
      name,
      phone,
      address: address + ', ' + wards + ', ' + district + ', ' + city,
      note,
      paymentType,
    };

    if (req.body.paymentType === '1') {
      req.session.payload = payload;

      const order = new Order({
        user: req.user,
        cart: req.session.cart,
        paymentId: Date.now(),
        ...req.session.payload,
      });

      order.save(function (err, result) {
        if (err) {
          res.json({ err: err });
        } else {
          req.flash('success', 'Bạn đã đặt hàng thành công. Cảm ơn bạn đã tin tưởng!');
          req.session.cart = null;
          res.redirect('/');
        }
      });
    } else {
      var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const tmnCode = process.env.VNP_TMNCODE;
      const secretKey = process.env.VNP_HASHSECRET;
      let vnpUrl = process.env.VNP_URL;
      const returnUrl = process.env.VNP_RETURNURL;

      const date = new Date();

      const createDate = dateFormat(date, 'yyyymmddHHmmss');
      const orderId = dateFormat(date, 'HHmmss');
      const amount = req.session.cart.totalPrice;
      let bankCode = 'NCB';
      const orderInfo = `Thanh toan don hang ngay: ${createDate}`;
      const orderType = '100000';
      const locale = 'vn';
      const currCode = 'VND';
      var vnp_Params = {};

      req.session.payload = payload;

      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = orderInfo;
      vnp_Params['vnp_OrderType'] = orderType;
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;

      vnp_Params = sortObject(vnp_Params);

      const signData = querystring.stringify(vnp_Params, { encode: false });

      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

      res.redirect(vnpUrl);
    }
  }

  // [GET] order/vnpay_return
  vnpReturn(req, res, next) {
    let vnp_Params = req.query;

    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      if (rspCode == 0) {
        const order = new Order({
          user: req.user,
          cart: req.session.cart,
          paymentId: orderId,
          ...req.session.payload,
        });

        order.save(function (err, result) {
          if (err) {
            res.json({ err: err });
          } else {
            req.flash('success', 'Bạn đã đặt hàng thành công. Cảm ơn bạn đã tin tưởng!');
            req.session.cart = null;
            res.redirect('/');
          }
        });
      } else if (rspCode == 24) {
        req.flash('error', 'Giao dịch không thành công!');
        res.redirect('/order/show');
      }
      // res.json({ code: vnp_Params['vnp_ResponseCode'] });
    } else {
      req.flash('error', 'Giao dịch không thành công!');
      res.redirect('/order/show');
      // res.json({ code: '97' });
    }
  }
}

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = new OrderController();
