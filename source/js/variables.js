const urlApi = "https://movie.azurewebsites.net/api/cartelera";

let movies = [];
let editIndex = null;

const form = document.getElementById('cinemaForm');
const descriptionInput = document.getElementById("description");
const posterInput = document.getElementById("poster");
const titleInput = document.getElementById("title");
const ubicationInput = document.getElementById("ubication");
const typeSelect = document.getElementById("type");
const yearInput = document.getElementById("year");
const movieList = document.getElementById('movieList');
const editIndexInput = document.getElementById('editIndex');

async function renderMovies() {
    const url = `${urlApi}?title=&ubication=`;

    try {
    const response = await fetch(url);
    const results = await response.json();

    movieList.innerHTML = ""; // Limpiar las tarjetas anteriores
    
    for (let i = 0; i < results.length; i++) {
        const listItem = document.createElement("div");
        // console.log(results[i]);
        listItem.innerHTML = `
            <strong>Título:</strong> ${results[i].Title}<br>
            <strong>Descripcion:</strong> ${results[i].description}<br>
            <strong>Género:</strong> ${results[i].Type}<br>
            <strong>Año:</strong> ${results[i].Year}<br>
            <strong>Ubicacion:</strong> ${results[i].Ubication}

            <button class="btn btn-warning" onclick="editMovie('${results[i].imdbID}')">Editar</button>
            <button class="btn btn-danger" onclick="deleteMovie('${results[i].imdbID}')">Eliminar</button>
        `;
        movieList.appendChild(listItem);
    }
  } catch (error) {
    console.log(error);
  }
}

// async function addMovie() {
//     const movie = {
//       imdbID: Date.now().toString(),
//       Title: titleInput.value,
//       Year: yearInput.value,
//       Type: typeSelect.value,
//       Poster: posterInput.value,
//       Estado: true,
//       description: descriptionInput.value,
//       Ubication: ubicationInput.value,
//     };
    
//     try {
//         const response = await fetch(`${urlApi}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(movie),
//         });

//         if (response.ok) {
//             alert("Cartelera creada con éxito.");
//             form.reset();
//             renderMovies();
//         } else {
//             const errorData = await response.json();
//             console.error("Error al crear la cartelera:", errorData);
//             alert("No se pudo crear la cartelera.");
//         }
//     } catch (error) {
//         console.error("Error al crear la cartelera:", error);
//         alert("Error de conexión al crear la cartelera.");
//     }
// }

async function addMovie() {
    const movie = {
        imdbID: editIndex ? editIndex : Date.now().toString(),  // Usar el ID existente si se está editando
        Title: titleInput.value,
        Year: yearInput.value,
        Type: typeSelect.value,
        Poster: posterInput.value,
        Estado: true,
        description: descriptionInput.value,
        Ubication: ubicationInput.value,
    };

    try {
        const method = editIndex ? "PUT" : "POST";  // Si estamos editando, usar PUT, sino POST
        const url = editIndex ? `${urlApi}?imdbID=${editIndex}` : `${urlApi}`;  // Cambiar la URL si estamos editando
        
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(movie),
        });

        if (response.ok) {
            const message = editIndex ? "Cartelera actualizada con éxito." : "Cartelera creada con éxito.";
            alert(message);
            form.reset();
            renderMovies();
            editIndex = null;  // Reiniciar el índice de edición
        } else {
            const errorData = await response.json();
            console.error("Error al procesar la solicitud:", errorData);
            alert("No se pudo procesar la solicitud.");
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        alert("Error de conexión.");
    }
}

async function editMovie(imdbID) {
    editIndex = imdbID;
    // const movie = movies[imdbID];
    const url = `${urlApi}?imdbID=${imdbID}`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        // console.log(movie);

        titleInput.value = movie.Title;
        yearInput.value = movie.Year;
        typeSelect.value = movie.Type;
        posterInput.value = movie.Poster;
        descriptionInput.value = movie.description;
        ubicationInput.value = movie.Ubication;
        editIndexInput.value = imdbID;
    } catch (error) {
        console.log(error);
    }
}

async function deleteMovie(imdbID) {
    const url = `${urlApi}?imdbID=${imdbID}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Película eliminada con éxito.");
        } else {
            const errorData = await response.json();
            console.log("Error al eliminar la película:", errorData);
            alert("No se pudo eliminar la película.");
        }
    } catch (error) {
        console.log("Error al eliminar la película:", error);
    }
  renderMovies();
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    addMovie();
});

// Render initial empty state
renderMovies();