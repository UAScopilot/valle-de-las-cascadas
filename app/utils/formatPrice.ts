// app/utils/formatPrice.ts

/**
 * Formatea un valor como precio en moneda colombiana (COP).
 * Intenta convertir el valor a número si es una cadena.
 * Si el precio es undefined, null, o no es un número válido, retorna 'N/A'.
 * @param price El valor del precio (número, cadena, undefined o null).
 * @returns El precio formateado como string (ej. "$140.000") o "N/A".
 */
export function formatPrice(price: number | string | undefined | null): string {
  let numericPrice: number;

  // Si el precio es una cadena, intentamos convertirlo a número.
  if (typeof price === 'string') {
    numericPrice = parseFloat(price);
  } else if (typeof price === 'number') {
    numericPrice = price;
  } else {
    // Si es undefined, null, o cualquier otro tipo, no es un número válido.
    return 'N/A';
  }

  // Verificamos si el resultado de la conversión es un número válido (no NaN).
  if (isNaN(numericPrice)) {
    return 'N/A';
  }

  // Formateamos el número a moneda colombiana.
  return `$${numericPrice.toLocaleString('es-CO')}`;
}
