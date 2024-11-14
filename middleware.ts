import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import outputs from './amplify_outputs.json';

const runner = createServerRunner({
  config: outputs
});

const PUBLIC_PATHS = [
  '/',
  '/api',
  '/_next',
  '/static',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const isPublicPath = PUBLIC_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isPublicPath) {
    try {
      await runner.run(async () => {
        await getCurrentUser();
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/forms/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};