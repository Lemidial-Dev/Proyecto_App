# Catálogo de Productos con Laravel y API FakeStore

## Descripción

Sistema de catálogo de productos desarrollado con:

- **Backend:** Laravel (API REST)
- **Frontend:** Tailwind CSS + JavaScript
- **Datos de prueba:** Integración con API FakeStore
- **Almacenamiento:** Firebase Storage para imágenes

---

## Tecnologías Clave

- **Laravel 10** (PHP)
- **Tailwind CSS** (Diseño frontend)
- **JavaScript** (Interacciones dinámicas)
- **API FakeStore** (Datos de productos demo)
- **Firebase Storage** (Almacenamiento de imágenes)
- **MySQL** (Base de datos)

---

## Configuración Inicial

### 1. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-catalogo.git
cd proyecto-catalogo
```

### 2. Instalar dependencias

```bash
composer install
npm install
```

### 3. Configurar entorno

```bash
cp .env.example .env
php artisan key:generate
```

Edita el archivo `.env` y configura:

- Credenciales de MySQL
- Claves de Firebase
- URL de API FakeStore

### 4. Migrar base de datos

```bash
php artisan migrate --seed
```

### 5. Ejecutar proyecto

```bash
php artisan serve
npm run dev
```

Accede en: [http://localhost:8000](http://localhost:8000)

---

## Características

- Catálogo de productos con datos reales de FakeStore API
- Diseño responsive con Tailwind CSS
- Sistema de carga de imágenes a Firebase
- **No utiliza Blade:** frontend puro con JavaScript

---