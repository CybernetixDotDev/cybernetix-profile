import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
export const config = {
  matcher: ['/dashboard', '/tasks', '/contribute'],
}

export default nextConfig;
