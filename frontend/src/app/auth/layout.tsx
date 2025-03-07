

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            {children}
        </div>
    );
  }