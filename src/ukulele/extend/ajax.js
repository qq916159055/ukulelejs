"use strict";
export class Ajax {
	static get(url, success, error) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status >= 200 && request.status < 300) {
					success(request.responseText);
				} else {
					if (error) {
						error();
					}
				}
			}
		};
		request.open("GET", url, true);
		request.send(null);
	}
}