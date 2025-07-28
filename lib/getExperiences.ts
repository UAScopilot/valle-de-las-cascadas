import { db } from './firebase'
import { get, ref } from 'firebase/database'

export interface Experience {
  product_id: string
  name: string
  description: string
  image: string
  price: number
  zone: string
  state: string
  slug: string
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const dbRef = ref(db, 'projects/proj_rsK6jYGJzKf9mkbruz2oe6/data/experiences')
    const snapshot = await get(dbRef)

    if (!snapshot.exists()) {
      console.warn('⚠️ No se encontraron experiencias en la ruta esperada')
      return []
    }

    const data = snapshot.val()

    const experiences: Experience[] = Object.values(data)
      .filter((item: any) => item && item.product_id && item.name && item.slug)
      .map((item: any) => ({
        product_id: item.product_id,
        name: item.name,
        description: item.description || '',
        image: item.image || '',
        price: item.price || 0,
        zone: item.zone || '',
        state: item.state || '',
        slug: item.slug,
      }))

    console.log('✅ Experiencias cargadas:', experiences)
    return experiences
  } catch (error) {
    console.error('❌ Error al obtener experiencias desde Firebase:', error)
    return []
  }
}
