/* CARGA DE DATOS GUARDADOS */

document.addEventListener("DOMContentLoaded", () => {
    const favoritos = JSON.parse(localStorage.getItem("hk_favs")) || [];
    const vencidos = JSON.parse(localStorage.getItem("hk_vencidos")) || [];

    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
        const nombre = tarjeta.querySelector("h3").textContent.trim();

        if (favoritos.includes(nombre)) {
            tarjeta.querySelector(".fav-btn")?.classList.add("active");
        }

        if (vencidos.includes(nombre)) {
            const btnVencido = tarjeta.querySelector(".vencido-btn");

            if (btnVencido) {
                btnVencido.classList.add("active");
                tarjeta.classList.add("derrotado", "completado");
            }
        }
    });

    actualizarProgreso();
});


/*FAVORITOS*/

function toggleFav(event, element) {
    event.stopPropagation();

    element.classList.toggle("active");

    const tarjeta = element.closest(".tarjeta");
    const nombre = tarjeta.querySelector("h3").textContent.trim();

    let favoritos = JSON.parse(localStorage.getItem("hk_favs")) || [];

    if (element.classList.contains("active")) {
        if (!favoritos.includes(nombre)) {
            favoritos.push(nombre);
        }
    } else {
        favoritos = favoritos.filter(fav => fav !== nombre);
    }

    localStorage.setItem("hk_favs", JSON.stringify(favoritos));
}


/*MARCAR JEFE COMO VENCIDO */

function toggleVencido(event, element) {
    event.stopPropagation();

    element.classList.toggle("active");

    const tarjeta = element.closest(".tarjeta");
    tarjeta.classList.toggle("derrotado");
    tarjeta.classList.toggle("completado");

    const nombre = tarjeta.querySelector("h3").textContent.trim();

    let vencidos = JSON.parse(localStorage.getItem("hk_vencidos")) || [];

    if (tarjeta.classList.contains("derrotado")) {
        if (!vencidos.includes(nombre)) {
            vencidos.push(nombre);
        }
    } else {
        vencidos = vencidos.filter(jefe => jefe !== nombre);
    }

    localStorage.setItem("hk_vencidos", JSON.stringify(vencidos));

    actualizarProgreso();
}


/*MENÚ LATERAL */

function toggleSidebar() {
    const menuBtn = document.getElementById("menuBtn");
    const sidebarPanel = document.getElementById("sidebarPanel");

    menuBtn.classList.toggle("open");
    sidebarPanel.classList.toggle("visible");
}


/* BUSCADOR */

document.addEventListener("keyup", e => {
    if (e.target.matches("#buscador")) {
        const busqueda = e.target.value.toLowerCase().trim();

        document.querySelectorAll(".tarjeta").forEach(tarjeta => {
            const textoTarjeta = tarjeta.textContent.toLowerCase();
            const coincide = textoTarjeta.includes(busqueda);

            tarjeta.classList.toggle("filtro", !coincide);
            tarjeta.style.display = coincide ? "block" : "none";
        });

        actualizarSeccionesVisibles();
    }
});


/* MOSTRAR SECCIONES VACÍAS*/

function actualizarSeccionesVisibles() {
    document.querySelectorAll("section").forEach(seccion => {
        if (seccion.classList.contains("intro-proyecto")) {
            seccion.style.display = "block";
            return;
        }

        const tarjetas = seccion.querySelectorAll(".tarjeta");
        const tarjetasVisibles = Array.from(tarjetas).filter(tarjeta => {
            return tarjeta.style.display !== "none";
        });

        if (tarjetas.length > 0) {
            seccion.style.display = tarjetasVisibles.length === 0 ? "none" : "block";
        }
    });
}


/*FILTRAR FAVORITOS */

let mostrandoFavoritos = false;

function filtrarFavoritos() {
    mostrandoFavoritos = !mostrandoFavoritos;

    document.body.setAttribute("data-filtro-favoritos", mostrandoFavoritos);

    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
        const esFavorito = tarjeta.querySelector(".fav-btn")?.classList.contains("active");

        if (mostrandoFavoritos && !esFavorito) {
            tarjeta.style.display = "none";
        } else {
            tarjeta.style.display = "block";
        }
    });

    actualizarSeccionesVisibles();

    const mensaje = mostrandoFavoritos
        ? "Mostrando solo tus favoritos."
        : "Mostrando todos los personajes y jefes.";

    Swal.fire({
        title: mostrandoFavoritos ? "Favoritos" : "Vista completa",
        text: mensaje,
        icon: "info",
        background: "#121212",
        color: "#ffffff",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#7ea9ff"
    });
}


/*OBTENER SOLO JEFES CONTABLES */

function obtenerJefesContables() {
    return document.querySelectorAll(
        ".seccion-jefes .tarjeta, .seccion-secundarios .tarjeta, .seccion-oniricos .tarjeta"
    );
}


/* ACTUALIZAR PROGRESO EN LA PÁGINA */

function actualizarProgreso() {
    const jefes = obtenerJefesContables();
    const totalJefes = jefes.length;

    let jefesVencidos = 0;

    jefes.forEach(tarjeta => {
        if (tarjeta.classList.contains("derrotado")) {
            jefesVencidos++;
        }
    });

    let porcentaje = 0;

    if (totalJefes > 0) {
        porcentaje = Math.round((jefesVencidos / totalJefes) * 100);
    }

    const textoProgreso = document.getElementById("textoProgreso");
    const porcentajeProgreso = document.getElementById("porcentajeProgreso");
    const barraProgreso = document.getElementById("barraProgreso");

    if (textoProgreso) {
        textoProgreso.textContent = `Jefes derrotados: ${jefesVencidos} / ${totalJefes}`;
    }

    if (porcentajeProgreso) {
        porcentajeProgreso.textContent = `${porcentaje}% completado`;
    }

    if (barraProgreso) {
        barraProgreso.style.width = `${porcentaje}%`;
    }
}


/*BOTÓN PROGRESO DEL MENÚ */

function mostrarEstadisticas() {
    const jefes = obtenerJefesContables();
    const totalJefes = jefes.length;

    let jefesVencidos = 0;

    jefes.forEach(tarjeta => {
        if (tarjeta.classList.contains("derrotado")) {
            jefesVencidos++;
        }
    });

    let porcentaje = 0;

    if (totalJefes > 0) {
        porcentaje = Math.round((jefesVencidos / totalJefes) * 100);
    }

    Swal.fire({
        title: '<span class="tit-hk">PROGRESO DE JEFES</span>',
        html: `
            <p class="frase-hk">
                Este progreso solo cuenta jefes principales, secundarios y oníricos.
            </p>

            <p class="texto-alerta-hk">
                Has derrotado <b>${jefesVencidos}</b> de <b>${totalJefes}</b> jefes.
            </p>

            <div class="barra-alerta">
                <div class="barra-alerta-interna" style="width: ${porcentaje}%"></div>
            </div>

            <p class="texto-alerta-hk porcentaje-alerta">
                ${porcentaje}% completado
            </p>
        `,
        background: "#121212",
        color: "#ffffff",
        confirmButtonText: "ENTENDIDO",
        confirmButtonColor: "#7ea9ff",
        customClass: {
            popup: "popup-hk"
        }
    });
}


/*REINICIAR DATOS */

function reiniciarDatos() {
    Swal.fire({
        title: '<span class="tit-hk">¿estas seguro de lo que haces?</span>',
        text: "Se borrara todo tu progreso y favoritos",
        icon: "warning",
        background: "#121212",
        color: "#ffffff",
        showCancelButton: true,
        confirmButtonText: "Si, borra todo",
        cancelButtonText: "No, ya lo pense mejor",
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn-hk-danger",
            cancelButton: "btn-hk-cancel",
            popup: "popup-hk"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();

            Swal.fire({
                title: "Datos reiniciados",
                text: "Todo fue borrado correctamente",
                icon: "success",
                background: "#121212",
                color: "#ffffff",
                confirmButtonColor: "#7ea9ff"
            }).then(() => {
                location.reload();
            });
        }
    });
}


/* EFECTO BURBUJAS*/

function crearBurbuja() {
    const body = document.querySelector("body");
    const burbuja = document.createElement("span");

    burbuja.classList.add("burbuja");

    const size = Math.random() * 15 + 5 + "px";

    burbuja.style.width = size;
    burbuja.style.height = size;
    burbuja.style.left = Math.random() * 100 + "vw";
    burbuja.style.animationDuration = Math.random() * 3 + 4 + "s";

    body.appendChild(burbuja);

    setTimeout(() => {
        burbuja.remove();
    }, 9000);
}

setInterval(crearBurbuja, 300);