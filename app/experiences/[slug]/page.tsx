// app/experience/[slug]/page.tsx
'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useExperiences } from '@/app/contexts/ExperiencesContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import {
  ChevronLeft, ChevronRight, Clock, Utensils, Users, CalendarDays,
  Languages, MapPin, XCircle, UtensilsCrossed, CheckCircle, UserCircle, Tag, Map,
  LucideIcon
} from 'lucide-react'

// Importa las interfaces desde lib/getFirebaseInfo.ts
import { InfoItem, ExperienceInfoReference, GroupedInfo } from '@/lib/getFirebaseInfo';

// Mapeo de nombres de iconos a componentes de Lucide.
const iconMap: Record<string, LucideIcon> = {
  language: Languages,
  my_location: MapPin,
  cancel: XCircle,
  restaurant: UtensilsCrossed,
  check: CheckCircle,
  // Añadir nuevos iconos si los usas en z_btc_info que no estén ya
  // Por ejemplo, si tienes 'map' para ubucaciones
  map: Map,
  // ... otros iconos
};


export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const { experiences, allInfoData, loading } = useExperiences()

  if (loading) return <p className="p-4 text-gray-600">Cargando experiencia.</p>

  const experience = experiences.find((exp) => exp.slug === params.slug);
  if (!experience) return notFound();

  // Pre-procesamiento de datos
  const attractionCards = Object.values(experience.attraction_cards || {});
  const expectationImages = Object.values(experience.expectation_images || {});
  const pricePerPerson = `$${experience.price.toLocaleString('es-CO')} por persona`;

  const planSteps = Object.values(experience.plan || {}).sort((a, b) =>
    parseInt(a.order as string) - parseInt(b.order as string)
  );

  const whatsappUrl = `https://wa.me/573007598533?text=Hola,%20quiero%20reservar%20la%20experiencia%20${encodeURIComponent(
    experience.name
  )}`;

  // Lógica para la sección de Información Adicional (similar a como lo tenías)
  const additionalInfo: GroupedInfo[] = [];
  // También para extraer los idiomas específicamente
  const languagesSpoken: string[] = [];

  if (experience.info) {
    const relevantInfoItems: InfoItem[] = [];

    for (const infoKey in experience.info) {
      const infoRef = experience.info[infoKey];
      const detail = allInfoData[infoRef.info_id];
      if (detail) {
        relevantInfoItems.push(detail);
        // Extraer idiomas si el main_id corresponde a idiomas (ej. 'languages')
        if (detail.main_id === 'languages') { // Asume que 'languages' es el main_id para los idiomas
          languagesSpoken.push(detail.product_info);
        }
      }
    }

    const grouped: { [title: string]: GroupedInfo } = {};

    relevantInfoItems.forEach(item => {
      // Excluir específicamente los ítems de idioma de la sección "Información Adicional" si ya los manejamos aparte
      if (item.main_id === 'languages') return;

      if (!grouped[item.product_info_title]) {
        grouped[item.product_info_title] = {
          title: item.product_info_title,
          order: parseInt(item.order),
          items: [],
        };
      }
      const IconComponent = iconMap[item.icon];
      if (IconComponent) {
        grouped[item.product_info_title].items.push({
          icon: IconComponent,
          product_info: item.product_info,
          item_order: parseInt(item.item_order),
        });
      } else {
        console.warn(`Icono '${item.icon}' no encontrado en iconMap para el título: '${item.product_info_title}'`);
      }
    });

    for (const title in grouped) {
      grouped[title].items.sort((a, b) => a.item_order - b.item_order);
      additionalInfo.push(grouped[title]);
    }
    additionalInfo.sort((a, b) => a.order - b.order);
  }

  return (
    <div className="relative min-h-screen pb-20 bg-gray-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
        {/* Columna principal (8/12 en pantallas grandes) */}
        <div className="xl:col-span-8 overflow-x-hidden">

          {/* Sección 1: Imagen Principal y Título/Precio/Descripción Breve */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] xl:h-[480px] 2xl:h-[560px] rounded-xl overflow-hidden shadow-md">
            <Image
              src={experience.image}
              alt={experience.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="w-full space-y-8 mt-8 p-4 bg-white rounded-xl shadow-sm">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              {experience.name}
            </h1>
            <p className="text-2xl font-bold text-green-700 mt-0">{pricePerPerson}</p>

            {/* Sección 2: Información Básica (Badges/Fichas) */}
            <div className="flex flex-wrap items-center gap-4 text-gray-700">
              {experience.zone_state && (
                <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  <span>Ubicación: {experience.zone_state}</span>
                </div>
              )}
              {experience.category && (
                <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Tag className="h-5 w-5 mr-2 text-green-600" />
                  <span>Experiencia: {experience.category}</span>
                </div>
              )}
              {experience.duration && experience.duration_type && (
                <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  <span>
                    Duración: {experience.duration} {experience.duration_type}
                  </span>
                </div>
              )}
              {languagesSpoken.length > 0 && (
                <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Languages className="h-5 w-5 mr-2 text-green-600" />
                  <span>Se habla: {languagesSpoken.join(', ')}</span>
                </div>
              )}
              {experience.includes_food === '1' && (
                <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Utensils className="h-5 w-5 mr-2 text-green-600" />
                  <span>Incluye comida</span>
                </div>
              )}
              {experience.maximum_visitors && (
                <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  <span>Máximo {experience.maximum_visitors} personas</span>
                </div>
              )}
              {/* Nuevo elemento "Guía local" */}
              <div className="flex items-center text-lg bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                <UserCircle className="h-5 w-5 mr-2 text-green-600" />
                <span>Guía local</span>
              </div>
            </div>

            {/* Sección 3: Razones para elegir (Attraction Cards) */}
            {attractionCards.length > 0 && (
              <div className="relative mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-6">
                  ¡{attractionCards.length} Razones para elegir esta experiencia!
                </h3>

                <div className="relative">
                  {/* Controles de navegación de Swiper */}
                  <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                    <div className="swiper-button-prev-1 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                      <ChevronLeft className="w-7 h-7" />
                    </div>
                    <div className="swiper-button-next-1 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                      <ChevronRight className="w-7 h-7" />
                    </div>
                  </div>

                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={{
                      nextEl: '.swiper-button-next-1',
                      prevEl: '.swiper-button-prev-1',
                    }}
                    spaceBetween={20}
                    loop={true}
                    slidesPerView={1}
                    grabCursor={true}
                    className="w-full"
                  >
                    {attractionCards.map((card, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="bg-white border border-gray-200 h-[280px] sm:h-[320px] lg:h-[380px] xl:h-[400px] 2xl:h-[480px] font-semibold px-8 py-10 text-center text-gray-800 text-2xl flex items-center justify-center rounded-xl shadow-sm">
                          {card.reason}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}

            {/* Sección 4: Lo que encontrarás (Expectation Images - Galería) */}
            {expectationImages.length > 0 && (
              <div className="mt-12 p-4 bg-white rounded-xl shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                  Lo que encontrarás
                </h2>

                <div className="relative">
                  {/* Controles de navegación de Swiper */}
                  <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                    <div className="swiper-button-prev-2 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                      <ChevronLeft className="w-7 h-7" />
                    </div>
                    <div className="swiper-button-next-2 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                      <ChevronRight className="w-7 h-7" />
                    </div>
                  </div>

                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={{
                      nextEl: '.swiper-button-next-2',
                      prevEl: '.swiper-button-prev-2',
                    }}
                    spaceBetween={16}
                    loop={true}
                    slidesPerView={1}
                    grabCursor={true}
                    className="w-full"
                  >
                    {expectationImages.map((item, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="relative h-[280px] sm:h-[320px] lg:h-[380px] xl:h-[400px] 2xl:h-[480px] rounded-xl overflow-hidden shadow-md">
                          <Image
                            src={item.image}
                            alt={`expectation-${idx}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}

            {/* Sección 5: Expectations */}
            {experience.expectations && (
              <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Qué puedes esperar</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{experience.expectations}</p>
              </div>
            )}

            {/* Sección 6: Plan de Experiencia / Itinerario */}
            {planSteps.length > 0 && (
                <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Tu Plan de Experiencia</h2>
                    <ol className="relative border-s border-gray-200 ml-4 md:ml-0">
                        {planSteps.map((step, idx) => (
                            <li key={idx} className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-8 ring-white">
                                    <CalendarDays className="w-4 h-4 text-gray-600" />
                                </span>
                                <h3 className="flex items-center mb-1 text-xl font-semibold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="mb-4 text-lg font-normal text-gray-700">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Sección 7: ¿Dónde nos encontraremos? (Punto de Encuentro y Mapa) */}
            {(experience.meeting_point || experience.meeting_point_latitude || experience.meeting_point_longitude) && (
              <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">¿Dónde nos encontraremos?</h2>
                {experience.meeting_point && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Punto de Encuentro:</h3>
                    <p className="text-gray-700 text-lg">{experience.meeting_point}</p>
                    {experience.meeting_point_details && (
                      <p className="text-gray-600 text-base mt-1 italic">{experience.meeting_point_details}</p>
                    )}
                    {experience.meeting_time && (
                      <p className="text-gray-600 text-base mt-1">Hora de Encuentro: {experience.meeting_time}</p>
                    )}
                  </div>
                )}
                {(experience.meeting_point_latitude || experience.meeting_point_longitude) ? (
                  <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden h-64 flex items-center justify-center bg-gray-50 text-gray-500">
                    {/* Placeholder para el mapa. Aquí integrarías un componente de mapa real como Google Maps o Leaflet */}
                    <p className="text-center text-lg">
                      Mapa del punto de encuentro ({experience.meeting_point_latitude}, {experience.meeting_point_longitude})
                    </p>
                    {/* Ejemplo de cómo podrías integrar un mapa: */}
                    {/* <GoogleMapReact
                      bootstrapURLKeys={{ key: "YOUR_Maps_API_KEY" }}
                      defaultCenter={{ lat: experience.meeting_point_latitude, lng: experience.meeting_point_longitude }}
                      defaultZoom={15}
                    >
                      <AnyReactComponent
                        lat={experience.meeting_point_latitude}
                        lng={experience.meeting_point_longitude}
                        text="Punto de Encuentro"
                      />
                    </GoogleMapReact> */}
                  </div>
                ) : (
                  <p className="mt-4 text-gray-600 text-base">Coordenadas del mapa no disponibles.</p>
                )}
              </div>
            )}

            {/* Sección 8: Información Adicional (detalles de z_btc_info) */}
            {additionalInfo.length > 0 && (
              <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Información Adicional</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  {additionalInfo.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        {group.title}
                      </h3>
                      <ul className="space-y-2">
                        {group.items.map((item, itemIdx) => {
                          const IconComponent = item.icon;
                          return (
                            <li key={itemIdx} className="flex items-start text-gray-700 text-lg">
                              <IconComponent className="flex-shrink-0 w-5 h-5 mr-3 text-green-600 mt-1" />
                              <span>{item.product_info}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sección 9: Políticas de cancelación provisional */}
            <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Políticas de cancelación</h2>
              <p className="text-gray-700 text-lg">
                Aquí irán las políticas de cancelación de la experiencia. Puedes personalizar este texto más adelante.
                Por ejemplo: "Cancelación gratuita hasta 24 horas antes del inicio de la actividad. Pasado este tiempo, no se ofrecerá reembolso."
              </p>
            </div>

            {/* Sección 10: Preguntas y respuestas provisional */}
            <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Preguntas y respuestas</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">¿Es apto para niños?</h3>
                  <p className="text-gray-700 text-lg">Depende de la experiencia. Consulta los detalles o contáctanos para más información.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">¿Qué debo llevar?</h3>
                  <p className="text-gray-700 text-lg">Se recomienda llevar ropa cómoda, calzado adecuado para caminar, protector solar y una botella de agua.</p>
                </div>
                {/* Puedes añadir más preguntas y respuestas aquí */}
              </div>
            </div>

          </div> {/* Fin del bloque de contenido principal */}
        </div> {/* Fin de la columna principal */}

        {/* Sidebar Fijo (para pantallas grandes) */}
        <aside className="hidden xl:block fixed top-28 right-[calc((100vw-1280px)/2)] w-[380px] bg-white rounded-xl shadow-lg p-6 h-fit z-30 border border-gray-200">
          <div className="text-2xl font-bold text-green-700 mb-5">Reserva tu experiencia</div>
          <p className="text-xl text-gray-800 font-bold mb-4">{pricePerPerson}</p>

          <label htmlFor="date" className="block text-base font-medium text-gray-700 mb-2">Fecha</label>
          <input
            id="date"
            type="date"
            className="w-full border border-gray-300 rounded-lg p-3 mb-5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />

          <label htmlFor="time" className="block text-base font-medium text-gray-700 mb-2">Hora</label>
          <select
            id="time"
            className="w-full border border-gray-300 rounded-lg p-3 mb-5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            <option>10:00 AM</option>
            <option>2:00 PM</option>
            <option>5:00 PM</option>
          </select>

          <label htmlFor="people" className="block text-base font-medium text-gray-700 mb-2">Personas</label>
          <select
            id="people"
            className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            <option>1 Adulto</option>
            <option>2 Adultos</option>
            <option>3 Adultos</option>
            <option>4 Adultos</option>
            <option>5+ Adultos</option>
          </select>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-600 text-white text-xl font-bold px-6 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Reservar Experiencia
          </a>
        </aside>

        {/* Botón fijo solo visible en móvil */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 xl:hidden z-50 shadow-lg">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-600 text-white text-lg font-bold py-3 rounded-xl hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md"
          >
            Reservar Experiencia
          </a>
        </div>
      </div>
    </div>
  )
}