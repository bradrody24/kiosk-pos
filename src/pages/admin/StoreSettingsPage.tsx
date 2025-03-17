
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { toast } from '@/components/ui/use-toast';

const StoreSettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/account');
    return null;
  }
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your store settings have been updated",
    });
  };
  
  return (
    <PageLayout title="Store Settings" showBack showCart={false} showBottomNav={false}>
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Store Information</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="Burger Chain" />
            </div>
            
            <div>
              <Label htmlFor="storeAddress">Store Address</Label>
              <Input id="storeAddress" defaultValue="123 Burger Street, Metro Manila" />
            </div>
            
            <div>
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input id="storePhone" defaultValue="+63 123 456 7890" />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Business Hours</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="openTime">Opening Time</Label>
                <Input id="openTime" type="time" defaultValue="10:00" />
              </div>
              
              <div>
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input id="closeTime" type="time" defaultValue="22:00" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="monToFri" className="h-4 w-4" defaultChecked />
              <Label htmlFor="monToFri">Open Monday to Friday</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="weekend" className="h-4 w-4" defaultChecked />
              <Label htmlFor="weekend">Open on Weekends</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Payment Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="enableGcash" className="h-4 w-4" defaultChecked />
              <Label htmlFor="enableGcash">Enable GCash Payments</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="enablePaymaya" className="h-4 w-4" defaultChecked />
              <Label htmlFor="enablePaymaya">Enable PayMaya Payments</Label>
            </div>
          </div>
        </div>
        
        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </div>
    </PageLayout>
  );
};

export default StoreSettingsPage;
