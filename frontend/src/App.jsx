import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import Analytics from './pages/Analytics';
import AllTransactions from './pages/AllTransactions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddTransaction />} />
          <Route path="edit/:id" element={<EditTransaction />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="transactions" element={<AllTransactions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
