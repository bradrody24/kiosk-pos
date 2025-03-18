
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setShowOTPInput(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: verifyCode,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have successfully logged in!",
      });
      navigate('/menu');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Login" showBack={false} showCart={false}>
      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">
              {showOTPInput 
                ? "Enter the verification code sent to your phone"
                : "Sign in with your phone number to continue"
              }
            </p>
          </div>

          {!showOTPInput ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+639123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Verification Code
                </label>
                <InputOTP
                  value={verifyCode}
                  onChange={setVerifyCode}
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, idx) => (
                        <InputOTPSlot key={idx} {...slot} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthPage;
