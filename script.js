document.addEventListener("DOMContentLoaded", () => {

    let estudiantes = JSON.parse(localStorage.getItem("estudiantes") || "[]");
    let atenciones = JSON.parse(localStorage.getItem("atenciones") || "[]");
    let notas = JSON.parse(localStorage.getItem("notas") || "[]");

    let notaActual = null;

    const $ = id => document.getElementById(id);

    function guardarDatos() {
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        localStorage.setItem("atenciones", JSON.stringify(atenciones));
        localStorage.setItem("notas", JSON.stringify(notas));
    }

    function hoy() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    function escapar(texto) {
        return String(texto ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function toast(mensaje) {
        const contenedor = $("toast-container");
        if (!contenedor) return;

        const elemento = document.createElement("div");
        elemento.className = "toast";
        elemento.textContent = mensaje;

        contenedor.appendChild(elemento);

        setTimeout(() => elemento.classList.add("show"), 10);

        setTimeout(() => {
            elemento.classList.remove("show");
            setTimeout(() => elemento.remove(), 300);
        }, 2500);
    }

    /* =====================================================
       FECHA
    ===================================================== */

    if ($("fecha-actual")) {
        $("fecha-actual").textContent =
            new Date().toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }


    /* =====================================================
       NAVEGACIÓN
    ===================================================== */

    const titulos = {
        inicio: [
            "Inicio",
            "Panel de orientación escolar"
        ],
        estudiantes: [
            "Estudiantes",
            "Registro de estudiantes atendidos por orientación."
        ],
        atenciones: [
            "Atenciones",
            "Registro de las atenciones realizadas."
        ],
        seguimientos: [
            "Seguimientos",
            "Consulta y organiza los seguimientos pendientes."
        ],
        notas: [
            "Notas de conversación",
            "Registra y conserva las conversaciones realizadas."
        ]
    };

    document.querySelectorAll(".nav-item").forEach(boton => {

        boton.addEventListener("click", () => {

            const seccion = boton.dataset.section;

            document.querySelectorAll(".nav-item")
                .forEach(b => b.classList.remove("active"));

            boton.classList.add("active");

            document.querySelectorAll(".section")
                .forEach(s => s.classList.remove("active"));

            const destino = $(seccion);

            if (destino) {
                destino.classList.add("active");
            }

            if (titulos[seccion]) {
                $("page-title").textContent = titulos[seccion][0];
                $("page-subtitle").textContent = titulos[seccion][1];
            }

            if (seccion === "estudiantes") renderEstudiantes();
            if (seccion === "atenciones") renderAtenciones();
            if (seccion === "seguimientos") renderSeguimientos();
            if (seccion === "notas") prepararNotas();

        });

    });


    /* =====================================================
       MODALES
    ===================================================== */

    function abrirModal(id) {
        const modal = $(id);
        if (modal) modal.classList.add("active");
    }

    function cerrarModal(id) {
        const modal = $(id);
        if (modal) modal.classList.remove("active");
    }

    document.querySelectorAll("[data-close-modal]").forEach(boton => {

        boton.addEventListener("click", () => {
            cerrarModal(boton.dataset.closeModal);
        });

    });

    document.querySelectorAll(".modal").forEach(modal => {

        modal.addEventListener("click", e => {

            if (e.target === modal) {
                cerrarModal(modal.id);
            }

        });

    });


    /* =====================================================
       ESTUDIANTES
    ===================================================== */

    function abrirNuevoEstudiante() {

        $("formEstudiante").reset();

        abrirModal("modalEstudiante");

        setTimeout(() => {
            $("estudiante-nombre")?.focus();
        }, 100);
    }

    $("btnAgregarEstudiante")?.addEventListener(
        "click",
        abrirNuevoEstudiante
    );

    $("btnQuickStudent")?.addEventListener(
        "click",
        abrirNuevoEstudiante
    );


    $("formEstudiante")?.addEventListener("submit", e => {

        e.preventDefault();

        const nombre = $("estudiante-nombre").value.trim();
        const apellido = $("estudiante-apellido").value.trim();
        const curso = $("estudiante-curso").value.trim();
        const identificacion = $("estudiante-identificacion").value.trim();
        const contacto = $("estudiante-contacto").value.trim();
        const observaciones = $("estudiante-observaciones").value.trim();

        if (!nombre || !apellido) {
            toast("Escribe el nombre y apellido.");
            return;
        }

        estudiantes.push({
            id: Date.now().toString(),
            nombre,
            apellido,
            curso,
            identificacion,
            contacto,
            observaciones,
            creado: new Date().toISOString()
        });

        guardarDatos();

        cerrarModal("modalEstudiante");

        renderEstudiantes();
        actualizarDashboard();

        toast("Estudiante guardado correctamente.");

    });


    function renderEstudiantes(filtro = "") {

        const lista = $("lista-estudiantes");

        if (!lista) return;

        const texto = filtro.toLowerCase();

        const datos = estudiantes.filter(e => {

            const completo =
                `${e.nombre} ${e.apellido} ${e.curso}`.toLowerCase();

            return completo.includes(texto);

        });

        if (!datos.length) {

            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">
                        No hay estudiantes
                    </div>
                    <div class="empty-state-text">
                        Registra un estudiante para comenzar.
                    </div>
                </div>
            `;

            return;
        }

        lista.innerHTML = datos.map(e => `

            <div class="student-card">

                <div class="student-top">

                    <div>
                        <div class="student-name">
                            ${escapar(e.nombre)} ${escapar(e.apellido)}
                        </div>

                        <div class="student-course">
                            ${escapar(e.curso || "Curso no registrado")}
                        </div>
                    </div>

                </div>

                <div class="student-meta">

                    <div>
                        ${e.identificacion
                            ? "Identificación: " + escapar(e.identificacion)
                            : "Sin identificación"}
                    </div>

                    <div>
                        ${e.contacto
                            ? "Contacto: " + escapar(e.contacto)
                            : "Sin contacto"}
                    </div>

                </div>

                <div class="card-actions">

                    <button
                        class="btn btn-secondary btn-ver-estudiante"
                        data-id="${e.id}">
                        Ver ficha
                    </button>

                    <button
                        class="btn btn-secondary btn-eliminar-estudiante"
                        data-id="${e.id}">
                        Eliminar
                    </button>

                </div>

            </div>

        `).join("");

    }


    $("buscar-estudiante")?.addEventListener("input", e => {
        renderEstudiantes(e.target.value);
    });


    document.addEventListener("click", e => {

        const ver = e.target.closest(".btn-ver-estudiante");

        if (ver) {

            const estudiante = estudiantes.find(
                x => x.id === ver.dataset.id
            );

            if (!estudiante) return;

            alert(
                `Estudiante\n\n` +
                `${estudiante.nombre} ${estudiante.apellido}\n` +
                `Curso: ${estudiante.curso || "No registrado"}\n` +
                `Identificación: ${estudiante.identificacion || "No registrada"}\n` +
                `Contacto: ${estudiante.contacto || "No registrado"}\n\n` +
                `Observaciones:\n${estudiante.observaciones || "Sin observaciones"}`
            );

            return;
        }

        const eliminar = e.target.closest(".btn-eliminar-estudiante");

        if (eliminar) {

            const estudiante = estudiantes.find(
                x => x.id === eliminar.dataset.id
            );

            if (!estudiante) return;

            if (!confirm(
                `¿Eliminar a ${estudiante.nombre} ${estudiante.apellido}?`
            )) return;

            estudiantes = estudiantes.filter(
                x => x.id !== eliminar.dataset.id
            );

            guardarDatos();
            renderEstudiantes();
            actualizarDashboard();

            toast("Estudiante eliminado.");

        }

    });


    /* =====================================================
       ATENCIONES
    ===================================================== */

    function prepararNuevaAtencion() {

        if (!estudiantes.length) {

            toast("Primero debes registrar un estudiante.");

            document
                .querySelector('[data-section="estudiantes"]')
                ?.click();

            return;
        }

        $("formAtencion").reset();

        $("atencion-fecha").value = hoy();

        const select = $("atencion-estudiante");

        select.innerHTML =
            `<option value="">Seleccionar estudiante</option>`;

        estudiantes.forEach(e => {

            const option = document.createElement("option");

            option.value = e.id;

            option.textContent =
                `${e.nombre} ${e.apellido} — ${e.curso || ""}`;

            select.appendChild(option);

        });

        abrirModal("modalAtencion");

    }


    $("btnAgregarAtencion")?.addEventListener(
        "click",
        prepararNuevaAtencion
    );

    $("btnQuickAttention")?.addEventListener(
        "click",
        prepararNuevaAtencion
    );


    $("formAtencion")?.addEventListener("submit", e => {

        e.preventDefault();

        const estudianteId = $("atencion-estudiante").value;

        if (!estudianteId) {
            toast("Selecciona un estudiante.");
            return;
        }

        const atencion = {

            id: Date.now().toString(),

            estudianteId,

            tipo: $("atencion-tipo").value,

            fecha: $("atencion-fecha").value || hoy(),

            motivo: $("atencion-motivo").value.trim(),

            descripcion:
                $("atencion-descripcion").value.trim(),

            creado: new Date().toISOString()

        };

        atenciones.push(atencion);

        guardarDatos();

        cerrarModal("modalAtencion");

        renderAtenciones();
        renderSeguimientos();
        actualizarDashboard();

        toast("Atención guardada correctamente.");

    });


    function renderAtenciones(filtro = "") {

        const lista = $("lista-atenciones");

        if (!lista) return;

        const texto = filtro.toLowerCase();

        const datos = atenciones
            .filter(a => {

                const estudiante =
                    estudiantes.find(
                        e => e.id === a.estudianteId
                    );

                const nombre =
                    estudiante
                        ? `${estudiante.nombre} ${estudiante.apellido}`
                        : "";

                return (
                    nombre.toLowerCase().includes(texto) ||
                    a.motivo.toLowerCase().includes(texto) ||
                    a.tipo.toLowerCase().includes(texto)
                );

            })
            .reverse();

        if (!datos.length) {

            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">
                        No hay atenciones
                    </div>
                    <div class="empty-state-text">
                        Registra una nueva atención para comenzar.
                    </div>
                </div>
            `;

            return;
        }

        lista.innerHTML = datos.map(a => {

            const estudiante =
                estudiantes.find(
                    e => e.id === a.estudianteId
                );

            const nombre = estudiante
                ? `${estudiante.nombre} ${estudiante.apellido}`
                : "Estudiante eliminado";

            return `

                <div class="attention-card">

                    <div class="attention-top">

                        <div class="attention-name">
                            ${escapar(nombre)}
                        </div>

                        <div class="attention-date">
                            ${escapar(a.fecha)}
                        </div>

                    </div>

                    <div class="attention-motive">
                        ${escapar(a.tipo)} · ${escapar(a.motivo || "Sin motivo")}
                    </div>

                    <div class="attention-detail">
                        ${escapar(a.descripcion || "Sin descripción")}
                    </div>

                    <div class="card-actions">

                        <button
                            class="btn btn-secondary btn-eliminar-atencion"
                            data-id="${a.id}">
                            Eliminar
                        </button>

                    </div>

                </div>

            `;

        }).join("");

    }


    $("buscar-atencion")?.addEventListener("input", e => {
        renderAtenciones(e.target.value);
    });


    document.addEventListener("click", e => {

        const eliminar =
            e.target.closest(".btn-eliminar-atencion");

        if (!eliminar) return;

        if (!confirm("¿Eliminar esta atención?")) return;

        atenciones = atenciones.filter(
            x => x.id !== eliminar.dataset.id
        );

        guardarDatos();

        renderAtenciones();
        renderSeguimientos();
        actualizarDashboard();

        toast("Atención eliminada.");

    });


    /* =====================================================
       SEGUIMIENTOS
    ===================================================== */

    function renderSeguimientos() {

        const lista = $("lista-seguimientos");

        if (!lista) return;

        const filtro =
            $("filtro-seguimiento")?.value || "todos";

        let datos = atenciones.slice();

        if (filtro === "pendientes") {
            datos = datos.filter(a => a.tipo === "Seguimiento");
        }

        if (filtro === "realizados") {
            datos = datos.filter(a => a.tipo !== "Seguimiento");
        }

        if (filtro === "vencidos") {
            datos = [];
        }

        if (!datos.length) {

            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">
                        No hay seguimientos
                    </div>
                    <div class="empty-state-text">
                        No existen registros para este filtro.
                    </div>
                </div>
            `;

            return;
        }

        lista.innerHTML = datos.map(a => {

            const estudiante =
                estudiantes.find(
                    e => e.id === a.estudianteId
                );

            const nombre = estudiante
                ? `${estudiante.nombre} ${estudiante.apellido}`
                : "Estudiante";

            return `
                <div class="follow-card">

                    <div class="follow-main">

                        <strong>
                            ${escapar(nombre)}
                        </strong>

                        <span>
                            ${escapar(a.motivo || a.tipo)}
                        </span>

                    </div>

                    <span class="follow-status pending">
                        ${escapar(a.fecha)}
                    </span>

                </div>
            `;

        }).join("");

    }


    $("filtro-seguimiento")?.addEventListener(
        "change",
        renderSeguimientos
    );


    $("btnQuickFollow")?.addEventListener("click", () => {

        document
            .querySelector('[data-section="seguimientos"]')
            ?.click();

    });


    /* =====================================================
       NOTAS
    ===================================================== */

    function prepararNotas() {

        const select = $("nota-estudiante");

        if (!select) return;

        select.innerHTML =
            `<option value="">Seleccionar estudiante</option>`;

        estudiantes.forEach(e => {

            const option = document.createElement("option");

            option.value = e.id;

            option.textContent =
                `${e.nombre} ${e.apellido}`;

            select.appendChild(option);

        });

        renderNotas();

    }


    function limpiarEditorNota() {

        notaActual = null;

        $("nota-estudiante").value = "";
        $("nota-titulo").value = "";
        $("nota-fecha").value = hoy();
        $("nota-contenido").innerHTML = "";

        $("estado-nota").textContent = "Sin cambios";

        actualizarContador();

    }


    $("btnNuevaNota")?.addEventListener("click", () => {

        limpiarEditorNota();

    });


    $("btnGuardarNota")?.addEventListener("click", () => {

        const estudianteId = $("nota-estudiante").value;
        const titulo = $("nota-titulo").value.trim();
        const fecha = $("nota-fecha").value;
        const contenido = $("nota-contenido").innerHTML;

        if (!estudianteId) {
            toast("Selecciona un estudiante.");
            return;
        }

        if (!titulo) {
            toast("Escribe un título.");
            return;
        }

        if (!contenido.trim()) {
            toast("Escribe el contenido de la nota.");
            return;
        }

        const nota = {

            id: notaActual || Date.now().toString(),

            estudianteId,

            titulo,

            fecha: fecha || hoy(),

            contenido,

            actualizado:
                new Date().toISOString()

        };

        const indice =
            notas.findIndex(n => n.id === nota.id);

        if (indice >= 0) {
            notas[indice] = nota;
        } else {
            notas.push(nota);
        }

        guardarDatos();

        notaActual = nota.id;

        renderNotas();
        actualizarDashboard();

        $("estado-nota").textContent =
            "Guardado correctamente";

        toast("Nota guardada.");

    });


    $("btnEliminarNota")?.addEventListener("click", () => {

        if (!notaActual) {
            limpiarEditorNota();
            return;
        }

        if (!confirm("¿Eliminar esta nota?")) return;

        notas = notas.filter(n => n.id !== notaActual);

        guardarDatos();

        limpiarEditorNota();
        renderNotas();
        actualizarDashboard();

        toast("Nota eliminada.");

    });


    function renderNotas() {

        const lista = $("lista-notas");

        if (!lista) return;

        $("cantidad-notas").textContent = notas.length;

        if (!notas.length) {

            lista.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-title">
                        No hay notas
                    </div>

                    <div class="empty-state-text">
                        Crea una nueva nota para comenzar.
                    </div>

                </div>
            `;

            return;
        }

        lista.innerHTML = notas
            .slice()
            .reverse()
            .map(n => {

                const estudiante =
                    estudiantes.find(
                        e => e.id === n.estudianteId
                    );

                const nombre = estudiante
                    ? `${estudiante.nombre} ${estudiante.apellido}`
                    : "Estudiante";

                return `

                    <button
                        type="button"
                        class="note-item"
                        data-id="${n.id}">

                        <strong>
                            ${escapar(n.titulo)}
                        </strong>

                        <span>
                            ${escapar(nombre)}
                        </span>

                        <small>
                            ${escapar(n.fecha)}
                        </small>

                    </button>

                `;

            }).join("");

    }


    document.addEventListener("click", e => {

        const nota = e.target.closest(".note-item");

        if (!nota) return;

        const datos =
            notas.find(n => n.id === nota.dataset.id);

        if (!datos) return;

        notaActual = datos.id;

        $("nota-estudiante").value =
            datos.estudianteId;

        $("nota-titulo").value =
            datos.titulo;

        $("nota-fecha").value =
            datos.fecha;

        $("nota-contenido").innerHTML =
            datos.contenido;

        $("estado-nota").textContent =
            "Nota cargada";

        actualizarContador();

    });


    document.querySelectorAll(".editor-button").forEach(boton => {

        boton.addEventListener("click", () => {

            const comando = boton.dataset.command;

            document.execCommand(comando, false, null);

            $("nota-contenido").focus();

            $("estado-nota").textContent =
                "Cambios sin guardar";

        });

    });


    $("nota-contenido")?.addEventListener(
        "input",
        actualizarContador
    );


    function actualizarContador() {

        const texto =
            $("nota-contenido")?.innerText.trim() || "";

        const palabras =
            texto ? texto.split(/\s+/).length : 0;

        if ($("contador-palabras")) {
            $("contador-palabras").textContent =
                palabras;
        }

        if ($("estado-nota")) {
            $("estado-nota").textContent =
                "Cambios sin guardar";
        }

    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

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
                atenciones.filter(
                    a => a.tipo === "Seguimiento"
                ).length;
        }

        if ($("total-notas")) {
            $("total-notas").textContent =
                notas.length;
        }

    }


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    actualizarDashboard();
    renderEstudiantes();
    renderAtenciones();
    renderSeguimientos();
    prepararNotas();

});
