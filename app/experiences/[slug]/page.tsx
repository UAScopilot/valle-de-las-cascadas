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
  LucideIcon, Dot, Flag, LocateFixed, Circle, CircleDot
} from 'lucide-react'

// Importa formatPrice, que es crucial para manejar el precio consistentemente
import { formatPrice } from '@/app/utils/formatPrice';

import { InfoItem, ExperienceInfoReference, GroupedInfo } from '@/lib/getFirebaseInfo';
import MapView from '@/app/components/MapView'

// --- NUEVA CONFIGURACIÓN DE COLORES SOBRIA Y ELEGANTE (CORREGIDA PARA TAILWIND) ---
// Estas constantes ahora solo definen los colores base que se usarán en las clases Tailwind completas
const primaryColorName = 'teal';
const primaryColorShade = '700';
const primaryColorTextShade = '700';

const mutedTextColor = 'gray-600';
const strongTextColor = 'gray-800';
const borderColor = 'gray-200'; // Se usará para las líneas divisorias

// Clases Tailwind completas construidas a partir de las constantes
const primaryColorClass = `text-${primaryColorName}-${primaryColorTextShade}`;
const primaryBgColorClass = `bg-${primaryColorName}-${primaryColorShade}`;
const primaryHoverBgColorClass = `hover:bg-${primaryColorName}-${parseInt(primaryColorShade) + 100}`;

const mutedTextColorClass = `text-${mutedTextColor}`;
const strongTextColorClass = `text-${strongTextColor}`;
const borderColorClass = `border-${borderColor}`; // Para la línea divisoria

// Colores para las tarjetas de "Razones para elegir" - se mantienen porque son una sección con fondo propio.
const attractionCardTextColorClass = 'text-white';
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

  if (loading) return <p className={`p-4 ${mutedTextColorClass}`}>Cargando experiencia.</p>

  const experience = experiences.find((exp) => exp.slug === params.slug);

  if (!experience) return notFound();

  // Pre-procesamiento de datos
  const pricePerPerson = `${formatPrice(experience.price)} por persona`;

  const attractionCards = Object.values(experience.attraction_cards || {});
  const expectationImages = Object.values(experience.expectation_images || {});


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
      const detail = allInfoData?.[infoRef?.["info_id"]];
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

      if (!grouped?.[item.product_info_title]) {
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
        // console.warn(`Icono '${item.icon}' no encontrado en iconMap para el título: '${item.product_info_title}'`);
      }
    });

    for (const title in grouped) {
      grouped[title].items.sort((a, b) => a.item_order - b.item_order);
      additionalInfo.push(grouped[title]);
    }
    additionalInfo.sort((a, b) => a.order - b.order);
  }

  return (
    <div className="relative min-h-screen pb-20 bg-white overflow-x-hidden"> {/* Fondo de pantalla blanco */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-8 pt-[80px]">
        {/* Columna principal */}
        <div className="xl:col-span-8 overflow-x-hidden">

          {/* Imagen superior - Mantiene sombras y bordes redondeados como un elemento visual principal */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] xl:h-[480px] 2xl:h-[500px] overflow-hidden  mb-8">
            <Image
              src={experience.image}
              alt={experience.name}
              fill
              className="object-cover rounded-xl shadow-md"
              priority
              sizes="(max-width: 640px) 100vw,
                         (max-width: 768px) 100vw,
                         (max-width: 1024px) 100vw,
                         (max-width: 1280px) 80vw,
                         60vw"
            />
          </div>

          {/* Información Básica */}
          <div className={`w-full space-y-6 pt-0 pb-6 border-b ${borderColorClass}`}> {/* Sin padding top, solo padding bottom para la línea */}
            <h1 className={`text-2xl md:text-3xl font-bold ${strongTextColorClass}`}>
              {experience.name}
            </h1>
            {experience.project_name && (
              <p className={`text-base md:text-lg font-semibold ${mutedTextColorClass}`}>
                {experience.project_name}
              </p>
            )}
            <p className={`text-xl font-semibold ${primaryColorClass}`}>{pricePerPerson}</p>

            {/* Información Básica (Badges) */}
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-700">
              {experience.zone_state && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                  <MapPin className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                  <span>{experience.zone_state}</span>
                </div>
              )}
              {experience.category && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                  <Tag className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                  <span>{experience.category}</span>
                </div>
              )}
              {experience.duration && experience.duration_type && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                  <Clock className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                  <span>
                    {experience.duration} {experience.duration_type}
                  </span>
                </div>
              )}
              {languagesSpoken.length > 0 && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                  <Languages className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                  <span>Se habla: {languagesSpoken.join(', ')}</span>
                </div>
              )}
              {experience.includes_food === '1' && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                  <Utensils className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                  <span>Incluye alimentación</span>
                </div>
              )}
              {experience.maximum_visitors && (
                <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                  <Users className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                  <span>Máximo {experience.maximum_visitors}</span>
                </div>
              )}
              <div className={`inline-flex items-center bg-gray-50 px-2 py-1 rounded-full border ${borderColorClass}`}>
                <UserCircle className={`h-4 w-4 mr-1 ${primaryColorClass}`} />
                <span>Guía local</span>
              </div>
            </div>

            <p className={`${mutedTextColorClass} text-base leading-relaxed`}>{experience.description}</p>
          </div>

          {/* Razones para Elegir (Swiper) - Mantiene su fondo de color ya que es parte de su diseño */}
          {attractionCards.length > 0 && (
            <div className={`relative mt-8  rounded-xl shadow-md overflow-hidden w-full border-b ${borderColorClass}`}>
              <h3 className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-md md:text-lg font-bold text-amber-400 text-center px-4 py-2`}>
                {attractionCards.length} Razones para elegir esta experiencia
              </h3>
              <div className="relative">
                <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                  <button className="swiper-button-prev-1 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button className="swiper-button-next-1 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                    <ChevronRight className="w-6 h-6" />
                  </button>
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
                  className="w-full h-64 md:h-80"
                >
                  {attractionCards.map((card, idx) => (
                    <SwiperSlide key={idx} className="bg-teal-700">
                      <div className={`px-6 py-4 flex items-center justify-center h-full text-center ${attractionCardTextColorClass} text-2xl sm:text-3xl font-bold max-w-lg mx-auto`}>
                        {card.reason}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          {/* Lo que encontrarás (Swiper con imágenes y expectativas) */}
          {(expectationImages.length > 0 || experience.expectations) && (
            <div className={`mt-8 pt-6 pb-6 border-b ${borderColorClass}`}>
              <h2 className={`text-xl md:text-2xl font-bold ${primaryColorClass} mb-4`}>
                Lo que encontrarás
              </h2>

              {/* Swiper de imágenes */}
              {expectationImages.length > 0 && (
                <div className="relative pt-2 pb-12 ">
                  <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                    <button className="swiper-button-prev-2 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button className="swiper-button-next-2 pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-300">
                      <ChevronRight className="w-6 h-6" />
                    </button>
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
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px]"
                  >
                    {expectationImages.map((item, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="relative w-full h-full overflow-hidden rounded-xl shadow-md">
                          <Image
                            src={item.image}
                            alt={`expectation-${idx}`}
                            fill
                            className="object-cover rounded-xl"
                            sizes="(max-width: 640px) 100vw,
                         (max-width: 768px) 100vw,
                         (max-width: 1024px) 90vw,
                         (max-width: 1280px) 70vw,
                         50vw"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {experience.expectations && (
                <p className={`${mutedTextColorClass} text-base leading-relaxed`}>{experience.expectations}</p>
              )}
            </div>
          )}

          {/* Plan de Experiencia / Itinerario con iconos personalizados */}
          {planSteps.length > 0 && (
            <div className={`mt-8 pb-6 border-b ${borderColorClass}`}>
              <h2 className={`text-xl md:text-2xl font-bold ${primaryColorClass} mb-4`}>Tu Plan de Experiencia</h2>
              <ol className="relative border-s border-gray-300 ml-4 md:ml-6">
                {planSteps.map((step, idx) => {
                  let StepIcon: LucideIcon;
                  if (idx === 0) {
                    StepIcon = MapPin;
                  } else if (idx === planSteps.length - 1) {
                    StepIcon = Flag;
                  } else {
                    StepIcon = CircleDot;
                  }

                  return (
                    <li key={idx} className="mb-6 ms-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -start-3 ring-4 ring-white">
                        <StepIcon className={`w-3 h-3 ${primaryColorClass}`} />
                      </span>
                      <h3 className={`flex items-center mb-1 text-lg font-semibold ${strongTextColorClass}`}>
                        {step.title}
                      </h3>
                      <p className={`mb-2 text-sm md:text-base font-normal ${mutedTextColorClass}`}>
                        {step.description}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {/* ¿Dónde nos encontraremos? */}
          {(experience.meeting_point || experience.meeting_point_latitude || experience.meeting_point_longitude) && (
            <section className={`mt-8 pb-6 border-b ${borderColorClass}`}>
              <h2 className={`text-2xl md:text-3xl font-bold ${primaryColorClass} mb-6`}>
                ¿Dónde nos encontraremos?
              </h2>

              <h3 className={`text-xl md:text-2xl font-semibold ${strongTextColorClass} mb-4`}>
                {experience.meeting_point}
              </h3>

              {experience.meeting_point_details && (
                <p className={`${mutedTextColorClass} text-base mb-2`}>
                  {experience.meeting_point_details}
                </p>
              )}

              {experience.meeting_time && (
                <p className={`${mutedTextColorClass} text-base mb-4`}>
                  Hora de Encuentro: {experience.meeting_time}
                </p>
              )}

              {experience.meeting_point_latitude && experience.meeting_point_longitude ? (
                <div className="mt-4 space-y-4">
                  <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
                    <MapView
                      lat={experience.meeting_point_latitude}
                      lng={experience.meeting_point_longitude}
                    />
                  </div>

                  <div className="flex justify-center">
                    <a
                      // --- MODIFICACIÓN IMPORTANTE AQUÍ: El enlace corregido ---
                      href={`https://www.google.com/maps/place/${experience.meeting_point_latitude},${experience.meeting_point_longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block w-full sm:w-auto text-center px-6 py-3 ${primaryBgColorClass} ${attractionCardTextColorClass} text-sm md:text-base font-semibold rounded-md shadow-md transition-all duration-300 ${primaryHoverBgColorClass}`}
                    >
                      Abrir ubicación
                    </a>
                  </div>
                </div>
              ) : (
                <p className={`mt-4 ${mutedTextColorClass} text-sm`}>
                  Coordenadas del mapa no disponibles.
                </p>
              )}
            </section>
          )}

          {/* Información Adicional */}
          {additionalInfo.length > 0 && (
            <div className={`mt-8 pb-6 border-b ${borderColorClass}`}> {/* Sin padding ni bordes, solo padding bottom y línea */}
              <h2 className={`text-xl md:text-2xl font-bold ${primaryColorClass} mb-4`}>Información Adicional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {additionalInfo.map((group, groupIdx) => (
                  <div key={groupIdx} className="mb-2">
                    <h3 className={`text-lg font-semibold ${strongTextColorClass} mb-2 flex items-center`}>
                      {group.title}
                    </h3>
                    <ul className="space-y-1">
                      {group.items.map((item, itemIdx) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={itemIdx} className={`flex items-start ${mutedTextColorClass} text-sm`}>
                            {IconComponent && <IconComponent className={`flex-shrink-0 w-4 h-4 mr-2 ${primaryColorClass} mt-0.5`} />}
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

          {/* Políticas de cancelación con experience.project_name */}
          <div className={`mt-8 pb-6 border-b ${borderColorClass}`}> {/* Sin padding ni bordes, solo padding bottom y línea */}
            <h2 className={`text-xl md:text-2xl font-bold ${primaryColorClass} mb-4`}>Políticas de Cancelación</h2>
            <p className={`${mutedTextColorClass} text-base`}>
              Entendemos que los planes pueden cambiar. Para garantizar una gestión justa y eficiente, te presentamos nuestras políticas de cancelación:
            </p>
            <ul className={`list-disc list-inside ${mutedTextColorClass} text-base mt-4 space-y-2`}>
              <li>
                <strong>Cancelaciones con más de 15 días de antelación:</strong> Si necesitas cancelar tu reserva con más de 15 días de anticipación a la fecha de la experiencia, se te reembolsará el <strong>90% del valor total</strong>. El 10% restante se retendrá para cubrir gastos administrativos.
              </li>
              <li>
                <strong>Cancelaciones entre 7 y 14 días de antelación:</strong> Para cancelaciones realizadas entre 7 y 14 días antes de la fecha programada, se te reembolsará el <strong>50% del valor total</strong>.
              </li>
              <li>
                <strong>Cancelaciones con menos de 7 días de antelación:</strong> Lamentablemente, no se realizarán reembolsos para cancelaciones efectuadas con menos de 7 días de antelación a la fecha de la experiencia. En este caso, no habrá lugar a devoluciones, cambios de fecha ni créditos.
              </li>
              <li>
                <strong>No show (No presentarse):</strong> La no presentación en la fecha y hora acordadas sin previo aviso se considerará una cancelación de último minuto y no generará ningún tipo de reembolso o crédito.
              </li>
              <li>
                <strong>Cancelación por parte de {experience.project_name}:</strong> En el improbable caso de que {experience.project_name} deba cancelar la experiencia debido a condiciones climáticas extremas que pongan en riesgo la seguridad de los participantes o por fuerza mayor, se ofrecerá la opción de reprogramar la actividad para una fecha futura o un reembolso del <strong>100% del valor pagado</strong>.
              </li>
            </ul>
            <p className={`${mutedTextColorClass} text-base mt-4`}>
              <strong>Importante:</strong> Te recomendamos encarecidamente revisar estas políticas antes de confirmar tu reserva. Para cualquier gestión de cancelación, por favor, contáctanos a través de los canales de atención al cliente de {experience.project_name}.
            </p>
          </div>

          {/* Preguntas y respuestas provisional - Última sección, sin border-b */}
          <div className={`mt-8 pb-12`}> {/* Quitado border-b y se deja un padding bottom generoso */}
            <h2 className={`text-xl md:text-2xl font-bold ${primaryColorClass} mb-4`}>Preguntas y respuestas</h2>
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold ${strongTextColorClass}`}>¿Es apto para niños?</h3>
                <p className={`${mutedTextColorClass} text-base`}>Depende de la experiencia. Consulta los detalles o contáctanos para más información.</p>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${strongTextColorClass}`}>¿Qué debo llevar?</h3>
                <p className={`${mutedTextColorClass} text-base`}>Se recomienda llevar ropa cómoda, calzado adecuado para caminar, protector solar y una botella de agua.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Fijo (para pantallas grandes) - SIN CAMBIOS */}
        <aside className="hidden xl:block fixed top-28 right-[calc((100vw-1280px)/2)] w-[380px] bg-white rounded-xl shadow-lg p-6 h-fit z-30 border border-gray-200">
          <div className={`text-xl font-bold ${primaryColorClass} mb-4`}>Reserva tu experiencia</div>
          <p className={`text-lg ${strongTextColorClass} font-semibold mb-3`}>{pricePerPerson}</p>

          <label htmlFor="date" className={`block text-sm font-medium ${mutedTextColorClass} mb-1`}>Fecha</label>
          <input
            id="date"
            type="date"
            className={`w-full border ${borderColorClass} rounded-md p-2 mb-3 ${strongTextColorClass} focus:outline-none focus:ring-2 focus:ring-${primaryColorName}-500 transition-all duration-200 text-sm`}
          />

          <label htmlFor="time" className={`block text-sm font-medium ${mutedTextColorClass} mb-1`}>Hora</label>
          <select
            id="time"
            className={`w-full border ${borderColorClass} rounded-md p-2 mb-3 ${strongTextColorClass} focus:outline-none focus:ring-2 focus:ring-${primaryColorName}-500 transition-all duration-200 text-sm`}
          >
            <option>10:00 AM</option>
            <option>2:00 PM</option>
            <option>5:00 PM</option>
          </select>

          <label htmlFor="people" className={`block text-sm font-medium ${mutedTextColorClass} mb-1`}>Personas</label>
          <select
            id="people"
            className={`w-full border ${borderColorClass} rounded-md p-2 mb-4 ${strongTextColorClass} focus:outline-none focus:ring-2 focus:ring-${primaryColorName}-500 transition-all duration-200 text-sm`}
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
            className={`block w-full text-center ${primaryBgColorClass} ${attractionCardTextColorClass} text-md font-semibold px-4 py-3 rounded-md ${primaryHoverBgColorClass} transition-all duration-300 ease-in-out shadow-md hover:shadow-lg`}
          >
            Reservar Experiencia
          </a>
        </aside>

        {/* Botón fijo solo visible en móvil - SIN CAMBIOS */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 xl:hidden z-50 shadow-lg`}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center ${primaryBgColorClass} text-white text-lg font-semibold py-2 rounded-md ${primaryHoverBgColorClass} shadow-md`}
          >
            {/* MODIFICACIÓN: El texto del botón se asegura de ser blanco, evitando el conflicto anterior */}
            Reservar Experiencia
          </a>
        </div>
      </div>
    </div >
  )
}