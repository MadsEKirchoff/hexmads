import flowbite from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './src/**/*.{html,js,svelte,ts}',
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx,svelte}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx,svelte}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx,svelte}",
  './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
],
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
    },
  },
  plugins: [
    flowbite
    // require('flowbite/plugin')
  ],
};