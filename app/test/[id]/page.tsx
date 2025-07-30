// app/test/[id]/page.tsx
'use client';

export default function TestPage({ params }: { params: { id: string } }) {
  console.log("--- DEBUG: app/test/[id]/page.tsx ---");
  console.log("ID de la URL (params.id):", params.id);
  return (
    <div style={{ padding: '20px', fontSize: '24px', textAlign: 'center' }}>
      <h1>Página de Prueba Dinámica</h1>
      <p>El ID de la URL es: <strong>{params.id}</strong></p>
      <p>Si ves esto, la ruta dinámica está funcionando.</p>
    </div>
  );
}