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

import { InfoItem, ExperienceInfoReference, GroupedInfo } from '@/lib/getFirebaseInfo';

// --- NUEVA CONFIGURACIÓN DE COLORES SOBRIA Y ELEGANTE ---
const primaryColor = 'teal'; // Color principal (ej. para botones, acentos)
const primaryColorShade = '700'; // Sombra específica para el primaryColor (ej. teal-700)
const primaryColorTextShade = '700'; // Sombra para el texto/iconos del color principal

const backgroundColor = 'gray-50'; // Fondo general muy claro
const cardBackgroundColor = 'white'; // Fondo para las tarjetas de contenido
const mutedTextColor = 'gray-600'; // Texto secundario
const strongTextColor = 'gray-900'; // Texto principal y títulos
const borderColor = 'gray-200'; // Bordes y separadores

// Colores para las tarjetas de "Razones para elegir"
const attractionCardBackgroundColor = `${primaryColor}-${primaryColorShade}`; // Será 'teal-700'
const attractionCardTextColor = 'white'; // Texto blanco sobre fondo oscuro
// --- FIN NUEVA CONFIGURACIÓN DE COLORES ---


const iconMap: Record<string, LucideIcon> = {
  language: Languages,
  my_location: MapPin,
  cancel: XCircle,
  restaurant: UtensilsCrossed,
  check: CheckCircle,
  map: Map,
  // Asegúrate de añadir aquí cualquier otro icono que uses en 'z_btc_info'
};


export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const { experiences, allInfoData, loading } = useExperiences()

  if (loading) return <p className={`p-4 text-${mutedTextColor}`}>Cargando experiencia.</p>

  const experience = experiences.find((exp) => exp.slug === params.slug);
  if (!experience) return notFound();

  // Pre-procesamiento de datos
  const attractionCards = Object.values(experience.attraction_cards || {});
  const expectationImages = Object.values(experience.expectation_images || {});
  const pricePerPerson = `$${experience.price.toLocaleString('es-CO')} por persona`;

  const planSteps = Object.values(experience.plan || {})
    .sort((a, b) => parseInt(a.order as string) - parseInt(b.order as string));

  const whatsappUrl = `https://wa.me/573007598533?text=Hola,%20quiero%20reservar%20la%20experiencia%20${encodeURIComponent(
    experience.name
  )}`;

  // Lógica para la sección de Información Adicional (similar a como lo tenías)
  const additionalInfo: GroupedInfo[] = [];
  const languagesSpoken: string[] = [];

  if (experience.info) {
    const relevantInfoItems: InfoItem[] = [];

    for (const infoKey in experience.info) {
      const infoRef = experience.info[infoKey];
      const detail = allInfoData?.[infoRef?.["info_id"]]; // Acceso seguro con ?.
      if (detail) {
        relevantInfoItems.push(detail);
        if (detail.main_id === 'languages') {
          languagesSpoken.push(detail.product_info);
        }
      }
    }

    const grouped: { [title: string]: GroupedInfo } = {};

    relevantInfoItems.forEach(item => {
      if (item.main_id === 'languages') return;

      if (!grouped?.[item.product_info_title]) { // Acceso seguro con ?.
        grouped[item.product_info_title] = {
          title: item.product_info_title,
          order: parseInt(item.order),
          items: [],
        };
      }
      const IconComponent = iconMap?.[item.icon]; // Acceso seguro con ?.
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
    <div className={`relative min-h-screen pb-20 bg-${backgroundColor} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
        {/* Columna principal */}
        <div className="xl:col-span-8 overflow-x-hidden">

          {/* Imagen superior */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] xl:h-[480px] 2xl:h-[560px] rounded-xl overflow-hidden shadow-md">
            <Image
              src={experience.image}
              alt={experience.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className={`w-full space-y-6 mt-6 p-4 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor}`}>
            <h1 className={`text-2xl md:text-3xl font-bold text-${strongTextColor} mb-2`}>
              {experience.name}
            </h1>
            <p className={`text-xl font-semibold text-${primaryColor}-${primaryColorShade} mt-0`}>{pricePerPerson}</p>

            {/* Información Básica (Badges) */}
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-700">
              {experience.zone_state && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                  <MapPin className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                  <span>{experience.zone_state}</span>
                </div>
              )}
              {experience.category && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                  <Tag className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                  <span>{experience.category}</span>
                </div>
              )}
              {experience.duration && experience.duration_type && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                  <Clock className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                  <span>
                    {experience.duration} {experience.duration_type}
                  </span>
                </div>
              )}
              {languagesSpoken.length > 0 && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                  <Languages className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                  <span>Se habla: {languagesSpoken.join(', ')}</span>
                </div>
              )}
              {experience.includes_food === '1' && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                  <Utensils className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                  <span>Incluye comida</span>
                </div>
              )}
              {experience.maximum_visitors && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                  <Users className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                  <span>Máximo {experience.maximum_visitors}</span>
                </div>
              )}
              <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border border-${borderColor}`}>
                <UserCircle className={`h-4 w-4 mr-1 text-${primaryColor}-${primaryColorTextShade}`} />
                <span>Guía local</span>
              </div>
            </div>

            <p className={`text-${mutedTextColor} text-base leading-relaxed`}>{experience.description}</p>
          </div>

          {/* Razones para Elegir (Swiper - Ancho Completo en Móvil) */}
          {attractionCards.length > 0 && (
            <div className={`relative mt-8 bg-${attractionCardBackgroundColor} rounded-xl shadow-md overflow-hidden`}>
              <h3 className={`text-xl md:text-2xl font-bold text-center text-${attractionCardTextColor} py-4`}>
                {attractionCards.length} Razones para elegir esta experiencia
              </h3>
              <div className="relative">
                <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                  <div className="swiper-button-prev-1 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                    <ChevronLeft className="w-6 h-6" />
                  </div>
                  <div className="swiper-button-next-1 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation={{
                    nextEl: '.swiper-button-next-1',
                    prevEl: '.swiper-button-prev-1',
                  }}
                  spaceBetween={0}
                  loop={true}
                  slidesPerView={1}
                  grabCursor={true}
                  className="w-full"
                >
                  {attractionCards.map((card, idx) => (
                    <SwiperSlide key={idx}>
                      <div className={`px-6 py-8 text-center text-${attractionCardTextColor} text-lg sm:text-xl`}>
                        {card.reason}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          {/* Lo que encontrarás (Swiper - Ancho Completo) */}
          {expectationImages.length > 0 && (
            <div className="mt-8 rounded-xl shadow-md overflow-hidden">
              <h2 className={`text-xl md:text-2xl font-bold text-center text-${strongTextColor} py-4 bg-${cardBackgroundColor} border-b border-${borderColor}`}>
                Lo que encontrarás
              </h2>
              <div className="relative">
                <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                  <div className="swiper-button-prev-2 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                    <ChevronLeft className="w-6 h-6" />
                  </div>
                  <div className="swiper-button-next-2 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation={{
                    nextEl: '.swiper-button-next-2',
                    prevEl: '.swiper-button-prev-2',
                  }}
                  spaceBetween={4}
                  loop={true}
                  slidesPerView={1}
                  grabCursor={true}
                  className="w-full"
                >
                  {expectationImages.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative w-full aspect-video overflow-hidden">
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

          {/* Expectativas */}
          {experience.expectations && (
            <div className={`mt-8 p-6 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor}`}>
              <h2 className={`text-xl md:text-2xl font-bold text-${strongTextColor} mb-4`}>Qué puedes esperar</h2>
              <p className={`text-${mutedTextColor} text-base leading-relaxed`}>{experience.expectations}</p>
            </div>
          )}

          {/* Plan de Experiencia / Itinerario */}
          {planSteps.length > 0 && (
            <div className={`mt-8 p-6 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor}`}>
              <h2 className={`text-xl md:text-2xl font-bold text-${strongTextColor} mb-4`}>Tu Plan de Experiencia</h2>
              <ol className="relative border-s border-gray-300 ml-4 md:ml-0">
                {planSteps.map((step, idx) => (
                  <li key={idx} className="mb-6 ms-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -start-3 ring-4 ring-white">
                      <CalendarDays className={`w-3 h-3 text-${primaryColor}-${primaryColorTextShade}`} />
                    </span>
                    <h3 className={`flex items-center mb-1 text-lg font-semibold text-${strongTextColor}`}>
                      {step.title}
                    </h3>
                    <p className={`mb-2 text-sm md:text-base font-normal text-${mutedTextColor}`}>
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* ¿Dónde nos encontraremos? */}
          {(experience.meeting_point || experience.meeting_point_latitude || experience.meeting_point_longitude) && (
            <div className={`mt-8 p-6 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor}`}>
              <h2 className={`text-xl md:text-2xl font-bold text-${strongTextColor} mb-4`}>
                ¿Dónde nos encontraremos?
              </h2>
              {experience.meeting_point && (
                <div className="mb-4">
                  <h3 className={`text-lg font-semibold text-${strongTextColor}`}>Punto de Encuentro:</h3>
                  <p className={`text-${mutedTextColor} text-base`}>{experience.meeting_point}</p>
                  {experience.meeting_point_details && (
                    <p className={`text-${mutedTextColor} text-sm mt-1 italic`}>{experience.meeting_point_details}</p>
                  )}
                  {experience.meeting_time && (
                    <p className={`text-${mutedTextColor} text-sm mt-1`}>Hora de Encuentro: {experience.meeting_time}</p>
                  )}
                </div>
              )}
              {(experience.meeting_point_latitude && experience.meeting_point_longitude) ? (
                <div className={`mt-4 border border-gray-300 rounded-xl overflow-hidden h-64 flex items-center justify-center bg-gray-100 text-${primaryColor}-${primaryColorTextShade}`}>
                  <Map className="w-12 h-12" />
                  <p className="text-center text-sm">
                    Mapa del punto de encuentro ({experience.meeting_point_latitude}, {experience.meeting_point_longitude}) - Integrar componente de mapa aquí
                  </p>
                </div>
              ) : (
                <p className={`mt-4 text-${mutedTextColor} text-sm`}>Coordenadas del mapa no disponibles.</p>
              )}
            </div>
          )}

          {/* Información Adicional */}
          {additionalInfo.length > 0 && (
            <div className={`mt-8 p-6 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor}`}>
              <h2 className={`text-xl md:text-2xl font-bold text-${strongTextColor} mb-4`}>Información Adicional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {additionalInfo.map((group, groupIdx) => (
                  <div key={groupIdx} className="mb-2">
                    <h3 className={`text-lg font-semibold text-${strongTextColor} mb-2 flex items-center`}>
                      {group.title}
                    </h3>
                    <ul className="space-y-1">
                      {group.items.map((item, itemIdx) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={itemIdx} className={`flex items-start text-${mutedTextColor} text-sm`}>
                            {IconComponent && <IconComponent className={`flex-shrink-0 w-4 h-4 mr-2 text-${primaryColor}-${primaryColorTextShade} mt-0.5`} />}
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

          {/* Políticas de cancelación provisional */}
          <div className={`mt-8 p-6 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor}`}>
            <h2 className={`text-xl md:text-2xl font-bold text-${strongTextColor} mb-4`}>Políticas de cancelación</h2>
            <p className={`text-${mutedTextColor} text-base`}>
              Aquí irán las políticas de cancelación de la experiencia. Puedes personalizar este texto más adelante.
              Por ejemplo: "Cancelación gratuita hasta 24 horas antes del inicio de la actividad. Pasado este tiempo, no se ofrecerá reembolso."
            </p>
          </div>

          {/* Preguntas y respuestas provisional */}
          <div className={`mt-8 p-6 bg-${cardBackgroundColor} rounded-xl shadow-sm border border-${borderColor} mb-12`}>
            <h2 className={`text-xl md:text-2xl font-bold text-${strongTextColor} mb-4`}>Preguntas y respuestas</h2>
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold text-${strongTextColor}`}>¿Es apto para niños?</h3>
                <p className={`text-${mutedTextColor} text-base`}>Depende de la experiencia. Consulta los detalles o contáctanos para más información.</p>
              </div>
              <div>
                <h3 className={`text-lg font-semibold text-${strongTextColor}`}>¿Qué debo llevar?</h3>
                <p className={`text-${mutedTextColor} text-base`}>Se recomienda llevar ropa cómoda, calzado adecuado para caminar, protector solar y una botella de agua.</p>
              </div>
              {/* Puedes añadir más preguntas y respuestas aquí */}
            </div>
          </div>
        </div>

        {/* Sidebar Fijo (para pantallas grandes) */}
        <aside className="hidden xl:block fixed top-28 right-[calc((100vw-1280px)/2)] w-[380px] bg-white rounded-xl shadow-lg p-6 h-fit z-30 border border-gray-200">
          <div className={`text-xl font-bold text-${primaryColor}-${primaryColorShade} mb-4`}>Reserva tu experiencia</div>
          <p className={`text-lg text-${strongTextColor} font-semibold mb-3`}>{pricePerPerson}</p>

          <label htmlFor="date" className={`block text-sm font-medium text-${mutedTextColor} mb-1`}>Fecha</label>
          <input
            id="date"
            type="date"
            className={`w-full border border-${borderColor} rounded-md p-2 mb-3 text-${strongTextColor} focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 transition-all duration-200 text-sm`}
          />

          <label htmlFor="time" className={`block text-sm font-medium text-${mutedTextColor} mb-1`}>Hora</label>
          <select
            id="time"
            className={`w-full border border-${borderColor} rounded-md p-2 mb-3 text-${strongTextColor} focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 transition-all duration-200 text-sm`}
          >
            <option>10:00 AM</option>
            <option>2:00 PM</option>
            <option>5:00 PM</option>
          </select>

          <label htmlFor="people" className={`block text-sm font-medium text-${mutedTextColor} mb-1`}>Personas</label>
          <select
            id="people"
            className={`w-full border border-${borderColor} rounded-md p-2 mb-4 text-${strongTextColor} focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 transition-all duration-200 text-sm`}
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
            className={`block w-full text-center bg-teal-700 text-white text-md font-semibold px-4 py-3 rounded-md hover:bg-teal-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg`}
          >
            Reservar Experiencia
          </a>
        </aside>

        {/* Botón fijo solo visible en móvil */}
        <div className={`fixed bottom-0 left-0 right-0 bg-${cardBackgroundColor} border-t border-${borderColor} p-3 xl:hidden z-50 shadow-lg`}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center bg-teal-700 text-white text-lg font-semibold py-2 rounded-md hover:bg-teal-800 transition-all duration-300 ease-in-out shadow-md`}
          >
            Reservar Experiencia
          </a>
        </div>
      </div>
    </div>
  )
}

// Componente de marcador simple para el mapa (solo como ejemplo)
const AnyReactComponent = ({ text }: { text: string }) => <div>{text}</div>;