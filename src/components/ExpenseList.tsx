import { useMemo, useState } from "react";
import {
  buildMonthOptions,
  formatCurrency,
  formatExpenseDate,
  formatMonthLabel,
  getCurrentMonthKey,
  isDateInMonth,
} from "../lib/formatters";
import { supabase } from "../lib/supabase";
import {
  ALL_CATEGORIES_FILTER,
  EXPENSE_CATEGORIES,
  type CategoryFilter,
  type Expense,
} from "../types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: (id: number) => void;
}

type DeleteState = { id: number } | null;
type ViewMode = "month" | "total";

export function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const [filter, setFilter] = useState<CategoryFilter>(ALL_CATEGORIES_FILTER);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [deleteTarget, setDeleteTarget] = useState<DeleteState>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "error"
  >("idle");

  const monthOptions = useMemo(() => buildMonthOptions(expenses), [expenses]);

  const visibleExpenses = useMemo(() => {
    let result = expenses;

    if (viewMode === "month") {
      result = result.filter((expense) =>
        isDateInMonth(expense.created_at, selectedMonth),
      );
    }

    if (filter !== ALL_CATEGORIES_FILTER) {
      result = result.filter((expense) => expense.category === filter);
    }

    return result;
  }, [expenses, filter, selectedMonth, viewMode]);

  const total = useMemo(
    () =>
      visibleExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0,
      ),
    [visibleExpenses],
  );

  async function confirmDelete() {
    if (!deleteTarget || deleteStatus === "deleting") return;

    setDeleteStatus("deleting");

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      console.error(error);
      setDeleteStatus("error");
      return;
    }

    onExpenseDeleted(deleteTarget.id);
    setDeleteTarget(null);
    setDeleteStatus("idle");
  }

  return (
    <div className="expense-list">
      <div className="total-card">
        <p className="total-label">
          {viewMode === "total" ? "Total general" : "Total del mes"}
        </p>
        <p className="total-amount">{formatCurrency(total)}</p>
      </div>

      <div className="filters">
        <div className="form-field">
          <label htmlFor="month-filter">Filtrar por mes</label>
          <select
            id="month-filter"
            value={selectedMonth}
            disabled={viewMode === "total"}
            onChange={(event) => {
              setSelectedMonth(event.target.value);
              setViewMode("month");
            }}
          >
            {monthOptions.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {formatMonthLabel(monthKey)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`btn btn-filter-total${viewMode === "total" ? " is-active" : ""}`}
          onClick={() =>
            setViewMode((current) => (current === "total" ? "month" : "total"))
          }
        >
          {viewMode === "total" ? "FILTRO POR MES" : "FILTRO POR TOTAL"}
        </button>
      </div>

      <div className="form-field">
        <label htmlFor="filter">Filtrar por categoría</label>
        <select
          id="filter"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as CategoryFilter)
          }
        >
          <option value={ALL_CATEGORIES_FILTER}>
            {ALL_CATEGORIES_FILTER}
          </option>
          {EXPENSE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {visibleExpenses.length === 0 ? (
        <p className="empty-message">No hay gastos para mostrar</p>
      ) : (
        <ul className="expense-cards">
          {visibleExpenses.map((expense) => (
            <li key={expense.id} className="expense-card">
              <p className="expense-amount">
                {formatCurrency(Number(expense.amount))}
              </p>
              <p className="expense-category">{expense.category}</p>
              <p className="expense-date">
                {formatExpenseDate(expense.created_at)}
              </p>
              <button
                type="button"
                className="btn-delete"
                onClick={() => {
                  setDeleteTarget({ id: expense.id });
                  setDeleteStatus("idle");
                }}
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}

      {deleteTarget && (
        <div className="dialog-overlay" role="presentation">
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">¿Borrar este gasto?</h2>
            <p>Esta acción no se puede deshacer.</p>
            {deleteStatus === "error" && (
              <p className="message message-error" role="alert">
                No se pudo borrar el gasto
              </p>
            )}
            <div className="dialog-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteStatus("idle");
                }}
                disabled={deleteStatus === "deleting"}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={deleteStatus === "deleting"}
              >
                {deleteStatus === "deleting" ? "Borrando..." : "Borrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
