
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { ProductForm } from '@/components/admin/product-form';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/account');
    return null;
  }
  
  const handleSuccess = () => {
    navigate('/admin/products');
  };
  
  return (
    <PageLayout title="Add New Product" showBack showCart={false} showBottomNav={false}>
      <div className="p-4">
        <ProductForm onSuccess={handleSuccess} />
      </div>
    </PageLayout>
  );
};

export default AddProductPage;
