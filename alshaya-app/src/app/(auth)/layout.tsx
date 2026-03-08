export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cyan">آل شايع</h1>
          <p className="mt-2 text-sm text-text-muted">Al-Shaya Family Tree</p>
        </div>
        {children}
      </div>
    </div>
  );
}
