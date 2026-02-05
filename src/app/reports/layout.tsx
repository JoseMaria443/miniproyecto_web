export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="w-full px-6 py-12">{children}</div>
    </main>
  );
}
