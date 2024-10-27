"use client";

import React, { useState, useEffect } from 'react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { useTranslation } from '@/lib/translations';
import { Loader2 } from 'lucide-react';

export function FileManagement() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div>{t('userNotAuthenticated')}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('fileManagement')}</h2>
      <StorageManager
        acceptedFileTypes={['.pdf']}
        accessLevel="private"
        maxFileCount={10}
        path={`forms/${user.userId}/`}
        onUploadSuccess={(data) => {
          console.log('File uploaded successfully', data);
        }}
        onUploadError={(error) => {
          console.error('Error uploading file', error);
        }}
      />
    </div>
  );
}
