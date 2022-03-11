const mercadopago = require('mercadopago');
mercadopago.configure({
	access_token: process.env.ACCESS_TOKEN_MERCADOPAGO,
});

const createPreference = async (req, res) => {
	try {
		let { title, unit_price, quantity } = req.body;
		unit_price = Number(unit_price) * 0.5;
		quantity = Number(quantity);
		const preference = {
			// notification_url: process.env.NOTIFICATION_URL,
			notification_url: 'https://nodeapp.free.beeceptor.com',
			items: [
				{
					title,
					unit_price,
					quantity,
				},
			],

			//Estas son las rutas a las que te redigira luego de pagar
			//segun sea el caso.
			back_urls: {
				success: 'http://localhost:8080/feedback',
				failure: 'http://localhost:8080/feedback',
				pending: 'http://localhost:8080/feedback',
			},
			binary_mode: true,
			auto_return: 'approved',
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

module.exports = { createPreference, feedback };
