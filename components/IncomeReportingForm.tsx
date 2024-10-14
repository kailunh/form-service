'use client'

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const translations = {
  en: {
    title: "Income Reporting Form",
    description: "Please fill out the following information to report your personal and business income.",
    personalInfo: "Personal Information",
    personalIncome: "Personal Income",
    businessIncome: "Business Income",
    firstName: "First Name",
    lastName: "Last Name",
    ssn: "Social Security Number",
    dateOfBirth: "Date of Birth",
    filingStatus: "Filing Status",
    address: "Address",
    city: "City",
    state: "State",
    zipCode: "ZIP Code",
    occupation: "Occupation",
    wages: "Wages, Salaries, Tips",
    interestIncome: "Interest Income",
    dividends: "Dividends",
    capitalGains: "Capital Gains",
    businessName: "Business Name",
    ein: "Employer Identification Number (EIN)",
    businessType: "Business Type",
    grossRevenue: "Gross Revenue",
    costOfGoodsSold: "Cost of Goods Sold",
    operatingExpenses: "Operating Expenses",
    netProfit: "Net Profit",
    submit: "Submit Income Report",
    selectFilingStatus: "Select filing status",
    single: "Single",
    marriedJoint: "Married Filing Jointly",
    marriedSeparate: "Married Filing Separately",
    headOfHousehold: "Head of Household",
    selectBusinessType: "Select business type",
    soleProprietorship: "Sole Proprietorship",
    partnership: "Partnership",
    corporation: "Corporation",
    llc: "Limited Liability Company (LLC)",
    selectState: "Select state",
    language: "Language",
  },
  zh: {
    title: "收入申报表",
    description: "请填写以下信息以申报您的个人和企业收入。",
    personalInfo: "个人信息",
    personalIncome: "个人收入",
    businessIncome: "企业收入",
    firstName: "名",
    lastName: "姓",
    ssn: "社会安全号码",
    dateOfBirth: "出生日期",
    filingStatus: "申报状态",
    address: "地址",
    city: "城市",
    state: "州",
    zipCode: "邮政编码",
    occupation: "职业",
    wages: "工资、薪金、小费",
    interestIncome: "利息收入",
    dividends: "股息",
    capitalGains: "资本利得",
    businessName: "企业名称",
    ein: "雇主识别号码 (EIN)",
    businessType: "企业类型",
    grossRevenue: "总收入",
    costOfGoodsSold: "销货成本",
    operatingExpenses: "运营费用",
    netProfit: "净利润",
    submit: "提交收入报告",
    selectFilingStatus: "选择申报状态",
    single: "单身",
    marriedJoint: "已婚联合申报",
    marriedSeparate: "已婚分开申报",
    headOfHousehold: "户主",
    selectBusinessType: "选择企业类型",
    soleProprietorship: "独资企业",
    partnership: "合伙企业",
    corporation: "公司",
    llc: "有限责任公司 (LLC)",
    selectState: "选择州",
    language: "语言",
  },
}

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
]

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "Invalid SSN format (e.g., 123-45-6789)"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  filingStatus: z.string().min(1, "Filing status is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  occupation: z.string().min(1, "Occupation is required"),
  wages: z.string().min(1, "Wages are required"),
  interestIncome: z.string().optional(),
  dividends: z.string().optional(),
  capitalGains: z.string().optional(),
  businessName: z.string().optional(),
  ein: z.string().regex(/^\d{2}-\d{7}$/, "Invalid EIN format (e.g., 12-3456789)").optional(),
  businessType: z.string().optional(),
  grossRevenue: z.string().optional(),
  costOfGoodsSold: z.string().optional(),
  operatingExpenses: z.string().optional(),
})

export function IncomeReportingForm() {
  const [language, setLanguage] = useState("en")
  const t = translations[language]

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ssn: "",
      dateOfBirth: "",
      filingStatus: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      occupation: "",
      wages: "",
      interestIncome: "",
      dividends: "",
      capitalGains: "",
      businessName: "",
      ein: "",
      businessType: "",
      grossRevenue: "",
      costOfGoodsSold: "",
      operatingExpenses: "",
    },
  })

  const onSubmit = (data) => {
    console.log("Form submitted:", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto p-4">
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">{t.title}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t.description}</CardDescription>
          <div className="flex justify-end">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.language} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">{t.personalInfo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="dark:text-white">{t.firstName}</Label>
                    <Input id="firstName" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="dark:text-white">{t.lastName}</Label>
                    <Input id="lastName" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="ssn"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="ssn" className="dark:text-white">{t.ssn}</Label>
                    <Input id="ssn" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.ssn && <p className="text-red-500">{errors.ssn.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="dark:text-white">{t.dateOfBirth}</Label>
                    <Input id="dateOfBirth" type="date" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="filingStatus"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="filingStatus" className="dark:text-white">{t.filingStatus}</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                        <SelectValue placeholder={t.selectFilingStatus} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">{t.single}</SelectItem>
                        <SelectItem value="marriedJoint">{t.marriedJoint}</SelectItem>
                        <SelectItem value="marriedSeparate">{t.marriedSeparate}</SelectItem>
                        <SelectItem value="headOfHousehold">{t.headOfHousehold}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.filingStatus && <p className="text-red-500">{errors.filingStatus.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="dark:text-white">{t.address}</Label>
                    <Input id="address" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="city" className="dark:text-white">{t.city}</Label>
                    <Input id="city" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="state" className="dark:text-white">{t.state}</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                        <SelectValue placeholder={t.selectState} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="dark:text-white">{t.zipCode}</Label>
                    <Input id="zipCode" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.zipCode && <p className="text-red-500">{errors.zipCode.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="dark:text-white">{t.occupation}</Label>
                    <Input id="occupation" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.occupation && <p className="text-red-500">{errors.occupation.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <Separator className="dark:bg-gray-600" />

          {/* Personal Income Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">{t.personalIncome}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="wages"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="wages" className="dark:text-white">{t.wages}</Label>
                    <Input id="wages" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.wages && <p className="text-red-500">{errors.wages.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="interestIncome"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="interestIncome" className="dark:text-white">{t.interestIncome}</Label>
                    <Input id="interestIncome" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.interestIncome && <p className="text-red-500">{errors.interestIncome.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="dividends"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dividends" className="dark:text-white">{t.dividends}</Label>
                    <Input id="dividends" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.dividends && <p className="text-red-500">{errors.dividends.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="capitalGains"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="capitalGains" className="dark:text-white">{t.capitalGains}</Label>
                    <Input id="capitalGains" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.capitalGains && <p className="text-red-500">{errors.capitalGains.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <Separator className="dark:bg-gray-600" />

          {/* Business Income Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">{t.businessIncome}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="businessName"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="dark:text-white">{t.businessName}</Label>
                    <Input id="businessName" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.businessName && <p className="text-red-500">{errors.businessName.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="ein"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="ein" className="dark:text-white">{t.ein}</Label>
                    <Input id="ein" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.ein && <p className="text-red-500">{errors.ein.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="dark:text-white">{t.businessType}</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                        <SelectValue placeholder={t.selectBusinessType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soleProprietorship">{t.soleProprietorship}</SelectItem>
                        <SelectItem value="partnership">{t.partnership}</SelectItem>
                        <SelectItem value="corporation">{t.corporation}</SelectItem>
                        <SelectItem value="llc">{t.llc}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.businessType && <p className="text-red-500">{errors.businessType.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="grossRevenue"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="grossRevenue" className="dark:text-white">{t.grossRevenue}</Label>
                    <Input id="grossRevenue" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.grossRevenue && <p className="text-red-500">{errors.grossRevenue.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="costOfGoodsSold"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="costOfGoodsSold" className="dark:text-white">{t.costOfGoodsSold}</Label>
                    <Input id="costOfGoodsSold" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.costOfGoodsSold && <p className="text-red-500">{errors.costOfGoodsSold.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="operatingExpenses"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="operatingExpenses" className="dark:text-white">{t.operatingExpenses}</Label>
                    <Input id="operatingExpenses" type="number" {...field} className="dark:bg-gray-700 dark:text-white" />
                    {errors.operatingExpenses && <p className="text-red-500">{errors.operatingExpenses.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">{t.submit}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}