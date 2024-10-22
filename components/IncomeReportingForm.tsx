'use client';

import React, { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/translations';
import { toast } from '@/components/ui/use-toast';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { Loader2, ArrowLeft } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { countries } from '@/lib/countries';
import { naicsCodes } from '@/lib/naicsCodes';
import { states } from '@/lib/states';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import { getCurrentUser } from 'aws-amplify/auth';

Amplify.configure(outputs);
const client = generateClient<Schema>();

const formSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
  ein: z.string().min(1, { message: 'EIN is required' }),
  dateIncorporated: z
    .string()
    .min(1, { message: 'Date incorporated is required' }),
  isInitialReturn: z.boolean(),
  isFinalReturn: z.boolean(),
  hasNameChanged: z.boolean(),
  hasAddressChanged: z.boolean(),
  shareholders: z.array(
    z.object({
      name: z.string().min(1, { message: 'Shareholder name is required' }),
      title: z.string().min(1, { message: 'Shareholder title is required' }),
      sharePercentage: z
        .string()
        .min(1, { message: 'Share percentage is required' }),
      nationality: z.string().min(1, { message: 'Nationality is required' }),
    })
  ),
  accountingMethod: z
    .string()
    .min(1, { message: 'Accounting method is required' }),
  naicsCode: z.string().min(1, { message: 'NAICS code is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zipCode: z.string().min(1, { message: 'ZIP code is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
});

export function IncomeReportingForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => ({
      companyName: '',
      ein: '',
      dateIncorporated: '',
      isInitialReturn: false,
      isFinalReturn: false,
      hasNameChanged: false,
      hasAddressChanged: false,
      shareholders: [
        { name: '', title: '', sharePercentage: '', nationality: '' },
      ],
      accountingMethod: '',
      naicsCode: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }), [])
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shareholders',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (!client.models.IncomeReport) {
        throw new Error('IncomeReport model not found');
      }
            
      const res = await client.models.IncomeReport.create({
        ...data,
        shareholders: JSON.stringify(data.shareholders)
      },
      {
        authMode: 'userPool',
      }
    );

      toast({
        title: t('formSubmitted'),
        description: t('formSubmittedDescription'),
      });
      router.push('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t('formSubmissionError'),
        description: error.message || t('formSubmissionErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleCancel = () => {
    // Navigate back to the dashboard or previous page
    router.push('/');
  };

  return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
  <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('companyInformation')}</h2>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="companyName">{t('companyName')}</Label>
              <Input id="companyName" {...field} />
              {errors.companyName && (
                <p className="text-red-500 text-sm">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          )}
        />
         <div>
        <Label htmlFor="address">{t('address')}</Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">{t('city')}</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">{t('state')}</Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                options={states}
                value={field.value}
                onValueChange={field.onChange}
                placeholder={t('selectState')}
                emptyMessage={t('noStatesFound')}
              />
            )}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="zipCode">{t('zipCode')}</Label>
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.zipCode && (
          <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="country">{t('country')}</Label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              options={countries}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={t('selectCountry')}
              emptyMessage={t('noCountriesFound')}
            />
          )}
        />
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

        <Controller
          name="ein"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="ein">{t('ein')}</Label>
              <Input id="ein" {...field} />
              {errors.ein && (
                <p className="text-red-500 text-sm">{errors.ein.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="dateIncorporated"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="dateIncorporated">{t('dateIncorporated')}</Label>
              <Input id="dateIncorporated" type="date" {...field} />
              {errors.dateIncorporated && (
                <p className="text-red-500 text-sm">
                  {errors.dateIncorporated.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <Controller
          name="isInitialReturn"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isInitialReturn"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="isInitialReturn">{t('isInitialReturn')}</Label>
            </div>
          )}
        />
        <Controller
          name="isFinalReturn"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFinalReturn"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="isFinalReturn">{t('isFinalReturn')}</Label>
            </div>
          )}
        />
        <Controller
          name="hasNameChanged"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasNameChanged"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="hasNameChanged">{t('hasNameChanged')}</Label>
            </div>
          )}
        />
        <Controller
          name="hasAddressChanged"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAddressChanged"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="hasAddressChanged">
                {t('hasAddressChanged')}
              </Label>
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('shareholders')}</h2>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 mb-4">
            <Controller
              name={`shareholders.${index}.name`}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor={`shareholderName${index}`}>
                    {t('shareholderName')}
                  </Label>
                  <Input id={`shareholderName${index}`} {...field} />
                  {errors.shareholders?.[index]?.name && (
                    <p className="text-red-500 text-sm">
                      {errors.shareholders[index].name.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name={`shareholders.${index}.title`}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor={`shareholderTitle${index}`}>
                    {t('shareholderTitle')}
                  </Label>
                  <Input id={`shareholderTitle${index}`} {...field} />
                  {errors.shareholders?.[index]?.title && (
                    <p className="text-red-500 text-sm">
                      {errors.shareholders[index].title.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name={`shareholders.${index}.sharePercentage`}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor={`sharePercentage${index}`}>
                    {t('sharePercentage')}
                  </Label>
                  <Input id={`sharePercentage${index}`} {...field} />
                  {errors.shareholders?.[index]?.sharePercentage && (
                    <p className="text-red-500 text-sm">
                      {errors.shareholders[index].sharePercentage.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name={`shareholders.${index}.nationality`}
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor={`shareholders.${index}.nationality`}>
                    {t('nationality')}
                  </Label>
                  <SearchableSelect
                    options={countries}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('selectNationality')}
                    emptyMessage={t('noCountriesFound')}
                  />
                  {errors.shareholders?.[index]?.nationality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shareholders[index].nationality.message}
                    </p>
                  )}
                </div>
              )}
            />
            {index > 0 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                {t('removeShareholder')}
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({
              name: '',
              title: '',
              sharePercentage: '',
              nationality: '',
            })
          }
        >
          {t('addShareholder')}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('accountingMethod')}</h2>
        <Controller
          name="accountingMethod"
          control={control}
          render={({ field }) => (
            <div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectAccountingMethod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashMethod">{t('cashMethod')}</SelectItem>
                  <SelectItem value="accrualMethod">{t('accrualMethod')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.accountingMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.accountingMethod.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <Label htmlFor="naicsCode">{t('naicsCode')}</Label>
        <Controller
          name="naicsCode"
          control={control}
          render={({ field }) => (
            <ErrorBoundary>
              <SearchableSelect
                options={naicsCodes}
                value={field.value}
                onValueChange={(value) => {
                  console.log('NAICS code changed:', value);
                  field.onChange(value);
                }}
                placeholder={t('selectNaicsCode')}
                emptyMessage={t('noCodesFound')}
              />
            </ErrorBoundary>
          )}
        />
        {errors.naicsCode && (
          <p className="text-red-500 text-sm mt-1">
            {errors.naicsCode.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submitForm')
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
