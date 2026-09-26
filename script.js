document.addEventListener("DOMContentLoaded", function () {

    let estudiantes = JSON.parse(localStorage.getItem("estudiantes") || "[]");
    let atenciones = JSON.parse(localStorage.getItem("atenciones") || "[]");

    function guardar() {
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        localStorage.setItem("atenciones", JSON.stringify(atenciones));
    }

    function $(id) {
        return document.getElementById(id);
    }

    function fechaHoy() {
        const d = new Date();
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    function escapar(texto) {
        return String(texto || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function mostrarToast(texto) {
        const toast = $("toast");
        if (!toast) return;

        toast.textContent = texto;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    /* =========================
       NAVEGACIÓN
    ========================= */

    document.querySelectorAll(".nav-item").forEach(function (boton) {

        boton.addEventListener("click", function (e) {

            e.preventDefault();

            const id = boton.getAttribute("data-section");

            document.querySelectorAll(".section").forEach(function (s) {
                s.classList.remove("active");
            });

            const seccion = $(id);

            if (seccion) {
                seccion.classList.add("active");
            }

            document.querySelectorAll(".nav-item").forEach(function (b) {
                b.classList.remove("active");
            });

            boton.classList.add("active");

            if (id === "estudiantes") renderEstudiantes();
            if (id === "atenciones") renderAtenciones();
            if (id === "seguimientos") renderSeguimientos();

            const titulos = {
                inicio: ["Inicio", "Resumen de la orientación escolar"],
                estudiantes: ["Estudiantes", "Directorio y fichas de estudiantes"],
                atenciones: ["Atenciones", "Historial de encuentros y situaciones atendidas"],
                seguimientos: ["Seguimientos", "Control de compromisos y próximos contactos"]
            };

            if (titulos[id]) {
                if ($("page-title")) $("page-title").textContent = titulos[id][0];
                if ($("page-subtitle")) $("page-subtitle").textContent = titulos[id][1];
            }

        });

    });


    /* =========================
       ABRIR MODALES
    ========================= */

    function abrirModal(id) {
        const modal = $(id);
        if (modal) modal.classList.add("active");
    }

    function cerrarModal(id) {
        const modal = $(id);
        if (modal) modal.classList.remove("active");
    }


    /* =========================
       BOTONES PRINCIPALES
    ========================= */

    if ($("btnAgregarEstudiante")) {
        $("btnAgregarEstudiante").addEventListener("click", function () {
            nuevoEstudiante();
        });
    }

    if ($("btnQuickStudent")) {
        $("btnQuickStudent").addEventListener("click", function () {
            nuevoEstudiante();
        });
    }

    if ($("btnAgregarAtencion")) {
        $("btnAgregarAtencion").addEventListener("click", function () {
            nuevaAtencion();
        });
    }

    if ($("btnNuevaAtencion")) {
        $("btnNuevaAtencion").addEventListener("click", function () {
            nuevaAtencion();
        });
    }

    if ($("btnQuickAttention")) {
        $("btnQuickAttention").addEventListener("click", function () {
            nuevaAtencion();
        });
    }

    if ($("btnQuickFollow")) {
        $("btnQuickFollow").addEventListener("click", function () {
            document.querySelector('[data-section="seguimientos"]')?.click();
        });
    }

    if ($("btnVerAtenciones")) {
        $("btnVerAtenciones").addEventListener("click", function () {
            document.querySelector('[data-section="atenciones"]')?.click();
        });
    }

    if ($("btnVerSeguimientos")) {
        $("btnVerSeguimientos").addEventListener("click", function () {
            document.querySelector('[data-section="seguimientos"]')?.click();
        });
    }


    /* =========================
       CERRAR MODALES
    ========================= */

    document.querySelectorAll("[data-close]").forEach(function (boton) {

        boton.addEventListener("click", function () {
            cerrarModal(boton.getAttribute("data-close"));
        });

    });

    document.querySelectorAll(".modal").forEach(function (modal) {

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {
                cerrarModal(modal.id);
            }

        });

    });


    /* =========================
       ESTUDIANTES
    ========================= */

    function limpiarEstudiante() {

        if ($("form-estudiante")) {
            $("form-estudiante").reset();
        }

        if ($("id-estudiante")) {
            $("id-estudiante").value = "";
        }

        if ($("titulo-modal-estudiante")) {
            $("titulo-modal-estudiante").textContent = "Nuevo estudiante";
        }

    }

    function nuevoEstudiante() {

        limpiarEstudiante();

        abrirModal("modal-estudiante");

        setTimeout(function () {
            if ($("nombre-estudiante")) {
                $("nombre-estudiante").focus();
            }
        }, 100);

    }


    $("form-estudiante")?.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = $("nombre-estudiante").value.trim();
        const curso = $("curso-estudiante").value.trim();
        const edad = $("edad-estudiante").value.trim();
        const observacion = $("observacion-estudiante").value.trim();
        const id = $("id-estudiante").value;

        if (!nombre || !curso) {
            mostrarToast("Completa nombre y curso.");
            return;
        }

        if (id) {

            const estudiante = estudiantes.find(x => x.id === id);

            if (estudiante) {
                estudiante.nombre = nombre;
                estudiante.curso = curso;
                estudiante.edad = edad;
                estudiante.observacion = observacion;
            }

            mostrarToast("Estudiante actualizado.");

        } else {

            estudiantes.push({
                id: Date.now().toString(),
                nombre,
                curso,
                edad,
                observacion
            });

            mostrarToast("Estudiante registrado.");
        }

        guardar();
        cerrarModal("modal-estudiante");
        renderEstudiantes();
        actualizarDashboard();

    });


    function renderEstudiantes(filtro = "") {

        const lista = $("lista-estudiantes");

        if (!lista) return;

        const texto = filtro.toLowerCase();

        const filtrados = estudiantes.filter(function (e) {
            return e.nombre.toLowerCase().includes(texto);
        });

        if ($("cantidad-estudiantes")) {
            $("cantidad-estudiantes").textContent =
                filtrados.length + " estudiante" +
                (filtrados.length === 1 ? "" : "s");
        }

        if (!filtrados.length) {

            lista.innerHTML = `
                <div class="empty-state">
                    <strong>No hay estudiantes registrados</strong>
                    <p>Agrega un estudiante para comenzar.</p>
                </div>
            `;

            return;
        }

        lista.innerHTML = filtrados.map(function (e) {

            return `
                <article class="student-card">

                    <div class="student-top">

                        <div>
                            <h3 class="student-name">
                                ${escapar(e.nombre)}
                            </h3>

                            <div class="student-course">
                                ${escapar(e.curso)}
                            </div>
                        </div>

                    </div>

                    <div class="student-meta">
                        <span>
                            ${e.edad ? "Edad: " + escapar(e.edad) : "Edad no registrada"}
                        </span>
                    </div>

                    <div class="card-actions">

                        <button
                            type="button"
                            class="btn btn-secondary editar-estudiante"
                            data-id="${e.id}">
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn btn-secondary ver-estudiante"
                            data-id="${e.id}">
                            Ver ficha
                        </button>

                        <button
                            type="button"
                            class="btn btn-secondary eliminar-estudiante"
                            data-id="${e.id}">
                            Eliminar
                        </button>

                    </div>

                </article>
            `;

        }).join("");

    }


    document.addEventListener("click", function (e) {

        const editar = e.target.closest(".editar-estudiante");

        if (editar) {

            const estudiante = estudiantes.find(
                x => x.id === editar.dataset.id
            );

            if (!estudiante) return;

            $("id-estudiante").value = estudiante.id;
            $("nombre-estudiante").value = estudiante.nombre;
            $("curso-estudiante").value = estudiante.curso;
            $("edad-estudiante").value = estudiante.edad || "";
            $("observacion-estudiante").value =
                estudiante.observacion || "";

            $("titulo-modal-estudiante").textContent =
                "Editar estudiante";

            abrirModal("modal-estudiante");

            return;
        }


        const eliminar = e.target.closest(".eliminar-estudiante");

        if (eliminar) {

            if (!confirm("¿Eliminar este estudiante?")) return;

            estudiantes = estudiantes.filter(
                x => x.id !== eliminar.dataset.id
            );

            guardar();
            renderEstudiantes();
            actualizarDashboard();

            mostrarToast("Estudiante eliminado.");

            return;
        }


        const ver = e.target.closest(".ver-estudiante");

        if (ver) {

            const estudiante = estudiantes.find(
                x => x.id === ver.dataset.id
            );

            if (!estudiante) return;

            if ($("perfil-nombre")) {
                $("perfil-nombre").textContent =
                    estudiante.nombre;
            }

            if ($("contenido-perfil")) {

                const total = atenciones.filter(
                    x => x.estudianteId === estudiante.id
                ).length;

                $("contenido-perfil").innerHTML = `
                    <div style="padding:22px">

                        <p>
                            <strong>Curso:</strong>
                            ${escapar(estudiante.curso)}
                        </p>

                        <p style="margin-top:10px">
                            <strong>Edad:</strong>
                            ${escapar(estudiante.edad || "No registrada")}
                        </p>

                        <p style="margin-top:10px">
                            <strong>Observaciones:</strong>
                            ${escapar(estudiante.observacion || "Sin observaciones")}
                        </p>

                        <p style="margin-top:10px">
                            <strong>Atenciones:</strong>
                            ${total}
                        </p>

                    </div>
                `;

            }

            abrirModal("modal-perfil");

        }

    });


    /* =========================
       BUSCAR ESTUDIANTE
    ========================= */

    $("buscar-estudiante")?.addEventListener("input", function () {
        renderEstudiantes(this.value);
    });


    /* =========================
       ATENCIONES
    ========================= */

    function nuevaAtencion() {

        if (!estudiantes.length) {

            mostrarToast("Primero registra un estudiante.");

            document.querySelector(
                '[data-section="estudiantes"]'
            )?.click();

            return;
        }

        $("form-atencion")?.reset();

        $("id-atencion").value = "";

        $("fecha-atencion").value = fechaHoy();

        $("titulo-modal-atencion").textContent =
            "Nueva atención";

        const select = $("atencion-estudiante");

        select.innerHTML =
            '<option value="">Selecciona un estudiante</option>';

        estudiantes.forEach(function (e) {

            const option = document.createElement("option");

            option.value = e.id;

            option.textContent =
                e.nombre + " — " + e.curso;

            select.appendChild(option);

        });

        abrirModal("modal-atencion");

    }


    $("form-atencion")?.addEventListener("submit", function (e) {

        e.preventDefault();

        const estudianteId = $("atencion-estudiante").value;
        const fecha = $("fecha-atencion").value;
        const motivo = $("motivo-atencion").value.trim();
        const detalle = $("detalle-atencion").value.trim();

        if (!estudianteId || !fecha || !motivo || !detalle) {

            mostrarToast("Completa los campos obligatorios.");

            return;
        }

        const datos = {

            id:
                $("id-atencion").value ||
                Date.now().toString(),

            estudianteId,
            fecha,
            motivo,
            detalle,

            observaciones:
                $("observaciones-atencion").value.trim(),

            acuerdos:
                $("acuerdos-atencion").value.trim(),

            seguimiento:
                $("seguimiento-atencion").value

        };

        const indice = atenciones.findIndex(
            x => x.id === datos.id
        );

        if (indice >= 0) {

            atenciones[indice] = datos;

            mostrarToast("Atención actualizada.");

        } else {

            atenciones.push(datos);

            mostrarToast("Atención registrada.");

        }

        guardar();

        cerrarModal("modal-atencion");

        renderAtenciones();
        renderSeguimientos();
        actualizarDashboard();

    });


    function renderAtenciones() {

        const lista = $("lista-atenciones");

        if (!lista) return;

        if (!atenciones.length) {

            lista.innerHTML = `
                <div class="empty-state">
                    <strong>No hay atenciones registradas</strong>
                    <p>Registra una atención para comenzar.</p>
                </div>
            `;

            return;
        }

        lista.innerHTML = atenciones
            .slice()
            .reverse()
            .map(function (a) {

                const estudiante =
                    estudiantes.find(
                        x => x.id === a.estudianteId
                    );

                return `
                    <article class="attention-card">

                        <div class="attention-top">

                            <div class="attention-name">
                                ${escapar(
                                    estudiante
                                        ? estudiante.nombre
                                        : "Estudiante"
                                )}
                            </div>

                            <div class="attention-date">
                                ${a.fecha}
                            </div>

                        </div>

                        <div class="attention-motive">
                            ${escapar(a.motivo)}
                        </div>

                        <div class="attention-detail">
                            ${escapar(a.detalle)}
                        </div>

                        <div class="card-actions">

                            <button
                                type="button"
                                class="btn btn-secondary editar-atencion"
                                data-id="${a.id}">
                                Editar
                            </button>

                            <button
                                type="button"
                                class="btn btn-secondary eliminar-atencion"
                                data-id="${a.id}">
                                Eliminar
                            </button>

                        </div>

                    </article>
                `;

            }).join("");

    }


    document.addEventListener("click", function (e) {

        const editar = e.target.closest(".editar-atencion");

        if (editar) {

            const a = atenciones.find(
                x => x.id === editar.dataset.id
            );

            if (!a) return;

            nuevaAtencion();

            $("id-atencion").value = a.id;
            $("atencion-estudiante").value = a.estudianteId;
            $("fecha-atencion").value = a.fecha;
            $("motivo-atencion").value = a.motivo;
            $("detalle-atencion").value = a.detalle;
            $("observaciones-atencion").value =
                a.observaciones || "";
            $("acuerdos-atencion").value =
                a.acuerdos || "";
            $("seguimiento-atencion").value =
                a.seguimiento || "";

            $("titulo-modal-atencion").textContent =
                "Editar atención";

            return;
        }


        const eliminar = e.target.closest(".eliminar-atencion");

        if (eliminar) {

            if (!confirm("¿Eliminar esta atención?")) return;

            atenciones = atenciones.filter(
                x => x.id !== eliminar.dataset.id
            );

            guardar();
            renderAtenciones();
            renderSeguimientos();
            actualizarDashboard();

            mostrarToast("Atención eliminada.");

        }

    });


    /* =========================
       SEGUIMIENTOS
    ========================= */

    document.querySelectorAll(".follow-tab").forEach(function (tab) {

        tab.addEventListener("click", function () {

            document.querySelectorAll(".follow-tab")
                .forEach(x => x.classList.remove("active"));

            tab.classList.add("active");

            renderSeguimientos(
                tab.getAttribute("data-filter")
            );

        });

    });


    function renderSeguimientos(filtro = "todos") {

        const lista = $("lista-seguimientos");

        if (!lista) return;

        let datos = atenciones.filter(
            x => x.seguimiento
        );

        const hoy = fechaHoy();

        if (filtro === "pendientes") {
            datos = datos.filter(
                x => x.seguimiento >= hoy
            );
        }

        if (filtro === "vencidos") {
            datos = datos.filter(
                x => x.seguimiento < hoy
            );
        }

        if (!datos.length) {

            lista.innerHTML = `
                <div class="empty-state">
                    <strong>No hay seguimientos</strong>
                    <p>No existen registros para este filtro.</p>
                </div>
            `;

            return;
        }

        lista.innerHTML = datos.map(function (a) {

            const estudiante =
                estudiantes.find(
                    x => x.id === a.estudianteId
                );

            return `
                <article class="follow-card">

                    <div class="follow-main">

                        <strong>
                            ${escapar(
                                estudiante
                                    ? estudiante.nombre
                                    : "Estudiante"
                            )}
                        </strong>

                        <span>
                            ${escapar(a.motivo)}
                        </span>

                    </div>

                    <span class="follow-status pending">
                        ${a.seguimiento}
                    </span>

                </article>
            `;

        }).join("");

    }


    /* =========================
       DASHBOARD
    ========================= */

    function actualizarDashboard() {

        if ($("total-estudiantes")) {
            $("total-estudiantes").textContent =
                estudiantes.length;
        }

        if ($("total-atenciones")) {
            $("total-atenciones").textContent =
                atenciones.length;
        }

        if ($("total-seguimientos")) {
            $("total-seguimientos").textContent =
                atenciones.filter(x => x.seguimiento).length;
        }

        if ($("total-hoy")) {
            $("total-hoy").textContent =
                atenciones.filter(
                    x => x.fecha === fechaHoy()
                ).length;
        }

    }


    /* =========================
       FECHA
    ========================= */

    if ($("date")) {

        $("date").textContent =
            new Date().toLocaleDateString(
                "es-CO",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    /* =========================
       INICIO
    ========================= */

    actualizarDashboard();
    renderEstudiantes();
    renderAtenciones();
    renderSeguimientos();

});
