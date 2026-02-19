import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

function timingSafeEqualString(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBuf = encoder.encode(a);
  const bBuf = encoder.encode(b);
  if (aBuf.length !== bBuf.length) return false;
  let result = 0;
  for (let i = 0; i < aBuf.length; i++) result |= aBuf[i] ^ bBuf[i];
  return result === 0;
}

export function middleware(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // Skip auth if credentials not configured (e.g. local dev without env vars)
  if (!user || !password) return NextResponse.next();

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Basic ')) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colon = decoded.indexOf(':');
      if (colon !== -1) {
        const u = decoded.slice(0, colon);
        const p = decoded.slice(colon + 1);
        if (
          timingSafeEqualString(u, user) &&
          timingSafeEqualString(p, password)
        ) {
          return NextResponse.next();
        }
      }
    } catch {
      // Invalid Base64, fall through to 401
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
}
