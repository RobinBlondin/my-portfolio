/** @type {import('tailwindcss').Config} */

export const mode = "jit";

export const content = [
  "./src/**/*.{html,js,ts,jsx,ejs}",
  "./views/**/*.ejs"
];
export const theme = {
  extend: {
    backgroundImage: {
      'profile-pic': "url('images/profile.jpg')",
      'footer-texture': "url('/img/footer-texture.png')",
     }, 
     minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
     }
  },
};
export const plugins = [
  require('tailwind-scrollbar')({ nocompatible: true }),
];

