/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
      "./src/**/*.{html,js,vue,scss}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors:{
        "coordy-primary":"#171F35",
        "coordy-primary-text":"#FFF",
        "coordy-secondary":"#F9600A",
        "coordy-secondary-text":"#171F35",
        "coordy-accent":"#F9600A",
      }
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}
