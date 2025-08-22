export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to My Kasbai</h1>
      </div>
      {children}
    </main>
  );
}
