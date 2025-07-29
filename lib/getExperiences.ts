// lib/getExperiences.ts
import { db } from './firebase'; // Asegúrate de que esta ruta sea correcta para tu configuración de Firebase
import { get, ref } from 'firebase/database';
// ¡Importante! Importamos ExperienceInfoReference para el tipado del campo 'info'
import { ExperienceInfoReference } from './getFirebaseInfo';

export interface Experience {
  product_id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  zone: string;
  state: string;
  slug: string;
  // **Todos estos campos opcionales son cruciales para que se muestre el contenido adicional:**
  attraction_cards?: Record<string, { reason: string }>;
  expectation_images?: Record<string, { image: string }>;
  expectations?: string;
  includes_food?: string; // Podría ser '1' o '0' como string
  duration?: string;
  duration_type?: string;
  address?: string;
  address_details?: string;
  address_zone?: string;
  meeting_point?: string;
  meeting_time?: string;
  maximum_visitors?: number;
  plan?: Record<string, { title: string; description: string; order: string | number }>;
  info?: Record<string, ExperienceInfoReference>; // Este campo referencia a z_btc_info
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const dbRef = ref(db, 'projects/proj_rsK6jYGJzKf9mkbruz2oe6/data/experiences');
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      console.warn('⚠️ No se encontraron experiencias en la ruta esperada');
      return [];
    }

    const data = snapshot.val();

    const experiences: Experience[] = Object.values(data)
      .filter((item: any) => item && item.product_id && item.name && item.slug) // Filtra elementos válidos
      .map((item: any) => ({
        product_id: item.product_id,
        name: item.name,
        description: item.description || '',
        image: item.image || '',
        price: item.price || 0,
        zone: item.zone || '',
        state: item.state || '',
        slug: item.slug,
        // **Asegúrate de mapear explícitamente todos los campos opcionales aquí.**
        // Usamos `|| {}` para objetos y `|| ''` o `|| 0` para otras primitivas
        // para asegurar que siempre haya un valor (incluso vacío) y evitar `undefined`.
        attraction_cards: item.attraction_cards || {},
        expectation_images: item.expectation_images || {},
        expectations: item.expectations || '',
        includes_food: item.includes_food || '',
        duration: item.duration || '',
        duration_type: item.duration_type || '',
        address: item.address || '',
        address_details: item.address_details || '',
        address_zone: item.address_zone || '',
        meeting_point: item.meeting_point || '',
        meeting_time: item.meeting_time || '',
        maximum_visitors: item.maximum_visitors || 0,
        plan: item.plan || {},
        info: item.info || {}, // Mapea el campo 'info' también
      }));

    console.log('✅ Experiencias cargadas:', experiences);
    return experiences;
  } catch (error) {
    console.error('❌ Error al obtener experiencias desde Firebase:', error);
    return [];
  }
}