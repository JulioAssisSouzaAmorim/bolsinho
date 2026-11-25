import { formatBRL } from './lib/money.js';
import { formatDateBR } from './lib/date.js';
import { CATEGORIES, createTransaction, ValidationError } from './lib/transaction.js';
import {
  addTransaction,
  filterTransactions,
  removeTransaction,
  sortByDateDesc,
  summarize,
  totalsByCategory,
} from './lib/ledger.js';

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function appendOptions(select, options) {
  for (const { value, label } of options) {
    const option = select.ownerDocument.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
}

function element(doc, tag, className, text) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Liga a interface (index.html) ao domínio. Recebe o repositório por
 * parâmetro para que possa ser testada com armazenamento em memória.
 */
export function mountApp({ root, repository, today = todayISO }) {
  const doc = root.ownerDocument ?? root;
  const $ = (selector) => root.querySelector(selector);
  const form = $('#form-transacao');
  const fields = form.elements;
  const errorList = $('#erros');
  const list = $('#lista-transacoes');
  const emptyMessage = $('#vazio');
  const categoryTotals = $('#por-categoria');
  const filterType = $('#filtro-tipo');
  const filterCategory = $('#filtro-categoria');
  const search = $('#busca');

  let transactions = repository.load();

  appendOptions(fields.category, CATEGORIES.map((c) => ({ value: c, label: c })));
  appendOptions(filterCategory, [
    { value: 'todas', label: 'Todas' },
    ...CATEGORIES.map((c) => ({ value: c, label: c })),
  ]);
  fields.date.value = today();

  function showErrors(messages) {
    errorList.replaceChildren(...messages.map((m) => element(doc, 'li', '', m)));
  }

  function renderSummary() {
    const { incomeCents, expenseCents, balanceCents } = summarize(transactions);
    $('#total-receitas').textContent = formatBRL(incomeCents);
    $('#total-despesas').textContent = formatBRL(expenseCents);
    const balance = $('#saldo');
    balance.textContent = formatBRL(balanceCents);
    balance.classList.toggle('negativo', balanceCents < 0);
  }

  function renderList() {
    const visible = sortByDateDesc(
      filterTransactions(transactions, {
        type: filterType.value,
        category: filterCategory.value,
        search: search.value,
      }),
    );
    list.replaceChildren(
      ...visible.map((tx) => {
        const item = element(doc, 'li', `tx tx--${tx.type}`);
        const info = element(doc, 'div', 'tx__info');
        info.append(
          element(doc, 'strong', '', tx.description),
          element(doc, 'span', 'tx__meta', `${tx.category} · ${formatDateBR(tx.date)}`),
        );
        const sign = tx.type === 'despesa' ? -1 : 1;
        const amount = element(doc, 'span', 'tx__valor', formatBRL(sign * tx.amountCents));
        const remove = element(doc, 'button', 'tx__remover', '✕');
        remove.type = 'button';
        remove.dataset.id = tx.id;
        remove.setAttribute('aria-label', `Remover ${tx.description}`);
        item.append(info, amount, remove);
        return item;
      }),
    );
    emptyMessage.hidden = visible.length > 0;
  }

  function renderCategoryTotals() {
    categoryTotals.replaceChildren(
      ...totalsByCategory(transactions).map(({ category, totalCents }) =>
        element(doc, 'li', '', `${category}: ${formatBRL(totalCents)}`),
      ),
    );
  }

  function render() {
    renderSummary();
    renderList();
    renderCategoryTotals();
  }

  function update(next) {
    transactions = next;
    repository.save(transactions);
    render();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const transaction = createTransaction({
        description: fields.description.value,
        amount: fields.amount.value,
        type: fields.type.value,
        category: fields.category.value,
        date: fields.date.value,
      });
      showErrors([]);
      update(addTransaction(transactions, transaction));
      fields.description.value = '';
      fields.amount.value = '';
      fields.description.focus();
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error;
      showErrors(Object.values(error.errors));
    }
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (button) update(removeTransaction(transactions, button.dataset.id));
  });

  for (const control of [filterType, filterCategory, search]) {
    control.addEventListener('input', renderList);
  }

  render();
  return { getTransactions: () => transactions };
}
