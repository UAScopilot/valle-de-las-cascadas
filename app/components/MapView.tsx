'use client'

import { useEffect, useRef } from 'react'
import { useLoadScript } from '@react-google-maps/api'

type MapViewProps = {
  lat: number
  lng: number
}

// ✅ Constante definida fuera del componente para evitar recreación del array
const libraries: ('marker')[] = ['marker']

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
}

export default function MapView({ lat, lng }: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const divRef = useRef<HTMLDivElement | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error(
      'Falta la clave de Google Maps: define NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local'
    )
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries, // ✅ array constante y estable
  })

  useEffect(() => {
    if (!isLoaded || !divRef.current || typeof google === 'undefined') return

    const latNum = Number(lat)
    const lngNum = Number(lng)

    const map = new google.maps.Map(divRef.current, {
      center: { lat: latNum, lng: lngNum },
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: 'hybrid',
      mapId: 'b112117f7115e38a4329bfc9',
    })

    mapRef.current = map

    const marker = new google.maps.Marker({
      map,
      position: { lat: latNum, lng: lngNum },
      title: 'Punto de encuentro',
      icon: {
        url: '/icons/marker.png',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40),
      },
    })

    return () => {
      marker.setMap(null)
    }
  }, [isLoaded, lat, lng])

  if (loadError) return <div>No se pudo cargar el mapa</div>
  if (!isLoaded) return <div>Cargando mapa...</div>

  return (
    <div
      ref={divRef}
      style={containerStyle}
      role="application"
      aria-label="Mapa de ubicación"
    />
  )
}
