// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Si tienes archivos .mdx o cualquier otro tipo, asegúrate de añadirlos aquí también:
    // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ✨ AÑADE ESTA SECCIÓN `safelist` ✨
  safelist: [
    {
      pattern: /text-teal-(100|200|300|400|500|600|700|800|900)/,
      // Si usas variantes (ej. hover:text-teal-700), puedes añadirlas aquí:
      // variants: ['hover', 'focus'],
    },
    // Si en el futuro decides usar variables para fondos (ej. bg-${primaryColor}-...),
    // también podrías añadir un patrón para ellos:
    // {
    //   pattern: /bg-teal-(100|200|300|400|500|600|700|800|900)/,
    //   variants: ['hover', 'focus'],
    // },
  ],
  // ✨ FIN DE LA SECCIÓN A AÑADIR ✨
  theme: {
    extend: {
      // --- CAMBIO AQUÍ ---
      colors: {
        darkGray: '#4a4a4a', // Se ha añadido tu color personalizado
      },
      // ------------------
    },
  },
  plugins: [],
};