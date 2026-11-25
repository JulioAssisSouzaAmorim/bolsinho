import { expect, test } from '@playwright/test';

async function addTransaction(page, { description, amount, type = 'Despesa', category = 'Outros', date }) {
  await page.getByLabel('Descrição').fill(description);
  await page.getByLabel('Valor (R$)').fill(amount);
  await page.getByLabel('Tipo', { exact: true }).selectOption({ label: type });
  await page.getByLabel('Categoria', { exact: true }).selectOption({ label: category });
  if (date) await page.getByLabel('Data').fill(date);
  await page.getByRole('button', { name: 'Adicionar' }).click();
}

const transactionList = (page) => page.getByRole('list', { name: 'Lista de transações' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('registrar receita e despesa atualiza o resumo', async ({ page }) => {
  await addTransaction(page, { description: 'Salário', amount: '3.000,00', type: 'Receita', category: 'Salário' });
  await addTransaction(page, { description: 'Aluguel', amount: '1.200', category: 'Moradia' });

  await expect(page.getByTestId('total-receitas')).toHaveText('R$ 3.000,00');
  await expect(page.getByTestId('total-despesas')).toHaveText('R$ 1.200,00');
  await expect(page.getByTestId('saldo')).toHaveText('R$ 1.800,00');
  await expect(transactionList(page).getByRole('listitem')).toHaveCount(2);
});

test('dados inválidos mostram mensagens de erro e nada é registrado', async ({ page }) => {
  await addTransaction(page, { description: '', amount: '-5' });

  const alert = page.getByRole('alert');
  await expect(alert).toContainText('Informe uma descrição.');
  await expect(alert).toContainText('Informe um valor maior que zero.');
  await expect(page.getByText('Nenhuma transação encontrada.')).toBeVisible();
});

test('remover uma transação atualiza lista e saldo', async ({ page }) => {
  await addTransaction(page, { description: 'Cinema', amount: '40', category: 'Lazer' });
  await addTransaction(page, { description: 'Uber', amount: '25,50', category: 'Transporte' });

  await page.getByRole('button', { name: 'Remover Cinema' }).click();

  await expect(transactionList(page).getByRole('listitem')).toHaveCount(1);
  await expect(transactionList(page)).not.toContainText('Cinema');
  await expect(page.getByTestId('saldo')).toHaveText('-R$ 25,50');
});
