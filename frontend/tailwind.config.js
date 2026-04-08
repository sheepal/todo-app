/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // React 파일들을 감시하도록 설정
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}