// app/components/Navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Home } from 'lucide-react'

// --- Importa y usa las mismas variables de color que en page.tsx ---
const primaryColor = 'teal'; // Color principal (ej. para botones, acentos)
const primaryColorShade = '700'; // Sombra específica para el primaryColor (ej. teal-700)
const cardBackgroundColor = 'white'; // Fondo para las tarjetas de contenido (aquí el fondo de la Navbar)
const strongTextColor = 'gray-900'; // Texto principal y títulos
const mutedTextColor = 'gray-600'; // Texto secundario
const borderColor = 'gray-200'; // Bordes y separadores
// --- Fin variables de color ---

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // La lista de ítems de navegación que pueden aparecer en la barra
  const allNavItems = [
    { label: 'Inicio', href: '/', icon: Home },
    // Puedes añadir otros ítems aquí si los necesitas en el futuro, por ejemplo:
    // { label: 'Experiencias', href: '/experiencias', icon: Globe },
    // { label: 'Acerca de', href: '/about', icon: Info },
  ]

  // Filtramos los ítems para no mostrar "Inicio" si ya estamos en la página de inicio
  const navItemsToShow = allNavItems.filter(item => {
    // Si el ítem es el de inicio (href es '/'), solo lo mostramos si NO estamos en la raíz.
    if (item.href === '/') {
      return pathname !== '/';
    }
    // Para cualquier otro ítem, lo mostramos siempre.
    return true;
  });

  return (
    <header className={`fixed top-0 left-0 right-0 bg-${cardBackgroundColor} shadow-sm border-b border-${borderColor} z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Título/Logo */}
        <div className="flex items-center space-x-2">
          {/* El logo y el texto "Valle de las Cascadas" son ahora un solo enlace a la página de inicio */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/mi-logo.png" // Asegúrate de que esta ruta sea correcta (tu logo debe estar en public/images/mi-logo.png)
              alt="Valle de las Cascadas Logo"
              width={40} // Ancho del logo en píxeles
              height={40} // Alto del logo en píxeles
              className="rounded-full object-cover" // Clases para hacer el logo redondo y que cubra el espacio
            />
            {/* El texto del título, con el color de la paleta principal (teal) */}
            <span className={`text-xl font-bold text-${primaryColor}-${primaryColorShade} hover:text-${primaryColor}-800 transition-colors duration-200 ml-2`}>
              Valle de las Cascadas
            </span>
          </Link>
          {/* Subtítulo/Eslogan, oculto en pantallas muy pequeñas */}
          <p className={`text-sm text-${mutedTextColor} ml-4 hidden sm:block`}>Experiencias campesinas</p>
        </div>

        {/* Botón móvil (Menú Hamburguesa) - Visible solo en pantallas pequeñas */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden text-${strongTextColor} hover:text-${primaryColor}-${primaryColorShade} transition-colors duration-200`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menú de navegación para escritorio - Visible solo en pantallas medianas y grandes */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItemsToShow.map((item) => {
            const IconComponent = item.icon; // Obtenemos el componente de ícono (ej. Home)
            return (
              <Link
                key={item.href}
                href={item.href}
                // ✨ CORRECCIÓN AQUÍ: SE ELIMINA LA CLASE 'block' para evitar el conflicto con 'flex' ✨
                className={`flex items-center text-${mutedTextColor} hover:text-${strongTextColor} focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 transition-all duration-200
                  ${pathname === item.href ? `font-semibold text-${strongTextColor} border-b-2 border-${primaryColor}-${primaryColorShade}` : ''}
                `}
              >
                {IconComponent && <IconComponent size={20} className={`mr-1 text-${primaryColor}-${primaryColorShade}`} />} {/* Renderiza el ícono */}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Menú de navegación para móvil (desplegable) - Visible solo cuando isOpen es true */}
      {isOpen && (
        <div className={`md:hidden px-4 pb-4 space-y-2 bg-${cardBackgroundColor} border-b border-${borderColor} shadow-inner`}>
          {navItemsToShow.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                // ✨ CORRECCIÓN AQUÍ: SE ELIMINA LA CLASE 'block' para evitar el conflicto con 'flex' ✨
                className={`flex items-center text-${strongTextColor} hover:bg-gray-100 py-2 px-3 rounded-md transition-colors duration-200
                  ${pathname === item.href ? `font-semibold bg-gray-100 text-${primaryColor}-${primaryColorShade}` : ''}
                `}
                onClick={() => setIsOpen(false)} // Cierra el menú móvil al hacer clic en un enlace
              >
                {IconComponent && <IconComponent size={20} className={`mr-2 text-${primaryColor}-${primaryColorShade}`} />}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  )
}