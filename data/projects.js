/**
 * ─────────────────────────────────────────
 *  PROYECTOS — data/projects.js
 *  Agrega o edita proyectos aquí.
 *  Estos se renderizan en la sección estática
 *  Y en la Gallery 3D automáticamente.
 * ─────────────────────────────────────────
 */
const PROJECTS = [
  {
    id:       'project-01',
    title:    'Título del Proyecto Destacado',
    category: 'Experiencia VR · Cliente corporativo',
    desc:     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula leo nec justo fermentum, nec facilisis arcu consectetur nulla facilisi.',
    image:    'assets/projects/project-01.jpg',  // ← Imagen del proyecto
    featured: true,                               // ← aparece como card grande
    // Color de acento en la Gallery 3D (hex string)
    accentColor: '#E8600A',
    members:  ['alejo', 'andres'],               // ← IDs de quienes participaron
    tags:     ['VR', 'Unity', 'UX'],
    link:     ''                                  // ← URL del proyecto (opcional)
  },
  {
    id:       'project-02',
    title:    'Custom VR Playground',
    category: 'Meta Quest. Virtual Reality. Desktop App.',
    desc:     'Plataforma de pruebas en realidad virtual creada para explorar y perfeccionar diferentes formas de interacción inmersiva. Incluye manipulación física de objetos, sistemas de colocación, mecánicas de lanzamiento y dispositivos interactivos como palancas, botones y herramientas dinámicas.',
    image:    'assets/projects/project-02.png',
    featured: false,
    accentColor: '#FF8040',
    members:  ['andres', 'julian'],
    tags:     ['UX', 'Figma', 'Mobile'],
    link:     ''
  },
  {
    id:       'project-03',
    title:    'Nombre del Proyecto',
    category: 'AR · Educación',
    desc:     'Lorem ipsum dolor sit amet, consectetur adipiscing elit nec facilisis arcu consectetur.',
    image:    'assets/projects/project-03.jpg',
    featured: false,
    accentColor: '#E8600A',
    members:  ['nicolas', 'alejo'],
    tags:     ['AR', 'Blender', '3D'],
    link:     ''
  },
  {
    id:       'project-04',
    title:    'Nombre del Proyecto',
    category: '3D · Retail',
    desc:     'Lorem ipsum dolor sit amet, consectetur adipiscing elit nec facilisis arcu consectetur.',
    image:    'assets/projects/project-04.jpg',
    featured: false,
    accentColor: '#FF6020',
    members:  ['nicolas', 'julian'],
    tags:     ['3D', 'Motion', 'WebGL'],
    link:     ''
  }
];
