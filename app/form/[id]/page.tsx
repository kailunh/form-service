"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { useTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import outputs from "@/amplify_outputs.json";
import { toast } from "@/components/ui/use-toast";

Amplify.configure(outputs);
const client = generateClient<Schema>();

type Shareholder = {
  name: string;
  title: string;
  sharePercentage: string;
  nationality: string;
};

// Define a more specific type for the form data
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

export default function FormPage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<FormData>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
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
          description:
            error instanceof Error
              ? error.message === "Unauthorized access"
                ? t("unauthorizedAccess")
                : t("errorFetchingFormDescription")
              : t("errorFetchingFormDescription"),
          variant: "destructive",
        });
        void router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFormData();
  }, [params?.id, router, t, client.models.IncomeReport]);

  const handleBack = () => {
    void router.push("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!formData) {
    return <div>No form data available.</div>;
  }

  let shareholders: Shareholder[] = [];
  try {
    shareholders = JSON.parse(formData.shareholders) || [];
  } catch (e) {
    console.error("Error parsing shareholders:", e);
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="container mx-auto p-4">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>
        <h1 className="text-2xl font-bold mb-6">{t("formDetails")}</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              {t("formInformation")}
            </h2>
            <p>
              <strong>{t("formType")}:</strong> {formData.formType}
            </p>
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold">
              {t("companyInformation")}
            </h2>
            <p>
              <strong>{t("companyName")}:</strong> {formData.companyName}
            </p>
            <p>
              <strong>{t("ein")}:</strong> {formData.ein}
            </p>
            <p>
              <strong>{t("dateIncorporated")}:</strong>{" "}
              {formData.dateIncorporated}
            </p>
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold">
              {t("additionalInformation")}
            </h2>
            <p>
              <strong>{t("isInitialReturn")}:</strong>{" "}
              {formData.isInitialReturn ? t("yes") : t("no")}
            </p>
            <p>
              <strong>{t("isFinalReturn")}:</strong>{" "}
              {formData.isFinalReturn ? t("yes") : t("no")}
            </p>
            <p>
              <strong>{t("hasNameChanged")}:</strong>{" "}
              {formData.hasNameChanged ? t("yes") : t("no")}
            </p>
            <p>
              <strong>{t("hasAddressChanged")}:</strong>{" "}
              {formData.hasAddressChanged ? t("yes") : t("no")}
            </p>
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold">{t("shareholders")}</h2>
            {shareholders.map((shareholder, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>{t("shareholderName")}:</strong> {shareholder.name}
                </p>
                <p>
                  <strong>{t("shareholderTitle")}:</strong> {shareholder.title}
                </p>
                <p>
                  <strong>{t("sharePercentage")}:</strong>{" "}
                  {shareholder.sharePercentage}
                </p>
                <p>
                  <strong>{t("nationality")}:</strong>{" "}
                  {shareholder.nationality}
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-semibold">{t("otherDetails")}</h2>
            <p>
              <strong>{t("accountingMethod")}:</strong>{" "}
              {formData.accountingMethod}
            </p>
            <p>
              <strong>{t("naicsCode")}:</strong> {formData.naicsCode}
            </p>
            <p>
              <strong>{t("address")}:</strong> {formData.address}
            </p>
            <p>
              <strong>{t("city")}:</strong> {formData.city}
            </p>
            <p>
              <strong>{t("state")}:</strong> {formData.state}
            </p>
            <p>
              <strong>{t("zipCode")}:</strong> {formData.zipCode}
            </p>
            <p>
              <strong>{t("country")}:</strong> {formData.country}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
