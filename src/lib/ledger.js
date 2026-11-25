/** Funções puras sobre a lista de transações (nunca alteram a lista recebida). */

export function addTransaction(transactions, transaction) {
  return [...transactions, transaction];
}

export function removeTransaction(transactions, id) {
  return transactions.filter((transaction) => transaction.id !== id);
}

export function summarize(transactions) {
  let incomeCents = 0;
  let expenseCents = 0;
  for (const { type, amountCents } of transactions) {
    if (type === 'receita') incomeCents += amountCents;
    else expenseCents += amountCents;
  }
  return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents };
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
