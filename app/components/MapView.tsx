'use client'

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useMemo } from 'react'

type MapViewProps = {
  lat: number
  lng: number
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  overflow: 'hidden',
}

export default function MapView({ lat, lng }: MapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const center = useMemo(() => ({ lat, lng }), [lat, lng])

  if (loadError) return <div>No se pudo cargar el mapa</div>
  if (!isLoaded) return <div>Cargando mapa...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  )
}
