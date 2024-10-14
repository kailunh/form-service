'use client'

import { useState } from "react"
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
  },
}

export function IncomeReportingForm() {
  const [language, setLanguage] = useState("en")
  const t = translations[language]

  const [formData, setFormData] = useState({
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
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Implement form submission logic here
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4">
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">{t.title}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">{t.personalInfo}</h3>
            {/* Add input fields for personal information */}
          </div>

          <Separator className="dark:bg-gray-600" />

          {/* Personal Income Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">{t.personalIncome}</h3>
            {/* Add input fields for personal income */}
          </div>

          <Separator className="dark:bg-gray-600" />

          {/* Business Income Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">{t.businessIncome}</h3>
            {/* Add input fields for business income */}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">{t.submit}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}