# 📊 Tablero de Programas Académicos

Tablero interactivo para visualizar métricas de programas. Soporta carga de datos vía CSV.

## Cómo publicar en Netlify (sin terminal)

1. Sube esta carpeta completa a GitHub
2. Ve a [netlify.com](https://netlify.com) → Sign up con tu cuenta GitHub
3. Haz clic en **"Add new site" → "Import an existing project"**
4. Selecciona tu repositorio de GitHub
5. Netlify detecta el `netlify.toml` automáticamente → clic en **Deploy**
6. En ~2 minutos tendrás una URL pública tipo `https://tu-tablero.netlify.app`

## Cómo actualizar los datos

1. Abre tu Excel → Archivo → Guardar como → **CSV**
2. Entra a tu URL pública
3. Arrastra el CSV al tablero → listo ✓

## Estructura
```
tablero/
├── src/
│   ├── App.jsx       ← tablero principal
│   └── main.jsx      ← entrada
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml      ← configuración de deploy automático
```
