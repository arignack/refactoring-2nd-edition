function statement(invoice, plays) {
    let totalAmount = 0;

    let result = `Statement for ${invoice[0].customer}\n`;
    for (let perf of invoice[0].performances) {
        // print line for this order
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }

    let volumeCredits = 0;
    for (let perf of invoice[0].performances) {
        volumeCredits += volumeCreditsFor(perf);
    }

    result += `Amount owed is ${usd(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}



function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber);
}

function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function amountFor(perf) {
    let result = 0;
    switch (playFor(perf).type) {
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
            throw new Error(`unknown type: ${playFor(perf).type}`);
    }
    return result;
}

const invoicesResponse = await fetch("invoices.json");
const invoices = await invoicesResponse.json();


const playResponse = await fetch("plays.json");
const plays = await playResponse.json();

async function getData() {
    statement = statement(invoices, plays);
    console.log(statement);
}

getData();    