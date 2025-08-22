import { AuthForm } from '@/components/auth-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <AuthForm mode="login" />
      <p className="text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold underline">
          Register
        </Link>
      </p>
    </div>
  );
}
