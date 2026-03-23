export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Module Migrator
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
            Seamlessly migrate your modules with confidence
          </p>
        </header>

        {/* Footer */}
        <footer className="py-16 mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Module Migrator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
