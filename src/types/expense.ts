export type ExpenseCategory =
  | "Ludmila"
  | "Gasto comida"
  | "Varios"
  | "Boludez";

export interface Expense {
  id: number;
  amount: number;
  category: ExpenseCategory;
  created_at: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Ludmila",
  "Gasto comida",
  "Varios",
  "Boludez",
];

export const ALL_CATEGORIES_FILTER = "Todas las categorías";

export type CategoryFilter = typeof ALL_CATEGORIES_FILTER | ExpenseCategory;
