const express = require('express');
const cors = require('cors');
const { path0 } = require('../utils/const');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 8080;
		this.rutas = {
			mercadopago: '/api/mercadopago',
		};
		this.middlewares();
		this.routes();
		console.log(path0);
	}

	routes() {
		this.app.use(
			this.rutas.mercadopago,
			require('../routes/mercadopago.route')
		);
	}
	middlewares() {
		this.app.use(express.static('public'));
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(cors());
		this.app.use(express.json());
	}
	listen() {
		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`);
		});
	}
}

module.exports = Server;
