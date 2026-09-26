document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       DATOS
    ========================================================= */

    let estudiantes = cargar("estudiantes");
    let atenciones = cargar("atenciones");

    let filtroSeguimientos = "todos";


    /* =========================================================
       INICIO
    ========================================================= */

    iniciar();

    function iniciar() {

        configurarNavegacion();
        configurarBotones();
        configurarModales();
        configurarFormularios();
        configurarBusqueda();
        configurarSeguimientos();

        actualizarTodo();
        actualizarFecha();

    }


    /* =========================================================
       LOCAL STORAGE
    ========================================================= */

    function cargar(nombre) {

        try {

            const datos = localStorage.getItem(nombre);

            if (!datos) {
                return [];
            }

            const resultado = JSON.parse(datos);

            return Array.isArray(resultado) ? resultado : [];

        } catch (error) {

            console.error("Error cargando " + nombre, error);

            return [];

        }

    }


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


    /* =========================================================
       NAVEGACIÓN
    ========================================================= */

    function configurarNavegacion() {

        document.addEventListener("click", function (evento) {

            const boton = evento.target.closest(".nav-item");

            if (!boton) {
                return;
            }

            evento.preventDefault();
            evento.stopPropagation();

            const seccion = boton.getAttribute("data-section");

            if (seccion) {
                mostrarSeccion(seccion);
            }

        });

    }


    function mostrarSeccion(id) {

        document.querySelectorAll(".section").forEach(function (seccion) {

            seccion.classList.remove("active");

        });


        const objetivo = document.getElementById(id);

        if (objetivo) {

            objetivo.classList.add("active");

        }


        document.querySelectorAll(".nav-item").forEach(function (boton) {

            boton.classList.remove("active");

            if (boton.getAttribute("data-section") === id) {

                boton.classList.add("active");

            }

        });


        const titulos = {

            inicio: [
                "Inicio",
                "Resumen de la orientación escolar"
            ],

            estudiantes: [
                "Estudiantes",
                "Directorio y fichas de estudiantes"
            ],

            atenciones: [
                "Atenciones",
                "Historial de encuentros y situaciones atendidas"
            ],

            seguimientos: [
                "Seguimientos",
                "Control de compromisos y próximos contactos"
            ]

        };


        const info = titulos[id] || titulos.inicio;


        const titulo = document.getElementById("page-title");

        const subtitulo = document.getElementById("page-subtitle");


        if (titulo) {

            titulo.textContent = info[0];

        }


        if (subtitulo) {

            subtitulo.textContent = info[1];

        }


        if (id === "estudiantes") {

            renderEstudiantes();

        }


        if (id === "atenciones") {

            renderAtenciones();

        }


        if (id === "seguimientos") {

            renderSeguimientos();

        }

    }


    /* =========================================================
       BOTONES
    ========================================================= */

    function configurarBotones() {

        document.addEventListener("click", function (evento) {

            const boton = evento.target.closest("button");

            if (!boton) {
                return;
            }


            const id = boton.id;


            if (id === "btnNuevaAtencion") {

                evento.preventDefault();

                abrirModalAtencion();

                return;

            }


            if (id === "btnQuickAttention") {

                evento.preventDefault();

                abrirModalAtencion();

                return;

            }


            if (id === "btnAgregarEstudiante") {

                evento.preventDefault();

                abrirModalEstudiante();

                return;

            }


            if (id === "btnAgregarAtencion") {

                evento.preventDefault();

                abrirModalAtencion();

                return;

            }


            if (id === "btnQuickStudent") {

                evento.preventDefault();

                abrirModalEstudiante();

                return;

            }


            if (id === "btnQuickFollow") {

                evento.preventDefault();

                mostrarSeccion("seguimientos");

                return;

            }


            if (id === "btnVerAtenciones") {

                evento.preventDefault();

                mostrarSeccion("atenciones");

                return;

            }


            if (id === "btnVerSeguimientos") {

                evento.preventDefault();

                mostrarSeccion("seguimientos");

                return;

            }

        });

    }


    /* =========================================================
       MODALES
    ========================================================= */

    function configurarModales() {

        document.addEventListener("click", function (evento) {

            const cerrar = evento.target.closest("[data-close]");

            if (cerrar) {

                evento.preventDefault();

                cerrarModal(
                    cerrar.getAttribute("data-close")
                );

                return;

            }


            const modal = evento.target.closest(".modal");

            if (
                modal &&
                evento.target === modal
            ) {

                cerrarModal(modal.id);

            }

        });


        document.addEventListener("keydown", function (evento) {

            if (evento.key !== "Escape") {
                return;
            }

            document.querySelectorAll(".modal.active").forEach(function (modal) {

                cerrarModal(modal.id);

            });

        });

    }


    function abrirModal(id) {

        const modal = document.getElementById(id);

        if (!modal) {
            return;
        }

        modal.classList.add("active");

    }


    function cerrarModal(id) {

        const modal = document.getElementById(id);

        if (!modal) {
            return;
        }

        modal.classList.remove("active");

    }


    /* =========================================================
       ESTUDIANTES
    ========================================================= */

    function abrirModalEstudiante(estudiante = null) {

        const form = document.getElementById("form-estudiante");

        if (!form) {
            return;
        }


        form.reset();


        const id = document.getElementById("id-estudiante");

        const nombre = document.getElementById("nombre-estudiante");

        const curso = document.getElementById("curso-estudiante");

        const edad = document.getElementById("edad-estudiante");

        const observacion =
            document.getElementById("observacion-estudiante");


        const titulo =
            document.getElementById("titulo-modal-estudiante");


        if (estudiante) {

            id.value = estudiante.id;

            nombre.value = estudiante.nombre || "";

            curso.value = estudiante.curso || "";

            edad.value = estudiante.edad || "";

            observacion.value =
                estudiante.observacion || "";

            titulo.textContent = "Editar estudiante";

        } else {

            id.value = "";

            titulo.textContent = "Nuevo estudiante";

        }


        abrirModal("modal-estudiante");


        setTimeout(function () {

            nombre.focus();

        }, 100);

    }


    function guardarEstudiante(evento) {

        evento.preventDefault();


        const id =
            document.getElementById("id-estudiante").value;


        const nombre =
            document.getElementById("nombre-estudiante").value.trim();


        const curso =
            document.getElementById("curso-estudiante").value.trim();


        const edad =
            document.getElementById("edad-estudiante").value;


        const observacion =
            document.getElementById("observacion-estudiante").value.trim();


        if (!nombre || !curso) {

            mostrarToast(
                "Completa el nombre y el curso."
            );

            return;

        }


        if (id) {

            const indice =
                estudiantes.findIndex(function (e) {

                    return e.id === id;

                });


            if (indice !== -1) {

                estudiantes[indice] = {

                    id: id,

                    nombre: nombre,

                    curso: curso,

                    edad: edad,

                    observacion: observacion

                };

            }

        } else {

            estudiantes.push({

                id:
                    Date.now().toString(),

                nombre: nombre,

                curso: curso,

                edad: edad,

                observacion: observacion

            });

        }


        guardarDatos();

        cerrarModal("modal-estudiante");

        actualizarTodo();

        mostrarSeccion("estudiantes");

        mostrarToast(
            id
                ? "Estudiante actualizado."
                : "Estudiante registrado."
        );

    }


    function renderEstudiantes(filtro = "") {

        const contenedor =
            document.getElementById("lista-estudiantes");


        if (!contenedor) {
            return;
        }


        const texto =
            String(filtro).toLowerCase().trim();


        const lista =
            estudiantes.filter(function (estudiante) {

                return estudiante.nombre
                    .toLowerCase()
                    .includes(texto);

            });


        const cantidad =
            document.getElementById("cantidad-estudiantes");


        if (cantidad) {

            cantidad.textContent =
                lista.length +
                (
                    lista.length === 1
                        ? " estudiante"
                        : " estudiantes"
                );

        }


        if (!lista.length) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <strong>No hay estudiantes registrados</strong>

                    <p>
                        Agrega el primer estudiante para comenzar.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML =
            lista.map(function (estudiante) {

                return `

                    <article class="student-card">

                        <div class="student-top">

                            <div>

                                <h3 class="student-name">
                                    ${escapar(estudiante.nombre)}
                                </h3>

                                <span class="student-course">
                                    ${escapar(estudiante.curso)}
                                </span>

                            </div>

                        </div>

                        <div class="student-meta">

                            ${
                                estudiante.edad
                                    ? "Edad: " +
                                      escapar(String(estudiante.edad))
                                    : "Edad no registrada"
                            }

                        </div>

                        <div class="card-actions">

                            <button
                                class="btn btn-secondary btn-editar-estudiante"
                                data-id="${estudiante.id}"
                                type="button"
                            >
                                Editar
                            </button>

                            <button
                                class="btn btn-secondary btn-ver-estudiante"
                                data-id="${estudiante.id}"
                                type="button"
                            >
                                Ver ficha
                            </button>

                            <button
                                class="btn btn-danger btn-eliminar-estudiante"
                                data-id="${estudiante.id}"
                                type="button"
                            >
                                Eliminar
                            </button>

                        </div>

                    </article>

                `;

            }).join("");

    }


    /* =========================================================
       ACCIONES DE ESTUDIANTES
    ========================================================= */

    document.addEventListener("click", function (evento) {

        const editar =
            evento.target.closest(".btn-editar-estudiante");


        if (editar) {

            const estudiante =
                estudiantes.find(function (e) {

                    return e.id === editar.dataset.id;

                });


            if (estudiante) {

                abrirModalEstudiante(estudiante);

            }

            return;

        }


        const eliminar =
            evento.target.closest(".btn-eliminar-estudiante");


        if (eliminar) {

            eliminarEstudiante(
                eliminar.dataset.id
            );

            return;

        }


        const ver =
            evento.target.closest(".btn-ver-estudiante");


        if (ver) {

            const estudiante =
                estudiantes.find(function (e) {

                    return e.id === ver.dataset.id;

                });


            if (estudiante) {

                abrirPerfil(estudiante);

            }

        }

    });


    function eliminarEstudiante(id) {

        const estudiante =
            estudiantes.find(function (e) {

                return e.id === id;

            });


        if (!estudiante) {
            return;
        }


        const confirmar =
            confirm(
                "¿Deseas eliminar a " +
                estudiante.nombre +
                "?"
            );


        if (!confirmar) {
            return;
        }


        estudiantes =
            estudiantes.filter(function (e) {

                return e.id !== id;

            });


        atenciones =
            atenciones.filter(function (a) {

                return a.estudianteId !== id;

            });


        guardarDatos();

        actualizarTodo();

        mostrarToast(
            "Estudiante eliminado."
        );

    }


    /* =========================================================
       PERFIL
    ========================================================= */

    function abrirPerfil(estudiante) {

        const titulo =
            document.getElementById("perfil-nombre");


        const contenido =
            document.getElementById("contenido-perfil");


        if (!titulo || !contenido) {
            return;
        }


        titulo.textContent =
            estudiante.nombre;


        const susAtenciones =
            atenciones.filter(function (a) {

                return a.estudianteId === estudiante.id;

            });


        contenido.innerHTML = `

            <div style="padding:22px">

                <div class="panel" style="padding:18px;margin-bottom:16px">

                    <strong>Información del estudiante</strong>

                    <p style="margin-top:10px">
                        Curso:
                        ${escapar(estudiante.curso)}
                    </p>

                    <p style="margin-top:8px">
                        ${
                            estudiante.edad
                                ? "Edad: " +
                                  escapar(String(estudiante.edad))
                                : "Edad no registrada"
                        }
                    </p>

                    <p style="margin-top:10px">
                        ${escapar(
                            estudiante.observacion ||
                            "Sin observación general."
                        )}
                    </p>

                </div>


                <div class="panel" style="padding:18px">

                    <strong>Atenciones</strong>

                    <p style="margin-top:8px">

                        ${susAtenciones.length}
                        ${
                            susAtenciones.length === 1
                                ? " atención registrada."
                                : " atenciones registradas."
                        }

                    </p>

                </div>

            </div>

        `;


        abrirModal("modal-perfil");

    }


    /* =========================================================
       ATENCIONES
    ========================================================= */

    function abrirModalAtencion(atencion = null) {

        if (!estudiantes.length) {

            mostrarToast(
                "Primero registra un estudiante."
            );

            mostrarSeccion("estudiantes");

            return;

        }


        const form =
            document.getElementById("form-atencion");


        if (!form) {
            return;
        }


        form.reset();


        document.getElementById("id-atencion").value =
            atencion ? atencion.id : "";


        document.getElementById("titulo-modal-atencion").textContent =
            atencion
                ? "Editar atención"
                : "Nueva atención";


        const select =
            document.getElementById("atencion-estudiante");


        select.innerHTML =
            '<option value="">Selecciona un estudiante</option>';


        estudiantes.forEach(function (estudiante) {

            const option =
                document.createElement("option");


            option.value =
                estudiante.id;


            option.textContent =
                estudiante.nombre +
                " — " +
                estudiante.curso;


            select.appendChild(option);

        });


        document.getElementById("fecha-atencion").value =
            atencion
                ? atencion.fecha
                : fechaActual();


        if (atencion) {

            select.value =
                atencion.estudianteId;

            document.getElementById("motivo-atencion").value =
                atencion.motivo || "";

            document.getElementById("detalle-atencion").value =
                atencion.detalle || "";

            document.getElementById("observaciones-atencion").value =
                atencion.observaciones || "";

            document.getElementById("acuerdos-atencion").value =
                atencion.acuerdos || "";

            document.getElementById("seguimiento-atencion").value =
                atencion.seguimiento || "";

        }


        abrirModal("modal-atencion");

    }


    function guardarAtencion(evento) {

        evento.preventDefault();


        const estudianteId =
            document.getElementById("atencion-estudiante").value;


        const fecha =
            document.getElementById("fecha-atencion").value;


        const motivo =
            document.getElementById("motivo-atencion").value.trim();


        const detalle =
            document.getElementById("detalle-atencion").value.trim();


        if (!estudianteId || !fecha || !motivo || !detalle) {

            mostrarToast(
                "Completa los campos obligatorios."
            );

            return;

        }


        const id =
            document.getElementById("id-atencion").value;


        const datos = {

            id:
                id ||
                Date.now().toString(),

            estudianteId:
                estudianteId,

            fecha:
                fecha,

            motivo:
                motivo,

            detalle:
                detalle,

            observaciones:
                document.getElementById(
                    "observaciones-atencion"
                ).value.trim(),

            acuerdos:
                document.getElementById(
                    "acuerdos-atencion"
                ).value.trim(),

            seguimiento:
                document.getElementById(
                    "seguimiento-atencion"
                ).value

        };


        if (id) {

            const indice =
                atenciones.findIndex(function (a) {

                    return a.id === id;

                });


            if (indice !== -1) {

                atenciones[indice] =
                    datos;

            }

        } else {

            atenciones.push(datos);

        }


        guardarDatos();

        cerrarModal("modal-atencion");

        actualizarTodo();

        mostrarSeccion("atenciones");

        mostrarToast(
            id
                ? "Atención actualizada."
                : "Atención registrada."
        );

    }


    function renderAtenciones() {

        const contenedor =
            document.getElementById("lista-atenciones");


        if (!contenedor) {
            return;
        }


        if (!atenciones.length) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <strong>No hay atenciones registradas</strong>

                    <p>
                        Registra una atención para verla aquí.
                    </p>

                </div>

            `;

            return;

        }


        const lista =
            [...atenciones].sort(function (a, b) {

                return b.fecha.localeCompare(a.fecha);

            });


        contenedor.innerHTML =
            lista.map(function (atencion) {

                const estudiante =
                    estudiantes.find(function (e) {

                        return e.id === atencion.estudianteId;

                    });


                const nombre =
                    estudiante
                        ? estudiante.nombre
                        : "Estudiante eliminado";


                return `

                    <article class="attention-card">

                        <div>

                            <strong>
                                ${escapar(nombre)}
                            </strong>

                            <span>
                                ${formatearFecha(atencion.fecha)}
                            </span>

                        </div>

                        <h3>
                            ${escapar(atencion.motivo)}
                        </h3>

                        <p>
                            ${escapar(atencion.detalle)}
                        </p>

                        <div class="card-actions">

                            <button
                                type="button"
                                class="btn btn-secondary btn-editar-atencion"
                                data-id="${atencion.id}"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                class="btn btn-danger btn-eliminar-atencion"
                                data-id="${atencion.id}"
                            >
                                Eliminar
                            </button>

                        </div>

                    </article>

                `;

            }).join("");

    }


    /* =========================================================
       ACCIONES DE ATENCIONES
    ========================================================= */

    document.addEventListener("click", function (evento) {

        const editar =
            evento.target.closest(".btn-editar-atencion");


        if (editar) {

            const atencion =
                atenciones.find(function (a) {

                    return a.id === editar.dataset.id;

                });


            if (atencion) {

                abrirModalAtencion(atencion);

            }

            return;

        }


        const eliminar =
            evento.target.closest(".btn-eliminar-atencion");


        if (eliminar) {

            const confirmar =
                confirm(
                    "¿Deseas eliminar esta atención?"
                );


            if (!confirmar) {
                return;
            }


            atenciones =
                atenciones.filter(function (a) {

                    return a.id !== eliminar.dataset.id;

                });


            guardarDatos();

            actualizarTodo();

            mostrarToast(
                "Atención eliminada."
            );

        }

    });


    /* =========================================================
       SEGUIMIENTOS
    ========================================================= */

    function configurarSeguimientos() {

        document.addEventListener("click", function (evento) {

            const boton =
                evento.target.closest(".follow-tab");


            if (!boton) {
                return;
            }


            filtroSeguimientos =
                boton.getAttribute("data-filter") ||
                "todos";


            document.querySelectorAll(".follow-tab")
                .forEach(function (tab) {

                    tab.classList.remove("active");

                });


            boton.classList.add("active");

            renderSeguimientos();

        });

    }


    function renderSeguimientos() {

        const contenedor =
            document.getElementById("lista-seguimientos");


        if (!contenedor) {
            return;
        }


        const hoy =
            fechaActual();


        let lista =
            atenciones.filter(function (atencion) {

                return atencion.seguimiento;

            });


        if (filtroSeguimientos === "pendientes") {

            lista =
                lista.filter(function (a) {

                    return a.seguimiento >= hoy;

                });

        }


        if (filtroSeguimientos === "vencidos") {

            lista =
                lista.filter(function (a) {

                    return a.seguimiento < hoy;

                });

        }


        if (filtroSeguimientos === "realizados") {

            lista = [];

        }


        if (!lista.length) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <strong>No hay seguimientos</strong>

                    <p>
                        No existen registros para este filtro.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML =
            lista.map(function (atencion) {

                const estudiante =
                    estudiantes.find(function (e) {

                        return e.id === atencion.estudianteId;

                    });


                return `

                    <article class="follow-card">

                        <div>

                            <strong>
                                ${escapar(
                                    estudiante
                                        ? estudiante.nombre
                                        : "Estudiante"
                                )}
                            </strong>

                            <span>
                                ${formatearFecha(
                                    atencion.seguimiento
                                )}
                            </span>

                        </div>

                        <p>
                            ${escapar(atencion.motivo)}
                        </p>

                    </article>

                `;

            }).join("");

    }


    /* =========================================================
       FORMULARIOS
    ========================================================= */

    function configurarFormularios() {

        const formEstudiante =
            document.getElementById(
                "form-estudiante"
            );


        if (formEstudiante) {

            formEstudiante.addEventListener(
                "submit",
                guardarEstudiante
            );

        }


        const formAtencion =
            document.getElementById(
                "form-atencion"
            );


        if (formAtencion) {

            formAtencion.addEventListener(
                "submit",
                guardarAtencion
            );

        }

    }


    /* =========================================================
       BUSCADOR
    ========================================================= */

    function configurarBusqueda() {

        const buscador =
            document.getElementById(
                "buscar-estudiante"
            );


        if (!buscador) {
            return;
        }


        buscador.addEventListener(
            "input",
            function () {

                renderEstudiantes(
                    buscador.value
                );

            }
        );

    }


    /* =========================================================
       ACTUALIZAR TODO
    ========================================================= */

    function actualizarTodo() {

        const totalEstudiantes =
            document.getElementById(
                "total-estudiantes"
            );


        const totalAtenciones =
            document.getElementById(
                "total-atenciones"
            );


        const totalSeguimientos =
            document.getElementById(
                "total-seguimientos"
            );


        const totalHoy =
            document.getElementById(
                "total-hoy"
            );


        if (totalEstudiantes) {

            totalEstudiantes.textContent =
                estudiantes.length;

        }


        if (totalAtenciones) {

            totalAtenciones.textContent =
                atenciones.length;

        }


        const seguimientos =
            atenciones.filter(function (a) {

                return a.seguimiento;

            });


        if (totalSeguimientos) {

            totalSeguimientos.textContent =
                seguimientos.length;

        }


        const hoy =
            fechaActual();


        const hoyCantidad =
            atenciones.filter(function (a) {

                return a.fecha === hoy;

            }).length;


        if (totalHoy) {

            totalHoy.textContent =
                hoyCantidad;

        }


        renderEstudiantes();

        renderAtenciones();

        renderSeguimientos();

        renderUltimasAtenciones();

        renderProximosSeguimientos();

    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    function renderUltimasAtenciones() {

        const contenedor =
            document.getElementById(
                "ultimas-atenciones"
            );


        if (!contenedor) {
            return;
        }


        const lista =
            [...atenciones]
                .sort(function (a, b) {

                    return b.fecha.localeCompare(a.fecha);

                })
                .slice(0, 5);


        if (!lista.length) {

            contenedor.innerHTML =
                '<div class="empty-state">No hay atenciones todavía.</div>';

            return;

        }


        contenedor.innerHTML =
            lista.map(function (a) {

                const estudiante =
                    estudiantes.find(function (e) {

                        return e.id === a.estudianteId;

                    });


                return `

                    <div class="list-item">

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

                `;

            }).join("");

    }


    function renderProximosSeguimientos() {

        const contenedor =
            document.getElementById(
                "proximos-seguimientos"
            );


        if (!contenedor) {
            return;
        }


        const hoy =
            fechaActual();


        const lista =
            atenciones
                .filter(function (a) {

                    return (
                        a.seguimiento &&
                        a.seguimiento >= hoy
                    );

                })
                .sort(function (a, b) {

                    return a.seguimiento.localeCompare(
                        b.seguimiento
                    );

                })
                .slice(0, 5);


        if (!lista.length) {

            contenedor.innerHTML =
                '<div class="empty-state">No hay seguimientos próximos.</div>';

            return;

        }


        contenedor.innerHTML =
            lista.map(function (a) {

                const estudiante =
                    estudiantes.find(function (e) {

                        return e.id === a.estudianteId;

                    });


                return `

                    <div class="list-item">

                        <strong>
                            ${escapar(
                                estudiante
                                    ? estudiante.nombre
                                    : "Estudiante"
                            )}
                        </strong>

                        <span>
                            ${formatearFecha(a.seguimiento)}
                        </span>

                    </div>

                `;

            }).join("");

    }


    /* =========================================================
       FECHA
    ========================================================= */

    function fechaActual() {

        const fecha =
            new Date();


        const año =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0");


        const dia =
            String(
                fecha.getDate()
            ).padStart(2, "0");


        return (
            año +
            "-" +
            mes +
            "-" +
            dia
        );

    }


    function actualizarFecha() {

        const elemento =
            document.getElementById("date");


        if (!elemento) {
            return;
        }


        const fecha =
            new Date();


        elemento.textContent =
            fecha.toLocaleDateString(
                "es-CO",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    function formatearFecha(fecha) {

        if (!fecha) {
            return "";
        }


        const partes =
            fecha.split("-");


        if (partes.length !== 3) {
            return fecha;
        }


        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }


    /* =========================================================
       UTILIDADES
    ========================================================= */

    function escapar(texto) {

        return String(texto || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function mostrarToast(mensaje) {

        const toast =
            document.getElementById("toast");


        if (!toast) {
            return;
        }


        toast.textContent =
            mensaje;


        toast.classList.add("show");


        setTimeout(function () {

            toast.classList.remove("show");

        }, 2500);

    }

});
