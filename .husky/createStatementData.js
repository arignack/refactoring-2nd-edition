function createStatementData(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice[0].customer;
	statementData.performances = invoice[0].performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;

	function enrichPerformance(aPerformance) {
		const result = Object.assign({}, aPerformance);
		result.play = playFor(result);
		result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result);
		return result;
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

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	function totalVolumeCredits(data) {
		return data.performances.reduce(
			(total, p) => total + p.volumeCredits,
			0
		);
	}

	function totalAmount(data) {
		return data.performances.reduce((total, p) => total + p.amount, 0);
	}

	function volumeCreditsFor(aPerformance) {
		let result = 0;
		result += Math.max(aPerformance.audience - 30, 0);
		if ("comedy" === aPerformance.play.type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}
}

module.exports = createStatementData;