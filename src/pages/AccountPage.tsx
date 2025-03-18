
import React, { useEffect } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AccountPage = () => {
  const { user, logout, isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <PageLayout title="Account">
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-3">
              {user?.name?.charAt(0) || '?'}
            </div>
            <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user?.role || 'Customer'} Account</p>
          </div>
          
          <div className="space-y-3">
            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountPage;

