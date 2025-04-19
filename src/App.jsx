import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import Register from "./components/Register";
import Login from "./components/Login";
import BankList from "./components/BankList";
import BankAccounts from "./components/BankAccounts";
import { Header } from "./components/Header";
import "./App.css";
import AccountTransactions from "./components/AccountTransactions";
import PWAUpdate from "./components/PWAUpdate";

function App() {
  return (
    <>
      <PWAUpdate />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/banks" element={<BankList />} />
          <Route path="/accounts" element={<BankAccounts />} />
          <Route path="/transactions" element={<AccountTransactions />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
