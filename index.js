/* CARGA DE DATOS GUARDADOS */
document.addEventListener("DOMContentLoaded", () => {
    const favoritos = JSON.parse(localStorage.getItem("hk_favs")) || [];
    const vencidos = JSON.parse(localStorage.getItem("hk_vencidos")) || [];

    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
        const nombre = tarjeta.querySelector("h3").textContent;

        if (favoritos.includes(nombre)) {
            tarjeta.querySelector(".fav-btn")?.classList.add("active");
        }

        if (vencidos.includes(nombre)) {
            tarjeta.querySelector(".vencido-btn")?.classList.add("active");
            tarjeta.classList.add("derrotado", "completado");
        }
    });
});



/* INTERACCIONES */
function toggleFav(event, element) {
    event.stopPropagation();
    element.classList.toggle("active");
    
    const nombre = element.closest(".tarjeta").querySelector("h3").textContent;
    let favoritos = JSON.parse(localStorage.getItem("hk_favs")) || [];

    if (element.classList.contains("active")) {
        favoritos.push(nombre);
    } else {
        favoritos = favoritos.filter(fav => fav !== nombre);
    }
    localStorage.setItem("hk_favs", JSON.stringify(favoritos));
}

function toggleVencido(event, element) {
    event.stopPropagation();
    element.classList.toggle("active");
    
    const tarjeta = element.closest(".tarjeta");
    tarjeta.classList.toggle("derrotado");
    tarjeta.classList.toggle("completado");

    const nombre = tarjeta.querySelector("h3").textContent;
    let vencidos = JSON.parse(localStorage.getItem("hk_vencidos")) || [];

    if (tarjeta.classList.contains("derrotado")) {
        vencidos.push(nombre);
    } else {
        vencidos = vencidos.filter(j => j !== nombre);
    }
    localStorage.setItem("hk_vencidos", JSON.stringify(vencidos));
}



/* MENÚ Y BUSCADOR */
function toggleSidebar() {
    document.getElementById('menuBtn').classList.toggle('open');
    document.getElementById('sidebarPanel').classList.toggle('visible');
}

document.addEventListener("keyup", e => {
    if (e.target.matches("#buscador")) {
        const busqueda = e.target.value.toLowerCase();
        
        document.querySelectorAll(".tarjeta").forEach(tarjeta => {
            const nombre = tarjeta.querySelector("h3").textContent.toLowerCase();
            const coincide = nombre.includes(busqueda);
            tarjeta.classList.toggle("filtro", !coincide);
            tarjeta.style.display = coincide ? "block" : "none";
        });

        document.querySelectorAll("section").forEach(seccion => {
            const visibles = seccion.querySelectorAll(".tarjeta:not(.filtro)").length;
            seccion.style.display = visibles === 0 ? "none" : "block";
        });
    }
});



/* FILTROS Y ESTADÍSTICAS */
let mostrandoFavs = false;
function filtrarFavoritos() {
    mostrandoFavs = !mostrandoFavs;
    const btn = event.target;
    btn.style.color = mostrandoFavs ? "#ffee06" : "white";

    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
        const esFav = tarjeta.querySelector(".fav-btn").classList.contains("active");
        tarjeta.style.display = (mostrandoFavs && !esFav) ? "none" : "block";
    });
}

function mostrarEstadisticas() {
    const total = document.querySelectorAll(".tarjeta").length;
    const derrotados = document.querySelectorAll(".tarjeta.derrotado").length;
    alert(`Progreso: ${derrotados} de ${total} personajes derrotados.`);
}

function reiniciarDatos() {
    if (confirm("¿Borrar todo el progreso?")) {
        localStorage.clear();
        location.reload();
    }
}



/* EFECTO BURBUJAS */
function crearBurbuja() {
    const body = document.querySelector('body');
    const burbuja = document.createElement('span');
    burbuja.classList.add('burbuja');

    let size = Math.random() * 15 + 5 + 'px';
    burbuja.style.width = size;
    burbuja.style.height = size;
    burbuja.style.left = Math.random() * 100 + 'vw';
    burbuja.style.animationDuration = Math.random() * 3 + 4 + 's';

    body.appendChild(burbuja);
    setTimeout(() => burbuja.remove(), 9000);
}

setInterval(crearBurbuja, 300);