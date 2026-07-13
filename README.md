# Gastos 2000

Aplicación web retro para registrar gastos personales. Funciona en celulares, se puede instalar como PWA y guarda los datos en Supabase.

## Instalación local

```bash
npm install
npm run dev
```

## Configuración de Supabase

1. Creá un proyecto en [Supabase](https://supabase.com).
2. Abrí el **SQL Editor** del proyecto.
3. Ejecutá el contenido de `supabase/schema.sql`.
4. Copiá la **Project URL** (Settings → API).
5. Copiá la **anon public key** (Settings → API).
6. Creá un archivo `.env.local` en la raíz del proyecto.
7. Agregá:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

> **Importante:** Usá solo la anon key. Nunca expongas la `service_role` key en el frontend ni en Vercel.

## Despliegue en Vercel

1. Subí el repositorio a GitHub.
2. Importá el proyecto en [Vercel](https://vercel.com).
3. Agregá estas variables de entorno en la configuración del proyecto:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Ejecutá el deploy.
5. Verificá que funcionen `/` y `/gastos` (incluido al refrescar la página).

## Instalación como app (PWA)

- **Android / Chrome:** Menú del navegador → *Instalar aplicación* o *Agregar a pantalla principal*.
- **iPhone / Safari:** Botón *Compartir* → *Agregar a pantalla de inicio*.

## Advertencia de privacidad

Esta versión **no tiene autenticación**. Cualquier persona que conozca la URL de la aplicación puede:

- Ver todos los gastos registrados.
- Crear nuevos gastos.
- Borrar gastos (si usa el botón de borrar).

**No es una aplicación privada.** No la uses para datos sensibles sin agregar autenticación primero.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Linter |

## Stack

- React + Vite + TypeScript
- Supabase (`@supabase/supabase-js`)
- React Router
- `vite-plugin-pwa`
- CSS puro (sin Tailwind)
