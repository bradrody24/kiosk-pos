import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageLayout } from '@/components/layout/page-layout';
import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;
      
      // Show success message and redirect to login
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
        duration: 5000,
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Sign Up" showBottomNav={false}>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Banner Image */}
        <div className="relative flex-1 -mx-4">
          <img 
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop"
            alt="Burger banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Registration Form */}
        <div className="px-4 -mt-8 relative z-10 space-y-4">
          <Card className="shadow-lg">
            <CardContent className="pt-6 pb-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-9"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-9"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-9"
                />

                {error && (
                  <div className="text-xs text-destructive text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-9"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="text-center">
            <Button 
              variant="link" 
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign in
            </Button>
          </div>

          {/* Ad Banner Section */}
          <Card className="overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2070&auto=format&fit=crop"
              alt="Promotional banner"
              className="w-full h-24 object-cover"
            />
            <CardContent className="p-3">
              <h3 className="text-sm font-medium">Join Now!</h3>
              <p className="text-xs text-muted-foreground">Create an account and get special offers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
} 