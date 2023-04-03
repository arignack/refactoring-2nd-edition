function statement(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice[0].customer;
	statementData.performances = invoice[0].performances.map(enrichPerformance);
	return renderPlainText(statementData, plays);

	function enrichPerformance(aPerformance) {
		const result = Object.assign({}, aPerformance);
		result.play = playFor(result);
		return result;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}
}

function renderPlainText(data, plays) {
	let result = `Statement for ${data.customer}\n`;
	for (let perf of data.performances) {
		result += ` ${perf.play.name}: ${usd(amountFor(perf) / 100)} (${
			perf.audience
		} seats)\n`;
	}

	result += `Amount owed is ${usd(totalAmount())}\n`;
	result += `You earned ${totalVolumeCredits()} credits\n`;
	return result;

	function totalVolumeCredits() {
		let result = 0;
		for (let perf of data.performances) {
			result += volumeCreditsFor(perf);
		}
		return result;
	}

	function totalAmount() {
		let result = 0;
		for (let perf of data.performances) {
			result += amountFor(perf);
		}
		return result;
	}

	function volumeCreditsFor(aPerformance) {
		let result = 0;
		result += Math.max(aPerformance.audience - 30, 0);
		if ("comedy" === aPerformance.play.type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	function amountFor(perf) {
		let result = 0;
		switch (perf.play.type) {
			case "tragedy":
				result = 40000;
				if (perf.audience > 30) {
					result += 1000 * (perf.audience - 30);
				}
				break;
			case "comedy":
				result = 30000;
				if (perf.audience > 20) {
					result += 10000 + 500 * (perf.audience - 20);
				}
				result += 300 * perf.audience;
				break;
			default:
				throw new Error(`unknown type: ${perf.play.type}`);
		}
		return result;
	}
}

function usd(aNumber) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(aNumber);
}

async function getData() {
	// const invoicesResponse = await fetch("./invoices.json");
	// const invoices = await invoicesResponse.json();

	invoices = require("../invoices.json");

	// const playResponse = await fetch("./plays.json");
	// const plays = await playResponse.json();
	plays = require("../plays.json");

	statement = statement(invoices, plays);
	console.log(statement);
}

getData();

module.exports = usd;
