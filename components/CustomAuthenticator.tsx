'use client'

import { useState, useEffect } from "react"
import { Amplify, Auth } from 'aws-amplify'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import awsconfig from '../src/aws-exports'

Amplify.configure({ ...awsconfig, ssr: true })

const translations = {
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    confirmPassword: "Confirm Password",
    confirmSignUp: "Confirm Sign Up",
    submit: "Submit",
    confirmationCode: "Confirmation Code",
    resendCode: "Resend Code",
    backToSignIn: "Back to Sign In",
    theme: "Theme",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    resetPassword: "Reset Password",
  },
  zh: {
    signIn: "登录",
    signUp: "注册",
    email: "电子邮件",
    password: "密码",
    forgotPassword: "忘记密码？",
    confirmPassword: "确认密码",
    confirmSignUp: "确认注册",
    submit: "提交",
    confirmationCode: "确认码",
    resendCode: "重新发送验证码",
    backToSignIn: "返回登录",
    theme: "主题",
    dontHaveAccount: "还没有账户？",
    alreadyHaveAccount: "已经有账户？",
    resetPassword: "重置密码",
  }
}

export function CustomAuthenticator({ children }) {
  const [language, setLanguage] = useState("en")
  const { theme, setTheme } = useTheme()
  const t = translations[language]
  const [authState, setAuthState] = useState("signIn")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser()
      setUser(userData)
      setAuthState("authenticated")
    } catch (err) {
      setUser(null)
      setAuthState("signIn")
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const user = await Auth.signIn(email, password)
      setUser(user)
      setAuthState("authenticated")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      await Auth.signUp({ username: email, password })
      setAuthState("confirmSignUp")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleConfirmSignUp = async (e) => {
    e.preventDefault()
    try {
      await Auth.confirmSignUp(email, code)
      setAuthState("signIn")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      await Auth.forgotPassword(email)
      setAuthState("resetPassword")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      await Auth.forgotPasswordSubmit(email, code, password)
      setAuthState("signIn")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await Auth.signOut()
      setUser(null)
      setAuthState("signIn")
    } catch (error) {
      setError(error.message)
    }
  }

  const renderAuthForm = () => {
    switch (authState) {
      case "signIn":
        return (
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t.signIn}</Button>
              <Button variant="link" onClick={() => setAuthState("forgotPassword")}>{t.forgotPassword}</Button>
              <Separator />
              <p>{t.dontHaveAccount} <Button variant="link" onClick={() => setAuthState("signUp")}>{t.signUp}</Button></p>
            </CardFooter>
          </form>
        )
      case "signUp":
        return (
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t.signUp}</Button>
              <Separator />
              <p>{t.alreadyHaveAccount} <Button variant="link" onClick={() => setAuthState("signIn")}>{t.signIn}</Button></p>
            </CardFooter>
          </form>
        )
      case "confirmSignUp":
        return (
          <form onSubmit={handleConfirmSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t.confirmationCode}</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t.confirmSignUp}</Button>
              <Button variant="link" onClick={() => setAuthState("signIn")}>{t.backToSignIn}</Button>
            </CardFooter>
          </form>
        )
      case "forgotPassword":
        return (
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t.resetPassword}</Button>
              <Button variant="link" onClick={() => setAuthState("signIn")}>{t.backToSignIn}</Button>
            </CardFooter>
          </form>
        )
      case "resetPassword":
        return (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t.confirmationCode}</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t.password}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t.submit}</Button>
              <Button variant="link" onClick={() => setAuthState("signIn")}>{t.backToSignIn}</Button>
            </CardFooter>
          </form>
        )
      case "authenticated":
        return children({ signOut: handleSignOut, user })
      default:
        return null
    }
  }

  if (!mounted) return null

  return (
    <Card className="w-full max-w-md mx-auto mt-8 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold dark:text-white">
          {authState === "signIn" ? t.signIn :
           authState === "signUp" ? t.signUp :
           authState === "confirmSignUp" ? t.confirmSignUp :
           authState === "forgotPassword" ? t.forgotPassword :
           authState === "resetPassword" ? t.resetPassword : ""}
        </CardTitle>
      </CardHeader>
      {renderAuthForm()}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="theme-toggle" className="dark:text-white">{t.theme}</Label>
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
          />
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}