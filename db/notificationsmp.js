const path = require('path');
const fs = require('fs');

class NotificationsControl {
	constructor() {
		this.data = [];
		this.init();
	}

	init() {
		const data_ = require('./notificationsmp.json');
		if (data_) {
			console.log(data_);
			this.data = data_.data;
		}
	}
	guardarDB({ element }) {
		const dbPath = path.join(__dirname, '../db/notificationsmp.json');
		this.data.push(element);
		if (this.data.length > 50) {
			const split = Math.round(this.data.length / 2);
			this.data.splice(0, split);
		}
		fs.writeFileSync(dbPath, JSON.stringify(this.data));
	}
	findDB({ pay_id }) {
		if (!pay_id ) return this.data;
		return this.data.find((element) => element.data.id === pay_id );
	}
}

module.exports = NotificationsControl;
