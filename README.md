# Flashcards App

Flashcards App es una aplicación inspirada en Anki, diseñada para ayudarte a estudiar de manera eficiente utilizando el método de **repetición espaciada**. Ofrece una experiencia personalizada para múltiples usuarios, permitiendo gestionar mazos de cartas y realizar un seguimiento de tu progreso.

## 💡 Sobre este proyecto

**Flashcards App** es el resultado de un reto personal: desarrollar una aplicación . Quería replicar la funcionalidad de herramientas populares de **repetición espaciada**, explorando conceptos como:

- Algoritmos de repetición espaciada (SM2 y personalizaciones).
- Single Page Aplications con Javascript vanilla
- Gestión de usuarios
- Majeno rutas hash, interconexion entre componentes
- Manejo del DOM para componentes dinamicos al ser una SPA
- Optimización de frontend y diseño responsivo.

El objetivo principal fue aprender más sobre el desarrollo de aplicaciones completas (frontend y backend) con Javascript vanilla y vite.js, mientras creaba algo con una utilidad real.

## 🧩 Características principales

### 1. **Manejo de usuarios**
- Soporte para múltiples usuarios con cuentas individuales.
- Registro e inicio de sesión seguro.

### 2. **Gestión de mazos**
- Crear nuevos mazos desde cero.
- Agregar cartas manualmente o importar mazos completos desde archivos CSV (con formato de frente y reverso de las cartas).
- Eliminar o editar cartas de un mazo existente.
- Reiniciar el progreso de un mazo para empezar desde cero.

### 3. **Seguimiento del progreso**
Dentro de cada mazo puedes:
- Visualizar tu progreso general:
  - Número de cartas estudiadas.
  - Número de cartas no estudiadas.
  - Cartas disponibles para revisar ese día.
- Ver una lista detallada de cartas:
  - Estado de estudio.
  - Próxima fecha de revisión.

### 4. **Estudio de cartas**
- Función principal de estudiar cartas:
  - Muestra solo las cartas habilitadas para estudio (fecha de revisión cumplida) o las que aún no se han estudiado.
  - Interfaz intuitiva para calificar cada carta con:
    - **Again**, **Hard**, **Good**, **Easy**.
  - Algoritmo de repetición espaciada basado en SM2 y ajustes personalizados:
    - Calcula la nueva fecha de revisión en función de la repetición, el factor de facilidad, el intervalo y la calificación otorgada.

### 5. **Configuración del usuario**
- Cambiar entre modo oscuro y claro para una experiencia visual personalizada.
- Cerrar sesión.

---

## 🛠️ Tecnologías utilizadas

Este proyecto utiliza las siguientes tecnologías y herramientas:

- **Frontend**: Javascript vanilla con SPA
- **Herramienta de desarrollo**: Vite
- **Estilos**: TailwindCSS para diseño responsivo y estilización.
- **Iconos y UI**: DaisyUI, Fontawesome.
- **Control de versiones**: GitHub.
- **Backend**: Conexión a una API construida con Express.js [api.flashcards-app](https://github.com/kaizendev26/api.flashcards-app)
- **Algoritmo de repetición espaciada**: Implementación personalizada basada en SM2.

## ✨ Próximas mejoras

Se que este proyecto personal no esta completamente terminado. Algunas ideas para futuras mejoras incluyen:

- Implementar notificaciones para recordar las sesiones de estudio.
- Integración con una aplicación móvil (Android e iOS).
- Agregar estadísticas mas avanzadas para el seguimiento del aprendizaje.
- Opciones de personalización más detalladas para cada usuario.
- Migración hacia un Framework como React
