import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExpenseList } from "../components/ExpenseList";
import { getMonthRange } from "../lib/formatters";
import { supabase } from "../lib/supabase";
import type { Expense, ExpenseCategory } from "../types/expense";

type LoadState = "loading" | "success" | "error";

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      setLoadState("loading");
      const { start, end } = getMonthRange();

      const { data, error } = await supabase
        .from("expenses")
        .select("id, amount, category, created_at")
        .gte("created_at", start)
        .lt("created_at", end)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error(error);
        setLoadState("error");
        return;
      }

      setExpenses(
        (data ?? []).map((row) => ({
          id: row.id,
          amount: Number(row.amount),
          category: row.category as ExpenseCategory,
          created_at: row.created_at,
        })),
      );
      setLoadState("success");
    }

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleExpenseDeleted(id: number) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  return (
    <main className="page page-starry page-expenses">
      <div className="content">
        <Link to="/" className="btn btn-back">
          ← Volver
        </Link>

        <h1 className="page-title page-title-comic">Gastos del mes</h1>

        {loadState === "loading" && (
          <p className="status-message" aria-live="polite">
            Cargando gastos...
          </p>
        )}

        {loadState === "error" && (
          <p className="message message-error" role="alert">
            No se pudieron cargar los gastos
          </p>
        )}

        {loadState === "success" && (
          <ExpenseList
            expenses={expenses}
            onExpenseDeleted={handleExpenseDeleted}
          />
        )}
      </div>
    </main>
  );
}
