export interface Experience {
  slug: string
  title: string
  location: string
  image: string
  description: string
}

export const experiences: Experience[] = [
  {
    slug: 'cascada-escondida',
    title: 'Caminata a la cascada Escondida',
    location: 'San Francisco, Cundinamarca',
    image: 'https://firebasestorage.googleapis.com/v0/b/appueblear-4b850.appspot.com/o/media%2Fproj_rsK6jYGJzKf9mkbruz2oe6%2Fapp_rLCYAnKEHfHCeT1mAAX2VE%2FdataApplications%2FhRCMjdMu9NpyQRrfCze3WG?alt=media&token=cefe2c99-77ce-4484-a53e-4101d1e6f5e7',
    description:
      'Disfruta de una caminata ecológica rodeada de naturaleza hacia una hermosa cascada escondida en las montañas de San Francisco.'
  },
  {
    slug: 'aventura-rio-claro',
    title: 'Tour de Aventura en Río Claro',
    location: 'Antioquia',
    image: 'https://firebasestorage.googleapis.com/v0/b/appueblear-4b850.appspot.com/o/media%2Fproj_rsK6jYGJzKf9mkbruz2oe6%2Fapp_rLCYAnKEHfHCeT1mAAX2VE%2FdataApplications%2FhRCMjdMu9NpyQRrfCze3WG?alt=media&token=cefe2c99-77ce-4484-a53e-4101d1e6f5e7',
    description:
      'Explora el cañón de Río Claro con actividades como rafting, senderismo y escalada en un entorno natural impresionante.'
  },
  {
    slug: 'avistamiento-aves-valle',
    title: 'Avistamiento de aves en el Valle',
    location: 'Tolima',
    image: 'https://firebasestorage.googleapis.com/v0/b/appueblear-4b850.appspot.com/o/media%2Fproj_rsK6jYGJzKf9mkbruz2oe6%2Fapp_rLCYAnKEHfHCeT1mAAX2VE%2FdataApplications%2FhRCMjdMu9NpyQRrfCze3WG?alt=media&token=cefe2c99-77ce-4484-a53e-4101d1e6f5e7',
    description:
      'Observa una gran variedad de aves en su hábitat natural con guías expertos y paisajes increíbles del Valle del Tolima.'
  }
]

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find(exp => exp.slug === slug)
}
