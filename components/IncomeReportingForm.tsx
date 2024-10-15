"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from '@/lib/translations'

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
  const { t } = useTranslation()

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      <div className="bg-background  text-foreground p-6 rounded-t-lg">
        <h2 className="text-3xl font-bold">{t('title')}</h2>
        <p className="text-lg mt-2 opacity-80">{t('description')}</p>
      </div>
      
      <div className="bg-background text-foreground p-6 rounded-b-lg shadow-lg space-y-8">
        {/* Personal Information Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">{t('personalInfo')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={control} name="firstName" label={t('firstName')} />
            <FormField control={control} name="lastName" label={t('lastName')} />
            <FormField control={control} name="ssn" label={t('ssn')} />
            <FormField control={control} name="dateOfBirth" label={t('dateOfBirth')} type="date" />
            <FormField
              control={control}
              name="filingStatus"
              label={t('filingStatus')}
              type="select"
              options={[
                { value: "single", label: t('single') },
                { value: "marriedJoint", label: t('marriedJoint') },
                { value: "marriedSeparate", label: t('marriedSeparate') },
                { value: "headOfHousehold", label: t('headOfHousehold') },
              ]}
            />
            <FormField control={control} name="address" label={t('address')} />
            <FormField control={control} name="city" label={t('city')} />
            <FormField
              control={control}
              name="state"
              label={t('state')}
              type="select"
              options={states.map(state => ({ value: state, label: state }))}
            />
            <FormField control={control} name="zipCode" label={t('zipCode')} />
            <FormField control={control} name="occupation" label={t('occupation')} />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Personal Income Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">{t('personalIncome')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={control} name="wages" label={t('wages')} type="number" />
            <FormField control={control} name="interestIncome" label={t('interestIncome')} type="number" />
            <FormField control={control} name="dividends" label={t('dividends')} type="number" />
            <FormField control={control} name="capitalGains" label={t('capitalGains')} type="number" />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Business Income Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">{t('businessIncome')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={control} name="businessName" label={t('businessName')} />
            <FormField control={control} name="ein" label={t('ein')} />
            <FormField
              control={control}
              name="businessType"
              label={t('businessType')}
              type="select"
              options={[
                { value: "soleProprietorship", label: t('soleProprietorship') },
                { value: "partnership", label: t('partnership') },
                { value: "corporation", label: t('corporation') },
                { value: "llc", label: t('llc') },
              ]}
            />
            <FormField control={control} name="grossRevenue" label={t('grossRevenue')} type="number" />
            <FormField control={control} name="costOfGoodsSold" label={t('costOfGoodsSold')} type="number" />
            <FormField control={control} name="operatingExpenses" label={t('operatingExpenses')} type="number" />
          </div>
        </section>

        <div className="mt-8 bg-background  text-foreground">
          <Button type="submit" className="w-full text-lg py-6">{t('submit')}</Button>
        </div>
      </div>
    </form>
  )
}

function FormField({ control, name, label, type = "text", options = [] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            {type === "select" ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={name}
                type={type}
                {...field}
                className={error ? "border-red-500" : ""}
              />
            )}
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </>
        )}
      />
    </div>
  )
}