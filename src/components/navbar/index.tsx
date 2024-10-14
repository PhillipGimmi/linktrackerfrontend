'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed left-[50%] top-8 z-50 flex w-fit -translate-x-[50%] items-center gap-6 rounded-lg border-[1px] border-neutral-700 bg-neutral-900 p-2 text-sm text-neutral-500">
      <Logo />
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/pricing">Pricing</NavLink>
      <JoinButton />
    </nav>
  );
}

const Logo = () => {
  return (
    <svg
      width="24"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-2 fill-neutral-50"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#000000"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#000000"
      ></path>
    </svg>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        className="block h-[20px] overflow-hidden"
        whileHover="hover"
      >
        <motion.div
          variants={{
            hover: { y: -20 }
          }}
          transition={{ ease: 'backInOut', duration: 0.5 }}
        >
          <span className="flex h-[20px] items-center">{children}</span>
          <span className="flex h-[20px] items-center text-neutral-50">
            {children}
          </span>
        </motion.div>
      </motion.a>
    </Link>
  );
};

const JoinButton = () => {
  return (
    <button
      className={`relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] border-neutral-700 px-4 py-1.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-neutral-50 before:transition-transform before:duration-1000 before:content-[""] hover:scale-105 hover:border-neutral-50 hover:text-neutral-900 hover:before:translate-y-[0%] active:scale-100`}
    >
      Join waitlist
    </button>
  );
};