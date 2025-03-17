
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const AccountPage = () => {
  const { user, login, logout } = useApp();
  
  const handleLogin = (role: 'admin' | 'customer') => {
    login(role);
  };
  
  return (
    <PageLayout title="Account">
      <div className="p-6">
        {user ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-3">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user.role} Account</p>
            </div>
            
            <div className="space-y-3">
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" className="w-full">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              
              <Button variant="destructive" className="w-full" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
              <p className="text-muted-foreground">Please sign in to continue</p>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full" onClick={() => handleLogin('customer')}>
                Customer Login
              </Button>
              
              <Button variant="outline" className="w-full" onClick={() => handleLogin('admin')}>
                Admin Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AccountPage;
