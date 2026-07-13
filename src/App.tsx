import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ExpensesPage } from "./pages/ExpensesPage";
import { RegisterExpensePage } from "./pages/RegisterExpensePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterExpensePage />} />
        <Route path="/gastos" element={<ExpensesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
