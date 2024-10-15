"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslation } from '@/lib/translations'
import { MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function GlobalHeader({ signOut }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t, language, changeLanguage } = useTranslation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Income Reporting System</h1>
          
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4">
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
              />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <Label htmlFor="theme-toggle" className="sr-only">
                {t('theme')}
              </Label>
            </div>

            <Button onClick={signOut} variant="outline">{t('signOut')}</Button>
          </div>
        </div>
      </div>
    </header>
  )
}