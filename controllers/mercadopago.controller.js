const { default: axios } = require('axios');
const mercadopago = require('mercadopago');
const NotificationsControl = require('../db/notificationsmp');
mercadopago.configure({
	access_token: process.env.ACCESS_TOKEN_MERCADOPAGO,
	integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
});

// const NOTIFICATION_URL = 'https://checkout-mp-react.herokuapp.com/api/mercadopago/notification';
const NOTIFICATION_URL =
	'https://checkout-mp-react.herokuapp.com/api/mercadopago/notification';
const FRONT_URL = 'https://checkout-mp-react.herokuapp.com/';

const createPreference = async (req, res) => {
	try {
		let { title, unit_price, quantity, idProd, desc, img, payer } = req.body;
		idProd = 1234;
		unit_price = Number(unit_price);
		quantity = Number(quantity);
		//TODO: find producto and check price and stock!
		//Integrator ID
		const preference = {
			notification_url: NOTIFICATION_URL,
			external_reference: 'brsmilanez@hotmail.com',

			items: [
				{
					title,
					unit_price,
					quantity,
				},
			],
			payer,

			//Estas son las rutas a las que te redigira luego de pagar
			//segun sea el caso.
			back_urls: {
				success: FRONT_URL,
				failure: FRONT_URL,
				pending: FRONT_URL,
			},
			auto_return: 'approved',
			payment_methods: {
				excluded_payment_methods: [
					{
						id: 'amex',
					},
				],
				excluded_payment_types: [
					{
						// id: 'ticket',
						id: 'atm',
					},
				],
				//max cuotas
				installments: 6,
			},
			// binary_mode: true,
		};
		const addPreference = await mercadopago.preferences.create(preference);
		const id = addPreference.body.id;
		console.log('id creado', id);
		return res.json({
			ok: true,
			id,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Hubo un error al crear la preferencia',
		});
	}
};
const feedback = (req, res) => {
	const { payment_id, status, merchant_order_id } = req.query;
	console.log('feedback');
	console.log({ payment_id, status, merchant_order_id });
	return res.json({
		ok: true,
		payment_id,
		status,
		merchant_order_id,
	});
};

const notification = (req, res) => {
	try {
		const { topic, id } = req.body;
		//param /?data.id=20795773028&type=payment
		const { type } = req.query;
		if (type) {
			const notification = new NotificationsControl();
			let notificacionReq = req.body;
			if (notificacionReq && notificacionReq.action === 'payment.created') {
				notification.guardarDB({ element: notificacionReq });
			}
		}

		return res.json({
			ok: true,
			topic,
			id,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Hubo un error al recibir la notificacion',
		});
	}
};

const getNotifications = async (req, res) => {
	try {
		const { pay_id } = req.params;
		const notification = new NotificationsControl();
		const notifications = notification.findDB({ pay_id });
		if (pay_id) {
			try {
				const resp = await axios.get(
					`https://api.mercadopago.com/v1/payments/${pay_id}`,
					{
						headers: {
							Authorization: `Bearer ${process.env.ACCESS_TOKEN_MERCADOPAGO}`,
						},
					}
				);
				const { status } = resp.data;
				return res.json({
					ok: true,
					notifications,
					status,
				});
			} catch (error) {
				console.log(error);
			}
		}
		return res.json({
			ok: true,
			notifications,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Hubo un error al obtener la notificacion',
		});
	}
};

module.exports = { createPreference, feedback, notification, getNotifications };
