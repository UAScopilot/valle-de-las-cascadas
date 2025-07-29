'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useExperiences } from '@/app/contexts/ExperiencesContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Experience {
  product_id: string
  name: string
  description: string
  image: string
  price: number
  zone: string
  state: string
  slug: string
  attraction_cards?: Record<string, { reason: string }>
  expectation_images?: Record<string, { image: string }>
  expectations?: string
}

export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const { experiences, loading } = useExperiences()

  if (loading) return <p className="p-4 text-gray-600">Cargando experiencia...</p>

  const experience = experiences.find((exp) => exp.slug === params.slug) as Experience | undefined
  if (!experience) return notFound()

  const attractionCards = Object.values(experience.attraction_cards || {})
  const expectationImages = Object.values(experience.expectation_images || {})

  return (
    <div className="relative min-h-screen pb-20 bg-[#f9fafb] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">

        {/* Columna principal */}
        <div className="xl:col-span-8 overflow-x-hidden">
          {/* Imagen superior */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] xl:h-[480px] 2xl:h-[560px] rounded-xl overflow-hidden">
            <Image
              src={experience.image}
              alt={experience.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="w-full space-y-6">
            <h1 className="text-3xl font-bold text-[#374151]">{experience.name}</h1>
            <p className="text-2xl text-red-600 font-semibold">${experience.price}</p>
            <p className="text-[#4A4A4A] text-[17px] leading-relaxed">{experience.description}</p>

            {/* Swiper 1: attraction_cards */}
            {attractionCards.length > 0 && (
              <div className="relative mt-10">
                <h3 className="text-2xl font-semibold text-center text-[#1f2937] w-full z-10 relative -mb-12">
                  ¡{attractionCards.length} Razones para elegir esta experiencia!
                </h3>

                <div className="relative">
                  <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                    <div className="swiper-button-prev-1 pointer-events-auto bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                    <div className="swiper-button-next-1 pointer-events-auto bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow">
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
                    className="w-full max-w-full"
                  >
                    {attractionCards.map((card, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="bg-[#f3f4f6] h-[240px] sm:h-[280px] lg:h-[360px] xl:h-[360px] 2xl:h-[450px] px-6 py-8 text-center text-[#374151] text-[25px] flex items-center justify-center rounded-xl overflow-hidden">
                          {card.reason}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}

            {/* Swiper 2: expectation_images */}
            {expectationImages.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Lo que encontrarás</h2>

                <div className="relative">
                  <div className="hidden lg:flex justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-2 z-10 pointer-events-none">
                    <div className="swiper-button-prev-2 pointer-events-auto bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                    <div className="swiper-button-next-2 pointer-events-auto bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow">
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
                    spaceBetween={16}
                    loop={true}
                    slidesPerView={1}
                    grabCursor={true}
                    className="w-full max-w-full"
                  >
                    {expectationImages.map((item, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="relative h-[240px] sm:h-[280px] lg:h-[360px] xl:h-[360px] 2xl:h-[450px] rounded-xl overflow-hidden">
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

            {/* Texto final */}
            {experience.expectations && (
              <p className="mt-4 text-gray-700 leading-relaxed text-[16px]">
                {experience.expectations}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Fijo */}
        <aside className="hidden xl:block fixed top-28 right-[80px] w-[380px] bg-white rounded-xl shadow-lg p-6 h-fit z-30">
          <div className="text-xl font-semibold text-[#14532d] mb-4">Reserva tu experiencia</div>

          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            className="w-full border rounded-lg p-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
          <select className="w-full border rounded-lg p-2 mb-4 text-gray-700">
            <option>10:00 AM</option>
            <option>2:00 PM</option>
            <option>5:00 PM</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Personas</label>
          <select className="w-full border rounded-lg p-2 mb-4 text-gray-700">
            <option>1 Adulto</option>
            <option>2 Adultos</option>
            <option>3 Adultos</option>
            <option>4 Adultos</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-pink-600 font-medium mt-4 mb-6">
            
            <span className="font-semibold"></span>
          </div>

          <button className="w-full bg-[#14532d] text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-all">
            Seleccionar
          </button>
        </aside>
        {/* Botón fijo solo visible en móvil */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 xl:hidden z-50">
         <button className="w-full bg-[#14532d] text-white text-lg font-semibold py-3 rounded-xl hover:bg-green-700 transition-all">
          Reservar Experiencia
         </button>
        </div>
      </div>
    </div>
  )
}
