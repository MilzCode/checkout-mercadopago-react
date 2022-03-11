const { Router } = require('express');
const { createPreference } = require('../controllers/mercadopago.controller');
const router = Router();

router.post('/create_preference', createPreference);

//ONLY FOR DEVELOPMENT
router.post('/create_user_test', async (req, res) => {
	try {
		const url = 'https://api.mercadopago.com/users/test_user';
		const resp = await require('axios').post(
			url,
			{ site_id: 'MLC' },
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Token': 'Bearer ' + process.env.ACCESS_TOKEN,
				},
				params: {
					access_token: process.env.ACCESS_TOKEN,
				},
			}
		);
		return res.json({
			ok: true,
			data: resp.data,
			msg: 'Usuario creado con éxito',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Hubo un error al crear el usuario de prueba',
		});
	}
});

module.exports = router;
