import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { CheckoutPage } from "./pages/CheckoutPage";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import RegisterPage from '@/pages/RegisterPage';
import CategoriesPage from '@/pages/CategoriesPage';
import ProductsPage from '@/pages/ProductsPage';

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductListPage from "./pages/admin/ProductListPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import StoreSettingsPage from "./pages/admin/StoreSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/account" element={<AccountPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductListPage />} />
            <Route path="/admin/products/new" element={<AddProductPage />} />
            <Route path="/admin/products/edit/:productId" element={<EditProductPage />} />
            <Route path="/admin/settings" element={<StoreSettingsPage />} />
            
            {/* Categories Routes */}
            <Route path="/categories" element={<CategoriesPage />} />
            
            {/* Products Routes */}
            <Route path="/products" element={<ProductsPage />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
