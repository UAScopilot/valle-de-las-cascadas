// lib/getFirebaseInfo.ts
import { db } from './firebase'; // Asegúrate de que esta ruta sea correcta para tu configuración de Firebase
import { get, ref } from 'firebase/database';
import { LucideIcon, Languages } from 'lucide-react'; // Importa Languages si lo necesitas aquí

// Tipos para la información (basados en tu info.json)
export interface InfoItem {
  icon: string;
  info_id: string;
  item_order: string;
  main_id: string;
  order: string;
  product_info: string;
  product_info_title: string;
  info_main_title?: string;
  info_name?: string;
  main_name?: string;
}

// Interfaz para el objeto 'info' de la experiencia que viene de data.json
export interface ExperienceInfoReference {
  info_id: string;
  main_id: string;
}

// Para agrupar los datos en el componente (se usa en page.tsx, pero se define aquí para centralizar tipos)
export interface GroupedInfo {
  title: string;
  order: number;
  icon?: LucideIcon; // El icono del título principal si lo hubiera
  items: {
    icon: LucideIcon;
    product_info: string;
    item_order: number;
  }[];
}

// Función para obtener la información maestra desde Firebase
export async function getAllInfoDataFromFirebase(): Promise<Record<string, InfoItem>> {
  try {
    const dbRef = ref(db, 'projects/proj_rsK6jYGJzKf9mkbruz2oe6/data/z_btc_info');
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      console.warn('⚠️ No se encontró la información maestra en Firebase en la ruta z_btc_info.');
      return {};
    }

    const data = snapshot.val();
    console.log('✅ Información maestra cargada desde Firebase.');
    return data as Record<string, InfoItem>;
  } catch (error) {
    console.error('❌ Error al obtener la información maestra desde Firebase:', error);
    return {};
  }
}