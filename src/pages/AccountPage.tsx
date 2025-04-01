import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, User, Settings, Package, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        navigate('/login');
      }
    };

    getUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <PageLayout title="Account" showBack={false}>
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Account" showCart={false}>
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h2 className="text-sm font-medium">
                {user?.user_metadata?.name || 'User'}
              </h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Account Details */}
        {/* <Card className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Email</h3>
              <p className="text-sm">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Account ID</h3>
              <p className="text-sm">{user?.id}</p>
            </div>
          </div>
        </Card> */}

        {/* Manage Categories Button */}
        <Card className="p-4 bg-primary/5">
          <Button 
            variant="outline" 
            className="w-full h-9 text-sm"
            onClick={() => navigate('/categories')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Categories
          </Button>
        </Card>

        {/* Manage Products Button */}
        <Card className="p-4 bg-primary/5">
          <Button 
            variant="outline" 
            className="w-full h-9 text-sm"
            onClick={() => navigate('/products')}
          >
            <Package className="mr-2 h-4 w-4" />
            Manage Products
          </Button>
        </Card>

        {/* Sales for Today Button */}
        <Card className="p-4 bg-primary/5">
          <Button 
            variant="outline" 
            className="w-full h-9 text-sm"
            onClick={() => navigate('/sales')}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Sales for Today
          </Button>
        </Card>

        {/* Sign Out Button */}
        <Button 
          variant="destructive" 
          className="w-full h-9 text-sm"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </PageLayout>
  );
}
