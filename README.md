# 📋 Proyecto: Gestor de Tareas (Prueba Técnica)

Este proyecto es una **aplicación web** desarrollada con **Vue 3 + Vite** que permite gestionar tareas de forma dinámica a través de un tablero Kanban con estados: **Por Hacer**, **En Proceso** y **Completado**.

Cuenta con autenticación, manejo de tareas, movimiento de tareas entre columnas, edición, eliminación y filtros dinámicos.

---

## 🚀 Funcionalidades principales

- Login con autenticación por token
- Redirección según sesión activa
- Gestión de tareas (crear, editar, eliminar, mover entre columnas)
- Drag & Drop de tareas entre columnas
- Modal para crear y editar tareas
- Eliminación de tareas con confirmación
- Loader de carga de tareas
- Mensajes en columnas vacías
- Interfaz responsiva y minimalista usando TailwindCSS
- Navegación protegida por sesión
- Persistencia de sesión con localStorage

---

## 🧪 Usuario de prueba

Puedes iniciar sesión con el siguiente usuario de prueba:

| Correo               | Contraseña   |
|----------------------|--------------|
| user1@prueba.com      | password123  |

---

## 🛠️ Instalación

```bash
# Clona el proyecto
git clone https://github.com/tu-usuario/tu-repo.git

cd tu-repo

# Instala dependencias
yarn install

# Ejecuta en modo desarrollo
yarn run dev
