# Studio XR — Portafolio

Sitio web del estudio de experiencias inmersivas y UX.  
Stack: **HTML / CSS / JS vanilla + Three.js**

---

## 📁 Estructura del repositorio

```
studioxr/
├── index.html              ← HTML base (NO editar)
├── styles.css              ← Estilos globales (NO editar sin coordinar)
├── main.js                 ← Lógica Three.js e interacciones (NO editar sin coordinar)
│
├── data/
│   └── projects.js         ← ✏️ Agrega/edita proyectos aquí
│
├── members/
│   ├── alejo.js            ← ✏️ Alejo edita solo este archivo
│   ├── andres.js           ← ✏️ Andrés edita solo este archivo
│   ├── nicolas.js          ← ✏️ Nicolás edita solo este archivo
│   └── julian.js           ← ✏️ Julián edita solo este archivo
│
└── assets/
    ├── photos/             ← Sube tu foto aquí (ver instrucciones abajo)
    └── projects/           ← Imágenes de proyectos
```

---

## 👤 Cómo editar tu información personal

**Solo toca TU archivo en `members/`.**

Abre `members/tu-nombre.js` y edita los campos:

```js
const MEMBER_ALEJO = {
  name:    'Alejo García',        // ← Nombre completo
  role:    'XR Developer',        // ← Tu rol en el estudio
  bio:     'Tu descripción...',   // ← 2-3 oraciones sobre ti
  photo:   'assets/photos/alejo.jpg', // ← nombre de tu foto (ver abajo)
  initial: 'AG',                  // ← Iniciales (se muestran si no hay foto)
  skills:  ['Unity', 'C#', '...'], // ← Hasta 6 skills
  links: {
    linkedin:  'https://linkedin.com/in/tu-perfil',
    github:    'https://github.com/tu-usuario',
    portfolio: 'https://tu-portafolio.com'  // opcional
  }
};
```

### Agregar tu foto
1. Nombra el archivo con tu nombre en minúsculas: `alejo.jpg`
2. Tamaño recomendado: **600×800px** (portrait, 3:4)
3. Cópialo a la carpeta `assets/photos/`
4. Asegúrate que el campo `photo` en tu `.js` coincida con ese nombre

---

## 🗂️ Cómo agregar un proyecto

Abre `data/projects.js` y agrega un objeto al array `PROJECTS`:

```js
{
  id:          'project-05',           // ID único, sin espacios
  title:       'Nombre del Proyecto',
  category:    'VR · Cliente',
  desc:        'Descripción corta del proyecto...',
  image:       'assets/projects/project-05.jpg', // opcional
  featured:    false,                  // true = card grande destacada
  accentColor: '#E8600A',              // color de acento en la Gallery 3D
  members:     ['alejo', 'nicolas'],   // IDs de quienes participaron
  tags:        ['VR', 'Unity', 'UX'],
  link:        'https://...'           // URL del proyecto (opcional)
}
```

El proyecto aparece automáticamente en:
- **Las tarjetas estáticas** de la sección Proyectos
- **The Gallery 3D** como una pantalla interactiva

---

## 🚀 Correr localmente

El sitio **no funciona abriendo el HTML directamente** en el navegador  
porque los archivos `.js` se cargan como módulos locales.  
Necesitas un servidor local:

```bash
# Con Python (viene instalado en Mac/Linux)
python3 -m http.server 8080

# Con Node.js
npx serve .

# Con VS Code
# Instala la extensión "Live Server" y haz click en "Go Live"
```

Luego abre `http://localhost:8080` en el navegador.

---

## 🔀 Flujo de trabajo en GitHub

```bash
# 1. Clona el repo
git clone https://github.com/usuario/studioxr.git
cd studioxr

# 2. Crea tu rama personal
git checkout -b feature/alejo-info

# 3. Edita TU archivo en members/
# 4. Agrega tu foto a assets/photos/

# 5. Commit
git add members/alejo.js assets/photos/alejo.jpg
git commit -m "feat: agrega info y foto de Alejo"

# 6. Push
git push origin feature/alejo-info

# 7. Crea un Pull Request en GitHub hacia main
```

> ⚠️ **Regla de oro:** nunca hagas push directo a `main`.  
> Siempre crea una rama y un Pull Request para que el equipo revise.

---

## 🎨 Stack técnico

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura base |
| CSS3 | Estilos, animaciones, responsive |
| JavaScript ES6+ | Lógica e interacciones |
| [Three.js r128](https://threejs.org/) | Escenas 3D (Hero, Gallery, Particles) |
| Google Fonts | Black Han Sans + Space Mono + DM Sans |

---
