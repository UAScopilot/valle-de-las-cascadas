// app/components/ExperienceCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Tag, Clock, Utensils, DollarSign } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'; // Importamos la función global de formateo de precio

// --- PALETA DE COLORES (COPIA CONSISTENTE) ---
// Estas variables se duplican aquí para que el componente sea autocontenido,
// pero idealmente podrían venir de un archivo de configuración centralizado.
const primaryColor = 'teal';
const primaryColorShade = '700';
const cardBackgroundColor = 'white';
const mutedTextColor = 'gray-600';
const strongTextColor = 'gray-900';
const borderColor = 'gray-200';
// --- FIN PALETA DE COLORES ---

// Interfaz que define las propiedades que espera el componente ExperienceCard.
// Las propiedades con '?' son opcionales y pueden ser undefined.
export interface ExperienceCardProps {
  name: string
  location: string
  image: string
  slug: string
  price: number | string | undefined | null // El precio puede ser número, cadena, undefined o null
  duration?: string // Opcional
  duration_type?: string // Opcional
  category?: string // Opcional
  includes_food?: string // Opcional (puede ser '0', '1', o cualquier otra cadena)
}

export default function ExperienceCard({
  name,
  location,
  image,
  slug,
  price,
  duration,
  duration_type,
  category,
  includes_food,
}: ExperienceCardProps) {

  // Usamos la función global para formatear el precio, manejando diferentes tipos de entrada.
  const displayPrice = formatPrice(price);

  return (
    // El componente Link de Next.js envuelve toda la tarjeta para hacerla clicable.
    // passHref asegura que el href se pase al elemento HTML subyacente.
    <Link href={`/experiences/${slug}`} passHref>
      <div
        className={`
          group // Permite aplicar estilos a elementos hijos al hacer hover sobre este div.
          relative
          bg-${cardBackgroundColor} // Fondo blanco para la tarjeta.
          rounded-xl // Bordes redondeados.
          shadow-md hover:shadow-lg // Sombra sutil que se expande al hacer hover.
          border border-${borderColor} // Borde sutil.
          overflow-hidden // Asegura que el contenido respete los bordes redondeados.
          h-full // Asegura que todas las tarjetas en un  tengan la misma altura.
          flex flex-col // Permite usar flexbox para organizar el contenido verticalmente.
          transition-all duration-300 ease-in-out // Transición suave para los efectos de hover.
          cursor-pointer // Indica que el elemento es clicable.
        `}
      >
        {/* Contenedor de la imagen, manteniendo una relación de aspecto 16:9. */}
        <div className="relative w-full aspect-video">
          <Image
            src={image}
            alt={name}
            fill // Hace que la imagen llene el contenedor.
            className="object-cover transition-transform duration-300 group-hover:scale-105" // Efecto de zoom en la imagen al hacer hover.
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Optimización para diferentes tamaños de pantalla.
            priority // Prioriza la carga de esta imagen para mejorar el LCP (Largest Contentful Paint).
          />
        </div>

        {/* Contenido de texto de la tarjeta. */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Nombre de la experiencia, limitado a dos líneas. */}
          <h2 className={`text-lg font-semibold text-${strongTextColor} mb-2 line-clamp-2`}>
            {name}
          </h2>

          {/* Bloque de información adicional con iconos. */}
          {/* El código actual solo tiene 'flex', lo cual es correcto para este layout. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 mb-3">
            {/* Ubicación */}
            <div className={`flex items-center text-${mutedTextColor}`}>
              <MapPin className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorShade}`} />
              <span>{location}</span>
            </div>

            {/* Categoría (solo se muestra si está definida) */}
            {category && (
              <div className={`flex items-center text-${mutedTextColor}`}>
                <Tag className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorShade}`} />
                <span>{category}</span>
              </div>
            )}

            {/* Duración (solo se muestra si duration y duration_type están definidos) */}
            {duration && duration_type && (
              <div className={`flex items-center text-${mutedTextColor}`}>
                <Clock className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorShade}`} />
                <span>{duration} {duration_type}</span>
              </div>
            )}

            {/* Incluye comida (solo se muestra si includes_food es '1') */}
            {includes_food === '1' && (
              <div className={`flex items-center text-${mutedTextColor}`}>
                <Utensils className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorShade}`} />
                <span>Incluye alimentación</span>
              </div>
            )}
          </div>

          {/* Sección del precio, empujada al final de la tarjeta. */}
          <div className={`mt-auto pt-3 border-t border-${borderColor} flex justify-between items-center`}>
            <p className={`text-xl font-bold text-${primaryColor}-${primaryColorShade}`}>
              {displayPrice}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
