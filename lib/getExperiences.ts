// lib/getExperiences.ts
import { db } from './firebase';
import { get, ref } from 'firebase/database';
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
  // Propiedad 'project_name' añadida aquí
  project_name?: string; // Asegúrate de que esta propiedad exista en tus datos de Firebase

  // Propiedades nuevas/actualizadas solicitadas:
  zone_state?: string; 
  category?: string; 
  meeting_point_details?: string; 
  meeting_point_latitude?: number; 
  meeting_point_longitude?: number; 

  attraction_cards?: Record<string, { reason: string }>;
  expectation_images?: Record<string, { image: string }>;
  expectations?: string;
  includes_food?: string;
  duration?: string;
  duration_type?: string;
  address?: string; // Mantener esta si aún la usas aparte de meeting_point
  address_details?: string;
  address_zone?: string;
  meeting_point?: string;
  meeting_time?: string;
  maximum_visitors?: number;
  plan?: Record<string, { title: string; description: string; order: string | number }>;
  info?: Record<string, ExperienceInfoReference>;
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
        // Mapeo de 'project_name' añadido aquí
        project_name: item.project_name || '', // Asegúrate de que el dato esté en Firebase con este nombre

        // Mapeo de las nuevas propiedades
        zone_state: item.zone_state || '',
        category: item.category || '',
        meeting_point_details: item.meeting_point_details || '',
        meeting_point_latitude: item.meeting_point_latitude || 0,
        meeting_point_longitude: item.meeting_point_longitude || 0,

        // Mapeo de las propiedades existentes
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
        info: item.info || {},
      }));

    console.log('✅ Experiencias cargadas:', experiences);
    return experiences;
  } catch (error) {
    console.error('❌ Error al obtener experiencias desde Firebase:', error);
    return [];
  }
}