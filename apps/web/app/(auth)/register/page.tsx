import { AuthForm } from '@/components/auth-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <AuthForm mode="register" />
      <p className="text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold underline">
          Login
        </Link>
      </p>
    </div>
  );
}
