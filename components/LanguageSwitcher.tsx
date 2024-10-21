"use client";

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  console.log('Current language in LanguageSwitcher:', language);

  return (
    <Select 
      value={language} 
      onValueChange={(value) => {
        console.log('Language changed to:', value);
        setLanguage(value as Language);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="zh">中文 (Chinese)</SelectItem>
      </SelectContent>
    </Select>
  );
}
