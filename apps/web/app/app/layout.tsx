// This layout wraps pages inside the protected /app route
export default function AppLayout({ children }: { children: React.ReactNode }) {
  // In a real app, you'd fetch user data here or in a provider
  const user = { email: 'user@example.com' };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">My Kasbai</h1>
          <div className="flex items-center space-x-4">
            <span>{user.email}</span>
            <button className="text-sm font-medium hover:underline">Logout</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
