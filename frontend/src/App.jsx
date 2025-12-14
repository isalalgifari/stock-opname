import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/ProductPage';
import WarehousePage from './pages/WarehousePage';
import StockPage from './pages/StockPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute allow={['admin', 'staff']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stocks"
              element={
                <ProtectedRoute allow={['admin', 'staff']}>
                  <StockPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute allow={['admin']}>
                  <ProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/warehouses"
              element={
                <ProtectedRoute allow={['admin']}>
                  <WarehousePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute allow={['admin']}>
                  <UserPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
