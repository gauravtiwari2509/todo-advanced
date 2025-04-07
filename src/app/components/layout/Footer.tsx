export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">TodoApp</h2>
            <p className="text-gray-400 text-sm">
              Organize your tasks with AI assistance
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Help
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TodoApp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
