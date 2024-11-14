"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { useTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const client = generateClient<Schema>();

type Shareholder = {
  name: string;
  title: string;
  sharePercentage: string;
  nationality: string;
};

type FormData = {
  formType: string;
  companyName: string;
  ein: string;
  dateIncorporated: string;
  isInitialReturn: boolean;
  isFinalReturn: boolean;
  hasNameChanged: boolean;
  hasAddressChanged: boolean;
  shareholders: string;
  accountingMethod: string;
  naicsCode: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  owner: string | null;
} | null;

export function FormDetails(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<FormData>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFormData = useCallback(async () => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await client.models.IncomeReport.get({ id });
      setFormData(data as FormData);
    } catch (error) {
      console.error("Error fetching form data:", error);
      toast({
        title: t("errorFetchingForm"),
        description: error instanceof Error ? error.message : t("errorFetchingFormDescription"),
        variant: "destructive",
      });
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [params?.id, router, t]);

  useEffect(() => {
    void fetchFormData();
  }, [fetchFormData]);

  const handleBack = () => {
    void router.push("/dashboard");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!formData) {
    return <div>No form data available.</div>;
  }

  let shareholders: Shareholder[] = [];
  try {
    shareholders = JSON.parse(formData.shareholders);
  } catch (e) {
    console.error("Error parsing shareholders:", e);
  }

  return (
    <div className="space-y-6">
      <Button onClick={handleBack} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t("companyInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge variant="secondary">{formData.formType}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">{t("companyName")}</p>
              <p>{formData.companyName}</p>
            </div>
            <div>
              <p className="font-semibold">{t("ein")}</p>
              <p>{formData.ein}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">{t("address")}</p>
            <p>{formData.address}</p>
            <p>{`${formData.city}, ${formData.state} ${formData.zipCode}`}</p>
            <p>{formData.country}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("shareholders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shareholders.map((shareholder, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <p className="font-semibold">{t("shareholderName")}</p>
                    <p>{shareholder.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("shareholderTitle")}</p>
                    <p>{shareholder.title}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("sharePercentage")}</p>
                    <p>{shareholder.sharePercentage}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{t("nationality")}</p>
                    <p>{shareholder.nationality}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}