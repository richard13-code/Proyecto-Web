[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=23612558)
# Ejercicio: Peticiones Web con JavaScript (XMLHttpRequest + DOM)

Este ejercicio te guía paso a paso para practicar las **peticiones HTTP desde el navegador** mediante `XMLHttpRequest`, el recorrido de arreglos con `forEach`, la creación dinámica de filas en una tabla HTML, y el filtrado de datos con `filter` e `includes`.

---

## 1) Requisitos previos

- Un navegador web moderno (Chrome, Edge, Firefox, Safari).
- Un editor de código (VS Code, Sublime, etc.).
- Git instalado en tu máquina.

## 2) Archivos del proyecto

- `index.html` → Página web principal con la tabla y los controles de carga y búsqueda.
- `js/request.js` → Script con la lógica de peticiones HTTP y manipulación del DOM.
- `css/` → Estilos del proyecto.
- `readme.md` → Este documento con el tutorial paso a paso.

Para ver el resultado, **abre `index.html` en tu navegador**.

---

## 3) Objetivo de aprendizaje

- Comprender qué es `XMLHttpRequest` y cómo se usa para consumir una API.
- Practicar el recorrido de arreglos con `forEach` y las funciones flecha (`=>`).
- Crear filas de tabla dinámicamente con `createElement` y `append`.
- Filtrar datos en memoria con `filter` e `includes`.
- Asociar eventos a botones sin modificar el HTML.

---

## 4) Paso a paso

### Paso 1 — Clonar el repositorio y explorar la petición HTTP

Clona el repositorio en tu máquina local:

```
git clone "{url}"
```

1. Abre `index.html` en tu navegador.
2. Revisa el código fuente en VS Code.
3. Haz clic en el botón **Remove Data**.
4. Abre `js/request.js` y responde en `entregable.txt`:
   - ¿Qué es el objeto generado por `XMLHttpRequest`?
   - ¿Qué hace el método `open` de `xhr`?
   - ¿Qué hace el método `onload` de `xhr`?
5. Abre la consola del navegador, escribe `data` y presiona Enter. ¿Qué muestra la consola?

---

### Paso 2 — Recorrer el arreglo y generar filas en la tabla

1. Dentro de la función `getData`, en el bloque `xhr.onload`, recorre el arreglo devuelto por la API e imprime cada elemento en la consola:

```js
array.forEach(element => {
    console.log(element);
});
```

2. Responde en `entregable.txt`: ¿qué significa `=>` en el código anterior?

3. Crea la siguiente función, que recibe un objeto JSON y genera una fila `<tr>` con sus datos:

```js
function genTr(json) {
    tr = document.createElement("tr");
    td1 = document.createElement("td");
    td2 = document.createElement("td");
    td3 = document.createElement("td");
    td4 = document.createElement("td");
    td5 = document.createElement("td");

    td1.innerText = json.id;
    td2.innerText = json.title;
    td3.innerText = json.price;
    td4.innerText = json.description;
    td5.innerText = json.category;
    tr.append(td1, td2, td3, td4, td5);
    return tr;
}
```

4. Incorpora `genTr` dentro del recorrido del arreglo para poblar la tabla:

```js
array.forEach(element => {
    tbody.append(genTr(element));
});
```

---

### Paso 3 — Conectar el botón Load Data y agregar el filtro de búsqueda

1. Asocia la función `getData` al evento `click` del botón **Load Data** **sin modificar el HTML**.

2. Agrega un evento al botón de búsqueda que filtre los elementos de `data.json` según el título del artículo. Investiga la propiedad `filter` de los arreglos y el método `includes` de las cadenas:

```js
filtered = data.json.filter(function(e) {
    return e.title.includes(input.value);
});
console.log(filtered);
```

3. Responde en `entregable.txt`: ¿qué hace `filter` y cómo funciona `includes` en este contexto?

---

### Paso 4 — Implementar la búsqueda en la tabla

1. Usando el código del paso anterior como base, haz que al hacer clic en **Search**:
   - Se filtre `data.json` con el valor del campo de texto.
   - Se vacíe el contenido actual de la tabla.
   - Se llene la tabla únicamente con las filas que coincidan con el filtro.

---

### Paso 5 — Subir los cambios al repositorio

1. Guarda todos los cambios realizados.
2. Agrega los archivos modificados al área de staging:

```
git add entregable.txt
git add js/request.js
```

3. Crea una rama llamada `entregable`:

```
git branch entregable
```

4. Cámbiate a esa rama:

```
git checkout entregable
```

5. Realiza el commit y el push:

```
git commit -m "entregable"
git push origin entregable
```

6. Abre el repositorio en GitHub y solicita un **Pull Request** desde la rama `entregable` hacia `main`.
