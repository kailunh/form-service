import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    void checkAuth();
  }, [router]);

  return { isLoading, isAuthenticated };
}

export async function checkAuth() {
  try {
    const user = await getCurrentUser();
    return { isAuthenticated: true, user };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}