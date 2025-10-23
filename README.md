# Cinema Seating Map Manager

Una aplicación profesional para gestionar mapas de asientos de cines con funcionalidades avanzadas de análisis, exportación/importación y configuración personalizada.

## Características

✨ **Mapa Interactivo de Butacas**
- Visualización de 139 butacas con disposición simétrica perfecta
- Selección individual o en lote de butacas
- Filtrado por estado (disponibles, seleccionadas, todas)
- Información detallada de cada butaca al pasar el cursor

📊 **Dashboard de Análisis**
- Tasa de ocupación en tiempo real
- Gráficos de distribución de butacas
- Análisis por sección
- Cálculo de ingresos potenciales

💾 **Exportación e Importación**
- Exportar mapas en formato JSON o CSV
- Importar configuraciones guardadas
- Validación automática de datos

⚙️ **Editor de Configuración**
- Personalizar nombre del cine
- Ajustar precio por butaca
- Crear y gestionar secciones personalizadas
- Guardar múltiples configuraciones

## Instalación

### Requisitos Previos
- Node.js 18+ instalado en tu computadora
- npm o yarn como gestor de paquetes

### Pasos de Instalación

1. **Descargar el proyecto**
   - Descarga el archivo ZIP desde v0.app
   - Extrae el contenido en una carpeta de tu preferencia

2. **Instalar dependencias**
   \`\`\`bash
   cd cinema-map
   npm install
   \`\`\`

3. **Ejecutar la aplicación en desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`
   - La aplicación se abrirá en `http://localhost:3000`

4. **Crear una versión de producción**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Uso

### Seleccionar Butacas
1. Haz clic en cualquier butaca para seleccionarla
2. Las butacas seleccionadas aparecerán en la lista superior
3. Usa los botones "Seleccionar Todo" o "Deseleccionar Todo" para acciones en lote

### Filtrar Butacas
- **Todas**: Muestra todas las butacas
- **Disponibles**: Muestra solo butacas sin seleccionar
- **Seleccionadas**: Muestra solo butacas seleccionadas

### Ver Análisis
1. Haz clic en la pestaña "Análisis"
2. Visualiza gráficos de ocupación y estadísticas detalladas
3. Consulta el desglose por sección

### Exportar Datos
1. Haz clic en "Exportar/Importar"
2. Selecciona el formato (JSON o CSV)
3. El archivo se descargará automáticamente

### Importar Configuración
1. Haz clic en "Exportar/Importar"
2. Selecciona "Importar"
3. Elige un archivo JSON previamente exportado
4. La configuración se cargará automáticamente

### Personalizar Configuración
1. Haz clic en "Editar Configuración"
2. Modifica el nombre del cine y precio por butaca
3. Agrega o elimina secciones según necesites
4. Guarda la configuración para usarla después

## Estructura del Proyecto

\`\`\`
cinema-map/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout de la aplicación
│   └── globals.css           # Estilos globales
├── components/
│   ├── cinema-map.tsx        # Componente del mapa de butacas
│   ├── seat-row.tsx          # Componente de fila de butacas
│   ├── analytics-dashboard.tsx # Dashboard de análisis
│   ├── config-editor.tsx     # Editor de configuración
│   ├── export-import-dialog.tsx # Diálogo de exportación/importación
│   └── ui/                   # Componentes UI reutilizables
├── lib/
│   └── cinema-config.ts      # Configuración y funciones del cine
├── package.json              # Dependencias del proyecto
└── README.md                 # Este archivo
\`\`\`

## Especificaciones Técnicas

- **Framework**: Next.js 16
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **State Management**: React Hooks
- **Language**: TypeScript

## Distribución del Cine

- **Lado Izquierdo**: 7 filas × 5 butacas = 35 butacas
- **Centro Izquierdo**: 7 filas × 4 butacas = 28 butacas
- **Centro Derecho**: 7 filas × 4 butacas = 28 butacas
- **Lado Derecho**: 7 filas × 5 butacas = 35 butacas
- **Fila Trasera**: 13 butacas
- **Total**: 139 butacas con simetría perfecta

## Solución de Problemas

### La aplicación no inicia
- Verifica que Node.js esté instalado: `node --version`
- Intenta eliminar la carpeta `node_modules` y ejecutar `npm install` nuevamente

### Puerto 3000 ya está en uso
- Ejecuta: `npm run dev -- -p 3001` para usar otro puerto

### Problemas de importación
- Asegúrate de que el archivo JSON sea válido
- Verifica que el archivo tenga la estructura correcta

## Licencia

Este proyecto está disponible para uso personal y comercial.

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: 2025
