"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from '@/lib/translations';
import { Loader2 } from "lucide-react";
import { signIn, signUp, resendSignUpCode, confirmSignUp, resetPassword, confirmResetPassword, getCurrentUser } from 'aws-amplify/auth';
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuthState } from "@/app/page";

type CustomAuthenticatorProps = {
  children: ReactNode;
  onAuthStateChange: (state: AuthState) => void;
};

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const confirmSignUpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  code: z.string().length(6),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type FormSchema = z.infer<typeof signInSchema> | z.infer<typeof signUpSchema> | z.infer<typeof confirmSignUpSchema> | z.infer<typeof forgotPasswordSchema> | z.infer<typeof resetPasswordSchema>;

export function CustomAuthenticator({ children, onAuthStateChange }: CustomAuthenticatorProps): JSX.Element {
  const [authState, setAuthState] = useState<AuthState>("signIn");
  const [previousAuthState, setPreviousAuthState] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const { toast } = useToast();
  const [passwordFieldId] = useState(`pwd-${Math.random().toString(36).substr(2, 9)}`);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormSchema>({
    resolver: zodResolver(
      authState === "signIn" ? signInSchema :
      authState === "signUp" ? signUpSchema :
      authState === "confirmSignUp" ? confirmSignUpSchema :
      authState === "forgotPassword" ? forgotPasswordSchema :
      resetPasswordSchema
    ),
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setAuthState("authenticated");
        onAuthStateChange("authenticated");
      } catch (err) {
        setAuthState("signIn");
      }
    };
    void checkUser();
  }, [onAuthStateChange]);

  const sendConfirmationCode = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      await resendSignUpCode({ username: email });
      toast({
        title: t('confirmationCodeSent'),
        description: t('confirmationCodeSentDescription'),
      });
    } catch (error) {
      console.error("Error sending confirmation code:", error);
      toast({
        title: t('confirmationCodeError'),
        description: t('confirmationCodeErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  const changeAuthState = useCallback((newState: AuthState, email: string = "") => {
    setPreviousAuthState(authState);
    setAuthState(newState);
    reset();

    if (email) {
      setEmail(email);
      if (newState === "confirmSignUp") {
        void sendConfirmationCode(email);
      }
      if (["confirmSignUp", "resetPassword"].includes(newState)) {
        setValue("email", email);
      }
    }
  }, [authState, reset, setValue, sendConfirmationCode]);

  const goBack = () => {
    if (previousAuthState) {
      setAuthState(previousAuthState);
      setPreviousAuthState(null);
    }
  };

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    setError("");
    try {
      switch (authState) {
        case "signIn":
          if ('password' in data) {
            try {
              const res = await signIn({ username: data.email, password: data.password });
              if (res.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                changeAuthState("confirmSignUp", data.email);
              } else if (res.isSignedIn) {
                onAuthStateChange("authenticated");
              }
            } catch (error) {
              console.error("Sign in error:", error);
              setError(error instanceof Error ? error.message : "An unknown error occurred during sign in");
            }
          }
          break;

        case "signUp":
          if ('password' in data && 'confirmPassword' in data) {
            try {
              await signUp({ username: data.email, password: data.password });
              changeAuthState("confirmSignUp", data.email);
            } catch (error) {
              console.error("Sign up error:", error);
              setError(error instanceof Error ? error.message : "An unknown error occurred during sign up");
            }
          }
          break;

        case "confirmSignUp":
          if ('code' in data) {
            try {
              await confirmSignUp({ username: data.email, confirmationCode: data.code });
              changeAuthState("signIn", data.email);
            } catch (error) {
              console.error("Confirm sign up error:", error);
              setError(error instanceof Error ? error.message : "An unknown error occurred during confirmation");
            }
          }
          break;

        case "forgotPassword":
          try {
            await resetPassword({ username: data.email });
            setEmail(data.email);
            changeAuthState("resetPassword");
          } catch (err) {
            toast({
              title: t('forgotPasswordError'),
              description: t('forgotPasswordErrorDescription'),
              variant: "destructive",
            });
          }
          break;

        case "resetPassword":
          try {
            await confirmResetPassword({
              username: email,
              newPassword: data.newPassword,
              confirmationCode: data.code
            });
            changeAuthState("signIn");
            toast({
              title: t('passwordResetSuccess'),
              description: t('passwordResetSuccessDescription'),
            });
          } catch (error) {
            console.error("Reset password error:", error);
            setError(error instanceof Error ? error.message : "An unknown error occurred during password reset");
          }
          break;
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    let formContent;
    let showBackButton = true;
    let backButtonText = t('back');

    switch (authState) {
      case "signIn":
        showBackButton = false;
        formContent = (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('signIn')}
            </Button>
            <Button variant="link" onClick={() => changeAuthState("forgotPassword")}>{t('forgotPassword')}</Button>
            <Separator />
            <p>{t('dontHaveAccount')} <Button variant="link" onClick={() => changeAuthState("signUp")}>{t('signUp')}</Button></p>
          </>
        );
        break;

      case "signUp":
        backButtonText = t('backToSignIn');
        formContent = (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('signUp')}
            </Button>
            <Separator />
            <p>{t('alreadyHaveAccount')} <Button variant="link" onClick={() => changeAuthState("signIn")}>{t('signIn')}</Button></p>
          </>
        );
        break;

      case "confirmSignUp":
        backButtonText = t('backToSignUp');
        formContent = (
          <>
            <div className="space-y-2">
              <Label htmlFor="code">{t('confirmationCode')}</Label>
              <Input
                id="code"
                type="text"
                {...register("code")}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('confirm')}
            </Button>
          </>
        );
        break;

      case "forgotPassword":
        formContent = (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('resetPassword')}
            </Button>
          </>
        );
        break;

      case "resetPassword":
        formContent = (
          <>
            <div className="space-y-2">
              <Label htmlFor="code">{t('confirmationCode')}</Label>
              <Input
                id="code"
                type="text"
                {...register("code")}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${passwordFieldId}-new`}>{t('newPassword')}</Label>
              <Input
                id={`${passwordFieldId}-new`}
                type="password"
                {...register("newPassword")}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${passwordFieldId}-confirm`}>{t('confirmNewPassword')}</Label>
              <Input
                id={`${passwordFieldId}-confirm`}
                type="password"
                {...register("confirmNewPassword")}
                className={errors.confirmNewPassword ? "border-red-500" : ""}
              />
              {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('resetPassword')}
            </Button>
          </>
        );
        break;

      default:
        return null;
    }

    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formContent}
        </form>
        {showBackButton && (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="w-full"
          >
            {backButtonText}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto mt-4 sm:mt-8">
      {authState === "authenticated" ? (
        children
      ) : (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-background text-foreground rounded-lg shadow-md">
          <div className="flex justify-end space-x-2 mb-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {authState === "signIn" ? t('signIn') :
             authState === "signUp" ? t('signUp') :
             authState === "confirmSignUp" ? t('confirmSignUp') :
             authState === "forgotPassword" ? t('forgotPassword') :
             authState === "resetPassword" ? t('resetPassword') : ""}
          </h2>
          {renderForm()}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}