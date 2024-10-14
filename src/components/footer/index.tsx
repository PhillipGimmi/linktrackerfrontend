// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="w-full bg-gray-900 text-gray-400 p-4 flex justify-center">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </footer>
    );
  }
  