/** Funções puras sobre a lista de transações (nunca alteram a lista recebida). */

export function addTransaction(transactions, transaction) {
  return [...transactions, transaction];
}

export function removeTransaction(transactions, id) {
  return transactions.filter((transaction) => transaction.id !== id);
}
