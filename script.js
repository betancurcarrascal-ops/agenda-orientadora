var estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
var atenciones = JSON.parse(localStorage.getItem("atenciones")) || [];

document.addEventListener("DOMContentLoaded", function () {

    iniciarNavegacion();
    iniciarBotones();
    iniciarModales();
    iniciarFormularios();
    iniciarBusqueda();

    iniciarNotas();

    actualizarTodo();
    mostrarFecha();
    mostrarNotas();
});


/* =========================
   NAVEGACIÓN
========================= */

function iniciarNavegacion() {

    var botones = document.querySelectorAll(".nav-item");

    botones.forEach(function (boton) {

        boton.addEventListener("click", function () {

            var seccion = boton.getAttribute("data-section");

            mostrarSeccion(seccion);

        });

    });
}


function mostrarSeccion(nombre) {

    var secciones = document.querySelectorAll(".section");
    var botones = document.querySelectorAll(".nav-item");

    secciones.forEach(function (seccion) {
        seccion.classList.remove("active");
    });

    botones.forEach(function (boton) {
        boton.classList.remove("active");
    });

    var seccionActiva = document.getElementById(nombre);

    if (seccionActiva) {
        seccionActiva.classList.add("active");
    }

    botones.forEach(function (boton) {

        if (boton.getAttribute("data-section") === nombre) {
            boton.classList.add("active");
        }

    });

    cambiarTitulo(nombre);
}


function cambiarTitulo(nombre) {

    var titulo = document.getElementById("page-title");
    var subtitulo = document.getElementById("page-subtitle");

    if (nombre === "inicio") {
        titulo.textContent = "Inicio";
        subtitulo.textContent = "Resumen de la orientación escolar";
    }

    if (nombre === "estudiantes") {
        titulo.textContent = "Estudiantes";
        subtitulo.textContent = "Directorio y fichas de estudiantes";
    }

    if (nombre === "atenciones") {
        titulo.textContent = "Atenciones";
        subtitulo.textContent = "Historial de encuentros y situaciones";
    }

    if (nombre === "seguimientos") {
        titulo.textContent = "Seguimientos";
        subtitulo.textContent = "Control de compromisos y próximos contactos";
    }
}


/* =========================
   BOTONES
========================= */

function iniciarBotones() {

    var btnNuevaAtencion = document.getElementById("btnNuevaAtencion");
    var btnQuickAttention = document.getElementById("btnQuickAttention");
    var btnAgregarEstudiante = document.getElementById("btnAgregarEstudiante");
    var btnAgregarAtencion = document.getElementById("btnAgregarAtencion");
    var btnQuickStudent = document.getElementById("btnQuickStudent");
    var btnQuickFollow = document.getElementById("btnQuickFollow");
    var btnVerAtenciones = document.getElementById("btnVerAtenciones");
    var btnVerSeguimientos = document.getElementById("btnVerSeguimientos");

    if (btnNuevaAtencion) {
        btnNuevaAtencion.addEventListener("click", function () {
            abrirAtencion();
        });
    }

    if (btnQuickAttention) {
        btnQuickAttention.addEventListener("click", function () {
            abrirAtencion();
        });
    }

    if (btnAgregarEstudiante) {
        btnAgregarEstudiante.addEventListener("click", function () {
            abrirEstudiante();
        });
    }

    if (btnQuickStudent) {
        btnQuickStudent.addEventListener("click", function () {
            abrirEstudiante();
        });
    }

    if (btnAgregarAtencion) {
        btnAgregarAtencion.addEventListener("click", function () {
            abrirAtencion();
        });
    }

    if (btnQuickFollow) {
        btnQuickFollow.addEventListener("click", function () {
            mostrarSeccion("seguimientos");
        });
    }

    if (btnVerAtenciones) {
        btnVerAtenciones.addEventListener("click", function () {
            mostrarSeccion("atenciones");
        });
    }

    if (btnVerSeguimientos) {
        btnVerSeguimientos.addEventListener("click", function () {
            mostrarSeccion("seguimientos");
        });
    }
}


/* =========================
   MODALES
========================= */

function iniciarModales() {

    var cierres = document.querySelectorAll("[data-close]");

    cierres.forEach(function (boton) {

        boton.addEventListener("click", function () {

            var id = boton.getAttribute("data-close");

            cerrarModal(id);

        });

    });

    var modales = document.querySelectorAll(".modal");

    modales.forEach(function (modal) {

        modal.addEventListener("click", function (evento) {

            if (evento.target === modal) {
                modal.classList.remove("active");
            }

        });

    });

    document.addEventListener("keydown", function (evento) {

        if (evento.key === "Escape") {

            var abiertos = document.querySelectorAll(".modal.active");

            abiertos.forEach(function (modal) {
                modal.classList.remove("active");
            });

        }

    });
}


function abrirModal(id) {

    var modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
    }
}


function cerrarModal(id) {

    var modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }
}


/* =========================
   ESTUDIANTE
========================= */

function abrirEstudiante() {

    var formulario = document.getElementById("form-estudiante");

    if (formulario) {
        formulario.reset();
    }

    document.getElementById("id-estudiante").value = "";

    document.getElementById("titulo-modal-estudiante").textContent =
        "Nuevo estudiante";

    abrirModal("modal-estudiante");
}


function iniciarFormularios() {

    var formularioEstudiante = document.getElementById("form-estudiante");
    var formularioAtencion = document.getElementById("form-atencion");

    if (formularioEstudiante) {

        formularioEstudiante.addEventListener("submit", function (evento) {

            evento.preventDefault();

            guardarEstudiante();

        });

    }

    if (formularioAtencion) {

        formularioAtencion.addEventListener("submit", function (evento) {

            evento.preventDefault();

            guardarAtencion();

        });

    }
}


function guardarEstudiante() {

    var nombre = document.getElementById("nombre-estudiante").value.trim();
    var curso = document.getElementById("curso-estudiante").value.trim();
    var edad = document.getElementById("edad-estudiante").value;
    var observacion = document.getElementById("observacion-estudiante").value.trim();

    if (nombre === "" || curso === "") {

        mostrarToast("Completa el nombre y el curso.");

        return;
    }

    var id = document.getElementById("id-estudiante").value;

    if (id !== "") {

        estudiantes = estudiantes.map(function (estudiante) {

            if (estudiante.id === id) {

                estudiante.nombre = nombre;
                estudiante.curso = curso;
                estudiante.edad = edad;
                estudiante.observacion = observacion;

            }

            return estudiante;

        });

        mostrarToast("Estudiante actualizado.");

    } else {

        var estudianteNuevo = {

            id: generarId(),
            nombre: nombre,
            curso: curso,
            edad: edad,
            observacion: observacion,
            fecha: fechaActual()

        };

        estudiantes.push(estudianteNuevo);

        mostrarToast("Estudiante registrado.");

    }

    guardarDatos();

    cerrarModal("modal-estudiante");

    actualizarTodo();
}


/* =========================
   MOSTRAR ESTUDIANTES
========================= */

function mostrarEstudiantes(filtro) {

    var contenedor = document.getElementById("lista-estudiantes");

    if (!contenedor) {
        return;
    }

    filtro = filtro || "";

    var encontrados = estudiantes.filter(function (estudiante) {

        return estudiante.nombre
            .toLowerCase()
            .includes(filtro.toLowerCase());

    });

    contenedor.innerHTML = "";

    if (encontrados.length === 0) {

        contenedor.innerHTML =
            '<div class="empty-state">' +
            '<h3>No hay estudiantes</h3>' +
            '<p>Registra un estudiante para comenzar.</p>' +
            '</div>';

        return;
    }

    encontrados.forEach(function (estudiante) {

        var tarjeta = document.createElement("article");

        tarjeta.className = "student-card";

        tarjeta.innerHTML =
            '<div class="student-top">' +

                '<div class="student-avatar">' +
                    obtenerIniciales(estudiante.nombre) +
                '</div>' +

                '<div class="student-info">' +
                    '<h3 class="student-name">' +
                        escaparHTML(estudiante.nombre) +
                    '</h3>' +

                    '<p class="student-course">' +
                        escaparHTML(estudiante.curso) +
                    '</p>' +

                    '<div class="student-meta">' +
                        (estudiante.edad ?
                            '<span>' + estudiante.edad + ' años</span>' :
                            '') +
                    '</div>' +

                '</div>' +

            '</div>' +

            '<div class="card-actions">' +

                '<button class="btn btn-secondary btn-ver" data-id="' +
                    estudiante.id +
                '">' +
                    'Ver ficha' +
                '</button>' +

                '<button class="btn btn-secondary btn-editar" data-id="' +
                    estudiante.id +
                '">' +
                    'Editar' +
                '</button>' +

                '<button class="btn btn-danger btn-eliminar" data-id="' +
                    estudiante.id +
                '">' +
                    'Eliminar' +
                '</button>' +

            '</div>';

        contenedor.appendChild(tarjeta);

    });

    conectarBotonesEstudiantes();
    actualizarCantidadEstudiantes(encontrados.length);
}


function conectarBotonesEstudiantes() {

    var botonesVer = document.querySelectorAll(".btn-ver");
    var botonesEditar = document.querySelectorAll(".btn-editar");
    var botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesVer.forEach(function (boton) {

        boton.addEventListener("click", function () {

            abrirPerfil(boton.getAttribute("data-id"));

        });

    });

    botonesEditar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            editarEstudiante(boton.getAttribute("data-id"));

        });

    });

    botonesEliminar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            eliminarEstudiante(boton.getAttribute("data-id"));

        });

    });
}


function editarEstudiante(id) {

    var estudiante = estudiantes.find(function (item) {
        return item.id === id;
    });

    if (!estudiante) {
        return;
    }

    document.getElementById("id-estudiante").value = estudiante.id;
    document.getElementById("nombre-estudiante").value = estudiante.nombre;
    document.getElementById("curso-estudiante").value = estudiante.curso;
    document.getElementById("edad-estudiante").value = estudiante.edad || "";
    document.getElementById("observacion-estudiante").value =
        estudiante.observacion || "";

    document.getElementById("titulo-modal-estudiante").textContent =
        "Editar estudiante";

    abrirModal("modal-estudiante");
}


function eliminarEstudiante(id) {

    var estudiante = estudiantes.find(function (item) {
        return item.id === id;
    });

    if (!estudiante) {
        return;
    }

    var confirmar = confirm(
        "¿Deseas eliminar a " + estudiante.nombre + "?"
    );

    if (!confirmar) {
        return;
    }

    estudiantes = estudiantes.filter(function (item) {
        return item.id !== id;
    });

    atenciones = atenciones.filter(function (item) {
        return item.estudianteId !== id;
    });

    guardarDatos();

    actualizarTodo();

    mostrarToast("Estudiante eliminado.");
}


/* =========================
   PERFIL
========================= */

function abrirPerfil(id) {

    var estudiante = estudiantes.find(function (item) {
        return item.id === id;
    });

    if (!estudiante) {
        return;
    }

    var contenedor = document.getElementById("contenido-perfil");

    var historial = atenciones.filter(function (atencion) {
        return atencion.estudianteId === id;
    });

    var html = "";

    html += '<div class="profile-summary">';

    html += '<div class="student-avatar large">';
    html += obtenerIniciales(estudiante.nombre);
    html += '</div>';

    html += '<div>';
    html += '<h3>' + escaparHTML(estudiante.nombre) + '</h3>';
    html += '<p>' + escaparHTML(estudiante.curso) + '</p>';
    html += '</div>';

    html += '</div>';

    html += '<div class="profile-grid">';

    html += '<div class="profile-item">';
    html += '<span>Edad</span>';
    html += '<strong>' +
        (estudiante.edad || "No registrada") +
        '</strong>';
    html += '</div>';

    html += '<div class="profile-item">';
    html += '<span>Atenciones</span>';
    html += '<strong>' + historial.length + '</strong>';
    html += '</div>';

    html += '</div>';

    html += '<div class="profile-section">';
    html += '<h4>Observación general</h4>';
    html += '<p>' +
        escaparHTML(
            estudiante.observacion || "No hay observaciones registradas."
        ) +
        '</p>';
    html += '</div>';

    html += '<div class="profile-section">';
    html += '<h4>Historial de atenciones</h4>';

    if (historial.length === 0) {

        html += '<p>No hay atenciones registradas.</p>';

    } else {

        historial.forEach(function (atencion) {

            html += '<div class="profile-attention">';
            html += '<strong>' +
                escaparHTML(atencion.motivo) +
                '</strong>';

            html += '<span>' +
                atencion.fecha +
                '</span>';

            html += '<p>' +
                escaparHTML(atencion.detalle) +
                '</p>';

            html += '</div>';

        });

    }

    html += '</div>';

    contenedor.innerHTML = html;

    abrirModal("modal-perfil");
}


/* =========================
   ATENCIONES
========================= */

function abrirAtencion() {

    if (estudiantes.length === 0) {

        mostrarToast("Primero debes registrar un estudiante.");

        mostrarSeccion("estudiantes");

        return;
    }

    var formulario = document.getElementById("form-atencion");

    if (formulario) {
        formulario.reset();
    }

    document.getElementById("id-atencion").value = "";

    document.getElementById("titulo-modal-atencion").textContent =
        "Nueva atención";

    cargarEstudiantesSelect();

    document.getElementById("fecha-atencion").value =
        fechaActual();

    abrirModal("modal-atencion");
}


function cargarEstudiantesSelect() {

    var select = document.getElementById("atencion-estudiante");

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Selecciona un estudiante</option>';

    estudiantes.forEach(function (estudiante) {

        var option = document.createElement("option");

        option.value = estudiante.id;

        option.textContent =
            estudiante.nombre + " — " + estudiante.curso;

        select.appendChild(option);

    });
}


function guardarAtencion() {

    var estudianteId =
        document.getElementById("atencion-estudiante").value;

    var fecha =
        document.getElementById("fecha-atencion").value;

    var motivo =
        document.getElementById("motivo-atencion").value.trim();

    var detalle =
        document.getElementById("detalle-atencion").value.trim();

    var observaciones =
        document.getElementById("observaciones-atencion").value.trim();

    var acuerdos =
        document.getElementById("acuerdos-atencion").value.trim();

    var seguimiento =
        document.getElementById("seguimiento-atencion").value;

    if (
        estudianteId === "" ||
        fecha === "" ||
        motivo === "" ||
        detalle === ""
    ) {

        mostrarToast("Completa los campos obligatorios.");

        return;
    }

    var id = document.getElementById("id-atencion").value;

    if (id !== "") {

        atenciones = atenciones.map(function (atencion) {

            if (atencion.id === id) {

                atencion.estudianteId = estudianteId;
                atencion.fecha = fecha;
                atencion.motivo = motivo;
                atencion.detalle = detalle;
                atencion.observaciones = observaciones;
                atencion.acuerdos = acuerdos;
                atencion.seguimiento = seguimiento;

            }

            return atencion;

        });

        mostrarToast("Atención actualizada.");

    } else {

        atenciones.push({

            id: generarId(),
            estudianteId: estudianteId,
            fecha: fecha,
            motivo: motivo,
            detalle: detalle,
            observaciones: observaciones,
            acuerdos: acuerdos,
            seguimiento: seguimiento

        });

        mostrarToast("Atención registrada.");
    }

    guardarDatos();

    cerrarModal("modal-atencion");

    actualizarTodo();
}


/* =========================
   LISTA DE ATENCIONES
========================= */

function mostrarAtenciones() {

    var contenedor = document.getElementById("lista-atenciones");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (atenciones.length === 0) {

        contenedor.innerHTML =
            '<div class="empty-state">' +
            '<h3>No hay atenciones registradas</h3>' +
            '<p>Las atenciones aparecerán aquí.</p>' +
            '</div>';

        return;
    }

    var ordenadas = atenciones.slice().sort(function (a, b) {

        return b.fecha.localeCompare(a.fecha);

    });

    ordenadas.forEach(function (atencion) {

        var estudiante = estudiantes.find(function (item) {
            return item.id === atencion.estudianteId;
        });

        var nombreEstudiante =
            estudiante ? estudiante.nombre : "Estudiante eliminado";

        var tarjeta = document.createElement("article");

        tarjeta.className = "attention-card";

        tarjeta.innerHTML =
            '<div class="attention-main">' +

                '<div>' +

                    '<span class="attention-date">' +
                        atencion.fecha +
                    '</span>' +

                    '<h3>' +
                        escaparHTML(atencion.motivo) +
                    '</h3>' +

                    '<p class="attention-student">' +
                        escaparHTML(nombreEstudiante) +
                    '</p>' +

                    '<p>' +
                        escaparHTML(atencion.detalle) +
                    '</p>' +

                '</div>' +

            '</div>';

        contenedor.appendChild(tarjeta);

    });
}


/* =========================
   SEGUIMIENTOS
========================= */

function mostrarSeguimientos(filtro) {

    var contenedor =
        document.getElementById("lista-seguimientos");

    if (!contenedor) {
        return;
    }

    filtro = filtro || "todos";

    contenedor.innerHTML = "";

    var seguimientos = atenciones.filter(function (atencion) {

        return atencion.seguimiento !== "";

    });

    var hoy = fechaActual();

    if (filtro === "pendientes") {

        seguimientos = seguimientos.filter(function (atencion) {
            return atencion.seguimiento >= hoy;
        });

    }

    if (filtro === "vencidos") {

        seguimientos = seguimientos.filter(function (atencion) {
            return atencion.seguimiento < hoy;
        });

    }

    if (filtro === "realizados") {

        seguimientos = seguimientos.filter(function (atencion) {
            return atencion.seguimiento < hoy;
        });

    }

    if (seguimientos.length === 0) {

        contenedor.innerHTML =
            '<div class="empty-state">' +
            '<h3>No hay seguimientos</h3>' +
            '<p>No existen seguimientos para mostrar.</p>' +
            '</div>';

        return;
    }

    seguimientos.forEach(function (atencion) {

        var estudiante = estudiantes.find(function (item) {
            return item.id === atencion.estudianteId;
        });

        var nombre =
            estudiante ? estudiante.nombre : "Estudiante";

        var item = document.createElement("div");

        item.className = "follow-item";

        item.innerHTML =
            '<div>' +
                '<strong>' +
                    escaparHTML(nombre) +
                '</strong>' +

                '<p>' +
                    escaparHTML(atencion.motivo) +
                '</p>' +
            '</div>' +

            '<span>' +
                atencion.seguimiento +
            '</span>';

        contenedor.appendChild(item);

    });
}


function iniciarFiltrosSeguimiento() {

    var botones =
        document.querySelectorAll(".follow-tab");

    botones.forEach(function (boton) {

        boton.addEventListener("click", function () {

            botones.forEach(function (item) {
                item.classList.remove("active");
            });

            boton.classList.add("active");

            var filtro =
                boton.getAttribute("data-filter");

            mostrarSeguimientos(filtro);

        });

    });
}


/* =========================
   BÚSQUEDA
========================= */

function iniciarBusqueda() {

    var buscador =
        document.getElementById("buscar-estudiante");

    if (!buscador) {
        return;
    }

    buscador.addEventListener("input", function () {

        mostrarEstudiantes(buscador.value);

    });

    iniciarFiltrosSeguimiento();
}


/* =========================
   ACTUALIZAR TODO
========================= */

function actualizarTodo() {

    mostrarEstudiantes();
    mostrarAtenciones();
    mostrarSeguimientos();

    actualizarEstadisticas();
    actualizarInicio();
}


function actualizarEstadisticas() {

    var totalEstudiantes =
        document.getElementById("total-estudiantes");

    var totalAtenciones =
        document.getElementById("total-atenciones");

    var totalSeguimientos =
        document.getElementById("total-seguimientos");

    var totalHoy =
        document.getElementById("total-hoy");

    if (totalEstudiantes) {
        totalEstudiantes.textContent = estudiantes.length;
    }

    if (totalAtenciones) {
        totalAtenciones.textContent = atenciones.length;
    }

    if (totalSeguimientos) {

        var cantidad = atenciones.filter(function (atencion) {
            return atencion.seguimiento !== "";
        }).length;

        totalSeguimientos.textContent = cantidad;
    }

    if (totalHoy) {

        var hoy = fechaActual();

        var cantidadHoy = atenciones.filter(function (atencion) {
            return atencion.fecha === hoy;
        }).length;

        totalHoy.textContent = cantidadHoy;
    }
}


function actualizarInicio() {

    var ultimas =
        document.getElementById("ultimas-atenciones");

    if (ultimas) {

        ultimas.innerHTML = "";

        var recientes = atenciones.slice().sort(function (a, b) {
            return b.fecha.localeCompare(a.fecha);
        }).slice(0, 5);

        if (recientes.length === 0) {

            ultimas.innerHTML =
                '<div class="empty-state">' +
                '<p>No hay atenciones recientes.</p>' +
                '</div>';

        } else {

            recientes.forEach(function (atencion) {

                var estudiante = estudiantes.find(function (item) {
                    return item.id === atencion.estudianteId;
                });

                var nombre =
                    estudiante ? estudiante.nombre : "Estudiante";

                var item = document.createElement("div");

                item.className = "list-item";

                item.innerHTML =
                    '<div>' +
                        '<strong>' +
                            escaparHTML(nombre) +
                        '</strong>' +

                        '<p>' +
                            escaparHTML(atencion.motivo) +
                        '</p>' +
                    '</div>' +

                    '<span>' +
                        atencion.fecha +
                    '</span>';

                ultimas.appendChild(item);

            });
        }
    }

    var proximos =
        document.getElementById("proximos-seguimientos");

    if (proximos) {

        proximos.innerHTML = "";

        var seguimientos = atenciones.filter(function (atencion) {
            return atencion.seguimiento !== "";
        }).sort(function (a, b) {
            return a.seguimiento.localeCompare(b.seguimiento);
        }).slice(0, 5);

        if (seguimientos.length === 0) {

            proximos.innerHTML =
                '<div class="empty-state">' +
                '<p>No hay seguimientos pendientes.</p>' +
                '</div>';

        } else {

            seguimientos.forEach(function (atencion) {

                var estudiante = estudiantes.find(function (item) {
                    return item.id === atencion.estudianteId;
                });

                var nombre =
                    estudiante ? estudiante.nombre : "Estudiante";

                var item = document.createElement("div");

                item.className = "list-item";

                item.innerHTML =
                    '<div>' +
                        '<strong>' +
                            escaparHTML(nombre) +
                        '</strong>' +

                        '<p>' +
                            escaparHTML(atencion.motivo) +
                        '</p>' +
                    '</div>' +

                    '<span>' +
                        atencion.seguimiento +
                    '</span>';

                proximos.appendChild(item);

            });
        }
    }
}


/* =========================
   UTILIDADES
========================= */

function guardarDatos() {

    localStorage.setItem(
        "estudiantes",
        JSON.stringify(estudiantes)
    );

    localStorage.setItem(
        "atenciones",
        JSON.stringify(atenciones)
    );
}


function generarId() {

    return Date.now().toString() +
        Math.random().toString(16).slice(2);
}


function fechaActual() {

    var ahora = new Date();

    var año = ahora.getFullYear();

    var mes = String(
        ahora.getMonth() + 1
    ).padStart(2, "0");

    var dia = String(
        ahora.getDate()
    ).padStart(2, "0");

    return año + "-" + mes + "-" + dia;
}


function mostrarFecha() {

    var elemento =
        document.getElementById("date");

    if (!elemento) {
        return;
    }

    var ahora = new Date();

    elemento.textContent =
        ahora.toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}


function obtenerIniciales(nombre) {

    var partes = nombre.trim().split(" ");

    if (partes.length === 1) {
        return partes[0].substring(0, 2).toUpperCase();
    }

    return (
        partes[0].charAt(0) +
        partes[partes.length - 1].charAt(0)
    ).toUpperCase();
}


function actualizarCantidadEstudiantes(cantidad) {

    var elemento =
        document.getElementById("cantidad-estudiantes");

    if (!elemento) {
        return;
    }

    elemento.textContent =
        cantidad +
        (cantidad === 1 ? " estudiante" : " estudiantes");
}


function mostrarToast(mensaje) {

    var toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = mensaje;

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}


function escaparHTML(texto) {

    var div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}
/* =========================================================
   NOTAS DE CONVERSACIÓN
========================================================= */

var notasConversacion =
    JSON.parse(localStorage.getItem("notasConversacion")) || [];


/* =========================
   INICIAR NOTAS
========================= */

function iniciarNotas() {

    var btnNuevaNota =
        document.getElementById("btnNuevaNota");

    var btnGuardarNota =
        document.getElementById("btnGuardarNota");

    var btnEliminarNota =
        document.getElementById("btnEliminarNota");

    var contenido =
        document.getElementById("nota-contenido");

    var estudiante =
        document.getElementById("nota-estudiante");

    if (btnNuevaNota) {

        btnNuevaNota.addEventListener("click", function () {
            nuevaNota();
        });

    }

    if (btnGuardarNota) {

        btnGuardarNota.addEventListener("click", function () {
            guardarNota();
        });

    }

    if (btnEliminarNota) {

        btnEliminarNota.addEventListener("click", function () {
            eliminarNotaActual();
        });

    }

    if (contenido) {

        contenido.addEventListener("input", function () {

            actualizarContadorPalabras();

            marcarNotaModificada();

        });

    }

    if (estudiante) {

        estudiante.addEventListener("change", function () {

            marcarNotaModificada();

        });

    }

    var titulo =
        document.getElementById("nota-titulo");

    if (titulo) {

        titulo.addEventListener("input", function () {
            marcarNotaModificada();
        });

    }

    var fecha =
        document.getElementById("nota-fecha");

    if (fecha) {

        fecha.addEventListener("change", function () {
            marcarNotaModificada();
        });

    }

    var botonesEditor =
        document.querySelectorAll(".editor-button");

    botonesEditor.forEach(function (boton) {

        boton.addEventListener("click", function () {

            var comando =
                boton.getAttribute("data-command");

            document.execCommand(comando, false, null);

            if (contenido) {
                contenido.focus();
            }

        });

    });

}


/* =========================
   NUEVA NOTA
========================= */

function nuevaNota() {

    if (estudiantes.length === 0) {

        mostrarToast(
            "Primero debes registrar un estudiante."
        );

        mostrarSeccion("estudiantes");

        return;
    }

    limpiarEditorNota();

    cargarEstudiantesNota();

    document.getElementById("nota-fecha").value =
        fechaActual();

    document.getElementById("estado-nota").textContent =
        "Nueva nota";

    actualizarContadorPalabras();

    var select =
        document.getElementById("nota-estudiante");

    if (estudiantes.length === 1) {
        select.value = estudiantes[0].id;
    }
}


/* =========================
   CARGAR ESTUDIANTES
========================= */

function cargarEstudiantesNota() {

    var select =
        document.getElementById("nota-estudiante");

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Selecciona un estudiante</option>';

    estudiantes.forEach(function (estudiante) {

        var option =
            document.createElement("option");

        option.value = estudiante.id;

        option.textContent =
            estudiante.nombre +
            " — " +
            estudiante.curso;

        select.appendChild(option);

    });

}


/* =========================
   MOSTRAR NOTAS
========================= */

function mostrarNotas() {

    var lista =
        document.getElementById("lista-notas");

    if (!lista) {
        return;
    }

    cargarEstudiantesNota();

    lista.innerHTML = "";

    var cantidad =
        document.getElementById("cantidad-notas");

    if (cantidad) {

        cantidad.textContent =
            notasConversacion.length +
            (
                notasConversacion.length === 1
                    ? " nota"
                    : " notas"
            );

    }

    if (notasConversacion.length === 0) {

        lista.innerHTML =
            '<div class="notes-empty">' +
            'Todavía no hay notas de conversación.' +
            '<br><br>' +
            'Pulsa "Nueva nota" para comenzar.' +
            '</div>';

        return;
    }

    var ordenadas =
        notasConversacion.slice().sort(function (a, b) {

            return b.fecha.localeCompare(a.fecha);

        });

    ordenadas.forEach(function (nota) {

        var estudiante =
            estudiantes.find(function (item) {

                return item.id === nota.estudianteId;

            });

        var nombre =
            estudiante
                ? estudiante.nombre
                : "Estudiante eliminado";

        var boton =
            document.createElement("button");

        boton.type = "button";

        boton.className =
            "note-list-item";

        boton.setAttribute(
            "data-id",
            nota.id
        );

        boton.innerHTML =
            '<span class="note-list-title">' +
                escaparHTML(
                    nota.titulo ||
                    "Conversación sin título"
                ) +
            '</span>' +

            '<span class="note-list-student">' +
                escaparHTML(nombre) +
            '</span>' +

            '<span class="note-list-date">' +
                nota.fecha +
            '</span>';

        boton.addEventListener(
            "click",
            function () {

                abrirNota(nota.id);

            }
        );

        lista.appendChild(boton);

    });

}


/* =========================
   ABRIR NOTA
========================= */

function abrirNota(id) {

    var nota =
        notasConversacion.find(function (item) {

            return item.id === id;

        });

    if (!nota) {
        return;
    }

    cargarEstudiantesNota();

    document.getElementById(
        "nota-estudiante"
    ).value = nota.estudianteId;

    document.getElementById(
        "nota-titulo"
    ).value = nota.titulo || "";

    document.getElementById(
        "nota-fecha"
    ).value = nota.fecha || fechaActual();

    document.getElementById(
        "nota-contenido"
    ).innerHTML = nota.contenido || "";

    document.getElementById(
        "estado-nota"
    ).textContent = "Nota guardada";

    document.getElementById(
        "btnGuardarNota"
    ).setAttribute("data-editing", nota.id);

    actualizarContadorPalabras();

    var botones =
        document.querySelectorAll(".note-list-item");

    botones.forEach(function (boton) {

        boton.classList.remove("active");

        if (
            boton.getAttribute("data-id") === id
        ) {
            boton.classList.add("active");
        }

    });

}


/* =========================
   GUARDAR NOTA
========================= */

function guardarNota() {

    var estudianteId =
        document.getElementById(
            "nota-estudiante"
        ).value;

    var titulo =
        document.getElementById(
            "nota-titulo"
        ).value.trim();

    var fecha =
        document.getElementById(
            "nota-fecha"
        ).value;

    var contenido =
        document.getElementById(
            "nota-contenido"
        ).innerHTML.trim();

    if (estudianteId === "") {

        mostrarToast(
            "Selecciona un estudiante."
        );

        return;
    }

    if (titulo === "") {

        titulo =
            "Conversación con el estudiante";

    }

    if (contenido === "") {

        mostrarToast(
            "Escribe el contenido de la conversación."
        );

        return;
    }

    var boton =
        document.getElementById(
            "btnGuardarNota"
        );

    var id =
        boton.getAttribute("data-editing");

    if (id) {

        notasConversacion =
            notasConversacion.map(function (nota) {

                if (nota.id === id) {

                    nota.estudianteId =
                        estudianteId;

                    nota.titulo =
                        titulo;

                    nota.fecha =
                        fecha;

                    nota.contenido =
                        contenido;

                    nota.modificado =
                        new Date().toISOString();

                }

                return nota;

            });

        mostrarToast(
            "Nota actualizada."
        );

    } else {

        var nueva = {

            id: generarId(),

            estudianteId:
                estudianteId,

            titulo:
                titulo,

            fecha:
                fecha,

            contenido:
                contenido,

            creado:
                new Date().toISOString(),

            modificado:
                new Date().toISOString()

        };

        notasConversacion.push(nueva);

        boton.setAttribute(
            "data-editing",
            nueva.id
        );

        mostrarToast(
            "Nota guardada."
        );

    }

    localStorage.setItem(
        "notasConversacion",
        JSON.stringify(
            notasConversacion
        )
    );

    document.getElementById(
        "estado-nota"
    ).textContent = "Guardado";

    mostrarNotas();

    marcarNotaGuardada();
}


/* =========================
   ELIMINAR NOTA
========================= */

function eliminarNotaActual() {

    var boton =
        document.getElementById(
            "btnGuardarNota"
        );

    var id =
        boton.getAttribute(
            "data-editing"
        );

    if (!id) {

        limpiarEditorNota();

        return;
    }

    var confirmar =
        confirm(
            "¿Deseas eliminar esta nota de conversación?"
        );

    if (!confirmar) {
        return;
    }

    notasConversacion =
        notasConversacion.filter(
            function (nota) {
                return nota.id !== id;
            }
        );

    localStorage.setItem(
        "notasConversacion",
        JSON.stringify(
            notasConversacion
        )
    );

    limpiarEditorNota();

    mostrarNotas();

    mostrarToast(
        "Nota eliminada."
    );

}


/* =========================
   LIMPIAR EDITOR
========================= */

function limpiarEditorNota() {

    var estudiante =
        document.getElementById(
            "nota-estudiante"
        );

    var titulo =
        document.getElementById(
            "nota-titulo"
        );

    var fecha =
        document.getElementById(
            "nota-fecha"
        );

    var contenido =
        document.getElementById(
            "nota-contenido"
        );

    var boton =
        document.getElementById(
            "btnGuardarNota"
        );

    if (estudiante) {
        estudiante.value = "";
    }

    if (titulo) {
        titulo.value = "";
    }

    if (fecha) {
        fecha.value = fechaActual();
    }

    if (contenido) {
        contenido.innerHTML = "";
    }

    if (boton) {

        boton.removeAttribute(
            "data-editing"
        );

    }

    var estado =
        document.getElementById(
            "estado-nota"
        );

    if (estado) {
        estado.textContent =
            "Nueva nota";
    }

    actualizarContadorPalabras();

    document
        .querySelectorAll(".note-list-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });

}


/* =========================
   CONTADOR
========================= */

function actualizarContadorPalabras() {

    var contenido =
        document.getElementById(
            "nota-contenido"
        );

    var contador =
        document.getElementById(
            "contador-palabras"
        );

    if (!contenido || !contador) {
        return;
    }

    var texto =
        contenido.innerText.trim();

    if (texto === "") {

        contador.textContent =
            "0 palabras";

        return;
    }

    var palabras =
        texto.split(/\s+/).filter(
            function (palabra) {
                return palabra.length > 0;
            }
        );

    contador.textContent =
        palabras.length +
        (
            palabras.length === 1
                ? " palabra"
                : " palabras"
        );

}


/* =========================
   ESTADO
========================= */

function marcarNotaModificada() {

    var boton =
        document.getElementById(
            "btnGuardarNota"
        );

    if (
        boton &&
        boton.getAttribute("data-editing")
    ) {

        document.getElementById(
            "estado-nota"
        ).textContent =
            "Cambios sin guardar";

    }

}


function marcarNotaGuardada() {

    var estado =
        document.getElementById(
            "estado-nota"
        );

    if (estado) {

        estado.textContent =
            "Guardado correctamente";

    }

}
