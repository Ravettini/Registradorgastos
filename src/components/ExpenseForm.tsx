import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { parseAmount } from "../lib/formatters";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "../types/expense";

type FormStatus = "idle" | "saving" | "success" | "error";

export function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | "">("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const parsedAmount = parseAmount(amount);
  const isValid = parsedAmount !== null && category !== "";
  const isSaving = status === "saving";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSaving) return;

    const validAmount = parseAmount(amount);
    if (!validAmount || !category) return;

    setStatus("saving");

    const { error } = await supabase.from("expenses").insert({
      amount: validAmount,
      category,
    });

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setAmount("");
    setCategory("");
    setStatus("success");
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h1 className="page-title page-title-comic">REGISTRÁ TU GASTO</h1>

      <div className="form-field">
        <label htmlFor="amount">Importe</label>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="$ 0"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            if (status === "success" || status === "error") {
              setStatus("idle");
            }
          }}
          disabled={isSaving}
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as ExpenseCategory | "");
            if (status === "success" || status === "error") {
              setStatus("idle");
            }
          }}
          disabled={isSaving}
        >
          <option value="" disabled>
            Elegí una categoría
          </option>
          {EXPENSE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!isValid || isSaving}
      >
        {isSaving ? "REGISTRANDO..." : "REGISTRÁ GASTO"}
      </button>

      {status === "success" && (
        <p className="message message-success" role="status" aria-live="polite">
          Gasto registrado
        </p>
      )}

      {status === "error" && (
        <p className="message message-error" role="alert" aria-live="assertive">
          No se pudo registrar el gasto
        </p>
      )}

      <Link to="/gastos" className="btn btn-secondary">
        Ver todos los gastos
      </Link>
    </form>
  );
}
