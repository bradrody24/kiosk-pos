
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { ProductForm } from '@/components/admin/product-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const EditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { allProducts, user } = useApp();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/account');
    return null;
  }
  
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <PageLayout title="Product Not Found" showBack showCart={false} showBottomNav={false}>
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Back to Products
          </button>
        </div>
      </PageLayout>
    );
  }
  
  const handleSuccess = () => {
    navigate('/admin/products');
  };
  
  return (
    <PageLayout title="Edit Product" showBack showCart={false} showBottomNav={false}>
      <div className="p-4">
        <ProductForm product={product} onSuccess={handleSuccess} />
      </div>
    </PageLayout>
  );
};

export default EditProductPage;
