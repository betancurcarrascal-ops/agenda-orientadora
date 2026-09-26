alert("SCRIPT NUEVO CARGADO");
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       DATOS
    ========================================================= */

    var estudiantes = cargarJSON("estudiantes");
    var atenciones = cargarJSON("atenciones");
    var notas = cargarJSON("notasConversacion");

    var filtroSeguimientos = "todos";

    window.estudiantes = estudiantes;
    window.atenciones = atenciones;

    /* =========================================================
       INICIO
    ========================================================= */

    iniciarNavegacion();
    iniciarBotones();
    iniciarModales();
    iniciarFormularios();
    iniciarBusqueda();

    actualizarTodo();
    actualizarFecha();


    /* =========================================================
       NAVEGACIÓN
    ========================================================= */

    function iniciarNavegacion() {

        document.querySelectorAll(".nav-item").forEach(function (boton) {

            boton.addEventListener("click", function () {

                var seccion = boton.getAttribute("data-section");

                if (seccion) {
                    mostrarSeccion(seccion);
                }

            });

        });

    }


    window.mostrarSeccion = function (id) {

        document.querySelectorAll(".section").forEach(function (seccion) {
            seccion.classList.remove("active");
        });

        var objetivo = document.getElementById(id);

        if (objetivo) {
            objetivo.classList.add("active");
        }

        document.querySelectorAll(".nav-item").forEach(function (boton) {

            boton.classList.toggle(
                "active",
                boton.getAttribute("data-section") === id
            );

        });

        var titulos = {

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

        var info = titulos[id] || titulos.inicio;

        var titulo = document.getElementById("page-title");
        var subtitulo = document.getElementById("page-subtitle");

        if (titulo) {
            titulo.textContent = info[0];
        }

        if (subtitulo) {
            subtitulo.textContent = info[1];
        }


        /* Actualizar contenido de la sección */

        if (id === "inicio") {
            actualizarTodo();
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

    };


    /* =========================================================
       BOTONES
    ========================================================= */

    function iniciarBotones() {

        enlazar("btnNuevaAtencion", function () {
            abrirModalAtencion();
        });

        enlazar("btnQuickAttention", function () {
            abrirModalAtencion();
        });

        enlazar("btnAgregarEstudiante", function () {
            abrirModalEstudiante();
        });

        enlazar("btnAgregarAtencion", function () {
            abrirModalAtencion();
        });

        enlazar("btnQuickStudent", function () {
            abrirModalEstudiante();
        });

        enlazar("btnQuickFollow", function () {
            mostrarSeccion("seguimientos");
        });

        enlazar("btnVerAtenciones", function () {
            mostrarSeccion("atenciones");
        });

        enlazar("btnVerSeguimientos", function () {
            mostrarSeccion("seguimientos");
        });


        /* Filtros de seguimientos */

        document.querySelectorAll(".follow-tab").forEach(function (tab) {

            tab.addEventListener("click", function () {

                filtroSeguimientos =
                    tab.getAttribute("data-filter") || "todos";

                document.querySelectorAll(".follow-tab").forEach(function (x) {
                    x.classList.remove("active");
                });

                tab.classList.add("active");

                renderSeguimientos();

            });

        });


        /* Menú móvil */

        enlazar("btnMobileMenu", function () {

            var sidebar = document.getElementById("sidebar");

            if (sidebar) {
                sidebar.classList.toggle("open");
            }

        });

    }


    /* =========================================================
       MODALES
    ========================================================= */

    function iniciarModales() {

        document.querySelectorAll("[data-close]").forEach(function (boton) {

            boton.addEventListener("click", function () {

                var modal = boton.getAttribute("data-close");

                cerrarModal(modal);

            });

        });


        document.querySelectorAll(".modal").forEach(function (modal) {

            modal.addEventListener("click", function (evento) {

                if (evento.target === modal) {
                    cerrarModal(modal.id);
                }

            });

        });


        document.addEventListener("keydown", function (evento) {

            if (evento.key === "Escape") {

                document.querySelectorAll(".modal.active").forEach(function (modal) {

                    cerrarModal(modal.id);

                });

            }

        });

    }


    function abrirModal(id) {

        var modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.add("active");

    }


    function cerrarModal(id) {

        var modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.remove("active");

    }


    /* =========================================================
       FORMULARIOS
    ========================================================= */

    function iniciarFormularios() {

        var formEstudiante =
            document.getElementById("form-estudiante");

        if (formEstudiante) {

            formEstudiante.addEventListener(
                "submit",
                guardarEstudiante
            );

        }


        var formAtencion =
            document.getElementById("form-atencion");

        if (formAtencion) {

            formAtencion.addEventListener(
                "submit",
                guardarAtencion
            );

        }

    }


    /* =========================================================
       ESTUDIANTES
    ========================================================= */

    function abrirModalEstudiante(estudiante) {

        limpiarFormularioEstudiante();

        var titulo =
            document.getElementById("titulo-modal-estudiante");

        if (estudiante) {

            ponerValor("id-estudiante", estudiante.id);
            ponerValor("nombre-estudiante", estudiante.nombre);
            ponerValor("curso-estudiante", estudiante.curso);
            ponerValor("edad-estudiante", estudiante.edad);
            ponerValor(
                "observacion-estudiante",
                estudiante.observacion
            );

            if (titulo) {
                titulo.textContent = "Editar estudiante";
            }

        } else {

            if (titulo) {
                titulo.textContent = "Nuevo estudiante";
            }

        }

        abrirModal("modal-estudiante");

        setTimeout(function () {

            var campo =
                document.getElementById("nombre-estudiante");

            if (campo) {
                campo.focus();
            }

        }, 100);

    }


    function limpiarFormularioEstudiante() {

        var formulario =
            document.getElementById("form-estudiante");

        if (formulario) {
            formulario.reset();
        }

        ponerValor("id-estudiante", "");

    }


    function guardarEstudiante(evento) {

        evento.preventDefault();

        var id =
            obtenerValor("id-estudiante");

        var nombre =
            obtenerValor("nombre-estudiante").trim();

        var curso =
            obtenerValor("curso-estudiante").trim();

        var edad =
            obtenerValor("edad-estudiante");

        var observacion =
            obtenerValor("observacion-estudiante").trim();


        if (!nombre || !curso) {

            mostrarToast(
                "Completa el nombre y el curso."
            );

            return;
        }


        var estudiante = {

            id: id || generarId(),

            nombre: nombre,

            curso: curso,

            edad: edad,

            observacion: observacion,

            creado: new Date().toISOString()

        };


        if (id) {

            estudiantes = estudiantes.map(function (item) {

                return item.id === id
                    ? estudiante
                    : item;

            });

        } else {

            estudiantes.push(estudiante);

        }


        guardarDatos();

        cerrarModal("modal-estudiante");

        actualizarTodo();

        mostrarToast(
            id
                ? "Estudiante actualizado."
                : "Estudiante guardado correctamente."
        );

    }


    function renderEstudiantes(busqueda) {

        var lista =
            document.getElementById("lista-estudiantes");

        if (!lista) return;


        var texto =
            (busqueda || "").toLowerCase().trim();


        var filtrados =
            estudiantes.filter(function (e) {

                var nombre =
                    (e.nombre || "").toLowerCase();

                var curso =
                    (e.curso || "").toLowerCase();

                return (
                    !texto ||
                    nombre.indexOf(texto) !== -1 ||
                    curso.indexOf(texto) !== -1
                );

            });


        var cantidad =
            document.getElementById(
                "cantidad-estudiantes"
            );

        if (cantidad) {

            cantidad.textContent =
                filtrados.length +
                (
                    filtrados.length === 1
                        ? " estudiante"
                        : " estudiantes"
                );

        }


        if (!filtrados.length) {

            lista.innerHTML =
                '<div class="empty-state">' +
                    '<strong>No hay estudiantes</strong>' +
                    '<p>Registra un estudiante para comenzar.</p>' +
                '</div>';

            return;
        }


        lista.innerHTML =
            filtrados.map(function (e) {

                return (

                    '<article class="student-card">' +

                        '<div class="student-top">' +

                            '<div class="student-avatar">' +
                                escaparHTML(
                                    iniciales(e.nombre)
                                ) +
                            '</div>' +

                            '<div class="card-actions">' +

                                '<button ' +
                                    'class="icon-button" ' +
                                    'data-action="perfil" ' +
                                    'data-id="' +
                                        escaparHTML(e.id) +
                                    '">' +
                                    'Ver' +
                                '</button>' +

                                '<button ' +
                                    'class="icon-button danger" ' +
                                    'data-action="eliminar-estudiante" ' +
                                    'data-id="' +
                                        escaparHTML(e.id) +
                                    '">' +
                                    '×' +
                                '</button>' +

                            '</div>' +

                        '</div>' +

                        '<div class="student-name">' +
                            escaparHTML(e.nombre) +
                        '</div>' +

                        '<div class="student-course">' +
                            escaparHTML(e.curso) +
                        '</div>' +

                        '<div class="student-meta">' +

                            '<span>' +
                                (
                                    e.edad
                                        ? "Edad: " +
                                          escaparHTML(String(e.edad))
                                        : "Edad no registrada"
                                ) +
                            '</span>' +

                            '<span>' +
                                contarNotas(e.id) +
                                ' notas' +
                            '</span>' +

                        '</div>' +

                    '</article>'

                );

            }).join("");


        lista.querySelectorAll("[data-action]").forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        var id =
                            boton.getAttribute("data-id");

                        var estudiante =
                            estudiantes.find(function (x) {
                                return x.id === id;
                            });

                        if (!estudiante) return;


                        var accion =
                            boton.getAttribute("data-action");


                        if (accion === "perfil") {

                            abrirPerfil(estudiante);

                        }


                        if (
                            accion ===
                            "eliminar-estudiante"
                        ) {

                            eliminarEstudiante(
                                estudiante.id
                            );

                        }

                    }
                );

            }
        );

    }


    function eliminarEstudiante(id) {

        var confirmar =
            confirm(
                "¿Deseas eliminar este estudiante? " +
                "También se eliminarán sus registros asociados."
            );

        if (!confirmar) return;


        estudiantes =
            estudiantes.filter(function (e) {
                return e.id !== id;
            });


        atenciones =
            atenciones.filter(function (a) {
                return a.estudianteId !== id;
            });


        notas =
            notas.filter(function (n) {
                return n.estudianteId !== id;
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

        var nombre =
            document.getElementById("perfil-nombre");

        var contenido =
            document.getElementById(
                "contenido-perfil"
            );


        if (nombre) {
            nombre.textContent =
                estudiante.nombre;
        }


        if (!contenido) return;


        var susAtenciones =
            atenciones.filter(function (a) {
                return a.estudianteId === estudiante.id;
            });


        var susNotas =
            notas.filter(function (n) {
                return n.estudianteId === estudiante.id;
            });


        contenido.innerHTML =

            '<div style="padding:22px">' +

                '<div class="panel" style="padding:18px;margin-bottom:16px">' +

                    '<strong>Información</strong>' +

                    '<p style="margin-top:8px;color:#6b7280;font-size:12px">' +
                        'Curso: ' +
                        escaparHTML(estudiante.curso) +

                        (
                            estudiante.edad
                                ? " · Edad: " +
                                  escaparHTML(
                                      String(estudiante.edad)
                                  )
                                : ""
                        ) +

                    '</p>' +

                    '<p style="margin-top:8px;color:#4b5563;font-size:12px;line-height:1.5">' +
                        escaparHTML(
                            estudiante.observacion ||
                            "Sin observación general."
                        ) +
                    '</p>' +

                '</div>' +


                '<div class="panel" style="padding:18px;margin-bottom:16px">' +

                    '<strong>Atenciones</strong>' +

                    '<p style="margin-top:7px;color:#6b7280;font-size:12px">' +
                        susAtenciones.length +
                        (
                            susAtenciones.length === 1
                                ? " atención registrada."
                                : " atenciones registradas."
                        ) +
                    '</p>' +

                '</div>' +


                '<div class="panel" style="padding:18px">' +

                    '<strong>Notas de conversación</strong>' +

                    '<p style="margin-top:7px;color:#6b7280;font-size:12px">' +
                        susNotas.length +
                        (
                            susNotas.length === 1
                                ? " nota registrada."
                                : " notas registradas."
                        ) +
                    '</p>' +

                '</div>' +

            '</div>';


        abrirModal("modal-perfil");

    }


    /* =========================================================
       ATENCIONES
    ========================================================= */

    function abrirModalAtencion(atencion) {

        if (!estudiantes.length) {

            mostrarToast(
                "Primero debes registrar un estudiante."
            );

            mostrarSeccion("estudiantes");

            return;
        }


        var formulario =
            document.getElementById("form-atencion");

        if (formulario) {
            formulario.reset();
        }


        ponerValor("id-atencion", "");


        var titulo =
            document.getElementById(
                "titulo-modal-atencion"
            );


        if (titulo) {

            titulo.textContent =
                atencion
                    ? "Editar atención"
                    : "Nueva atención";

        }


        ponerValor(
            "fecha-atencion",
            atencion
                ? atencion.fecha
                : fechaActual()
        );


        var select =
            document.getElementById(
                "atencion-estudiante"
            );


        if (select) {

            select.innerHTML =
                '<option value="">Selecciona un estudiante</option>';


            estudiantes.forEach(function (e) {

                select.innerHTML +=
                    '<option value="' +
                        escaparHTML(e.id) +
                    '">' +

                        escaparHTML(e.nombre) +
                        " — " +
                        escaparHTML(e.curso) +

                    '</option>';

            });

        }


        if (atencion) {

            ponerValor(
                "id-atencion",
                atencion.id
            );

            ponerValor(
                "atencion-estudiante",
                atencion.estudianteId
            );

            ponerValor(
                "motivo-atencion",
                atencion.motivo
            );

            ponerValor(
                "detalle-atencion",
                atencion.detalle
            );

            ponerValor(
                "observaciones-atencion",
                atencion.observaciones
            );

            ponerValor(
                "acuerdos-atencion",
                atencion.acuerdos
            );

            ponerValor(
                "seguimiento-atencion",
                atencion.seguimiento
            );

        }


        abrirModal("modal-atencion");

    }


    function guardarAtencion(evento) {

        evento.preventDefault();


        var id =
            obtenerValor("id-atencion");


        var datos = {

            id: id || generarId(),

            estudianteId:
                obtenerValor(
                    "atencion-estudiante"
                ),

            fecha:
                obtenerValor(
                    "fecha-atencion"
                ),

            motivo:
                obtenerValor(
                    "motivo-atencion"
                ).trim(),

            detalle:
                obtenerValor(
                    "detalle-atencion"
                ).trim(),

            observaciones:
                obtenerValor(
                    "observaciones-atencion"
                ).trim(),

            acuerdos:
                obtenerValor(
                    "acuerdos-atencion"
                ).trim(),

            seguimiento:
                obtenerValor(
                    "seguimiento-atencion"
                )

        };


        if (
            !datos.estudianteId ||
            !datos.fecha ||
            !datos.motivo ||
            !datos.detalle
        ) {

            mostrarToast(
                "Completa los campos obligatorios."
            );

            return;
        }


        if (id) {

            atenciones =
                atenciones.map(function (a) {

                    return a.id === id
                        ? datos
                        : a;

                });

        } else {

            atenciones.push(datos);

        }


        guardarDatos();

        cerrarModal("modal-atencion");

        actualizarTodo();

        mostrarToast(
            id
                ? "Atención actualizada."
                : "Atención guardada correctamente."
        );

    }


    function renderAtenciones() {

        var lista =
            document.getElementById(
                "lista-atenciones"
            );

        if (!lista) return;


        var ordenadas =
            atenciones.slice().sort(
                function (a, b) {

                    return (
                        b.fecha || ""
                    ).localeCompare(
                        a.fecha || ""
                    );

                }
            );


        if (!ordenadas.length) {

            lista.innerHTML =
                '<div class="empty-state">' +
                    '<strong>No hay atenciones registradas</strong>' +
                    '<p>Registra la primera atención.</p>' +
                '</div>';

            return;
        }


        lista.innerHTML =
            ordenadas.map(function (a) {

                var estudiante =
                    estudiantes.find(
                        function (e) {
                            return e.id === a.estudianteId;
                        }
                    );


                return (

                    '<article class="attention-card">' +

                        '<div class="attention-top">' +

                            '<div>' +

                                '<div class="attention-name">' +
                                    escaparHTML(
                                        estudiante
                                            ? estudiante.nombre
                                            : "Estudiante eliminado"
                                    ) +
                                '</div>' +

                                '<div class="attention-motive">' +
                                    escaparHTML(
                                        a.motivo
                                    ) +
                                '</div>' +

                            '</div>' +

                            '<div class="attention-date">' +
                                escaparHTML(
                                    a.fecha
                                ) +
                            '</div>' +

                        '</div>' +


                        '<div class="attention-detail">' +
                            escaparHTML(
                                a.detalle
                            ) +
                        '</div>' +


                        '<div class="attention-footer">' +

                            '<span class="follow-date">' +
                                (
                                    a.seguimiento
                                        ? "Seguimiento: " +
                                          escaparHTML(
                                              a.seguimiento
                                          )
                                        : "Sin seguimiento"
                                ) +
                            '</span>' +

                            '<button ' +
                                'class="text-button" ' +
                                'data-edit-attention="' +
                                    escaparHTML(a.id) +
                                '">' +
                                'Editar' +
                            '</button>' +

                        '</div>' +

                    '</article>'

                );

            }).join("");


        lista.querySelectorAll(
            "[data-edit-attention]"
        ).forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    var id =
                        boton.getAttribute(
                            "data-edit-attention"
                        );

                    var atencion =
                        atenciones.find(
                            function (a) {
                                return a.id === id;
                            }
                        );

                    if (atencion) {
                        abrirModalAtencion(
                            atencion
                        );
                    }

                }
            );

        });

    }


    /* =========================================================
       SEGUIMIENTOS
    ========================================================= */

    function renderSeguimientos() {

        var lista =
            document.getElementById(
                "lista-seguimientos"
            );

        if (!lista) return;


        var hoy =
            fechaActual();


        var datos =
            atenciones
                .filter(function (a) {
                    return a.seguimiento;
                })
                .map(function (a) {

                    var estado;

                    if (a.seguimiento < hoy) {
                        estado = "vencidos";
                    } else {
                        estado = "pendientes";
                    }

                    return {
                        atencion: a,
                        estado: estado
                    };

                });


        if (filtroSeguimientos !== "todos") {

            datos =
                datos.filter(function (item) {

                    return (
                        item.estado ===
                        filtroSeguimientos
                    );

                });

        }


        if (!datos.length) {

            lista.innerHTML =
                '<div class="empty-state">' +
                    '<strong>No hay seguimientos</strong>' +
                    '<p>No se encontraron registros para este filtro.</p>' +
                '</div>';

            return;
        }


        lista.innerHTML =
            datos.map(function (item) {

                var a =
                    item.atencion;


                var estudiante =
                    estudiantes.find(
                        function (e) {
                            return e.id === a.estudianteId;
                        }
                    );


                var clase =
                    item.estado === "vencidos"
                        ? "overdue"
                        : "pending";


                var textoEstado =
                    item.estado === "vencidos"
                        ? "Vencido"
                        : "Pendiente";


                return (

                    '<div class="follow-card ' +
                        clase +
                    '">' +

                        '<div class="follow-main">' +

                            '<strong>' +
                                escaparHTML(
                                    estudiante
                                        ? estudiante.nombre
                                        : "Estudiante eliminado"
                                ) +
                            '</strong>' +

                            '<span>' +
                                escaparHTML(
                                    a.motivo
                                ) +
                                " · " +
                                escaparHTML(
                                    a.seguimiento
                                ) +
                            '</span>' +

                        '</div>' +

                        '<span class="follow-status ' +
                            clase +
                        '">' +
                            textoEstado +
                        '</span>' +

                    '</div>'

                );

            }).join("");

    }


    /* =========================================================
       BÚSQUEDA
    ========================================================= */

    function iniciarBusqueda() {

        var buscador =
            document.getElementById(
                "buscar-estudiante"
            );

        if (!buscador) return;


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

        renderEstudiantes();

        renderAtenciones();

        renderSeguimientos();


        var totalEstudiantes =
            document.getElementById(
                "total-estudiantes"
            );

        var totalAtenciones =
            document.getElementById(
                "total-atenciones"
            );

        var totalSeguimientos =
            document.getElementById(
                "total-seguimientos"
            );

        var totalHoy =
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


        if (totalSeguimientos) {

            totalSeguimientos.textContent =
                atenciones.filter(function (a) {

                    return !!a.seguimiento;

                }).length;

        }


        if (totalHoy) {

            totalHoy.textContent =
                atenciones.filter(function (a) {

                    return (
                        a.fecha ===
                        fechaActual()
                    );

                }).length;

        }


        /* Últimas atenciones */

        var recientes =
            document.getElementById(
                "ultimas-atenciones"
            );


        if (recientes) {

            var listaReciente =
                atenciones
                    .slice()
                    .sort(function (a, b) {

                        return (
                            b.fecha || ""
                        ).localeCompare(
                            a.fecha || ""
                        );

                    })
                    .slice(0, 5);


            if (!listaReciente.length) {

                recientes.innerHTML =
                    '<div class="empty-state">' +
                        '<strong>Sin atenciones</strong>' +
                        '<p>Aún no hay registros.</p>' +
                    '</div>';

            } else {

                recientes.innerHTML =
                    listaReciente.map(function (a) {

                        var estudiante =
                            estudiantes.find(
                                function (e) {
                                    return e.id === a.estudianteId;
                                }
                            );


                        return (

                            '<div style="padding:15px 20px;border-bottom:1px solid var(--border)">' +

                                '<strong style="font-size:12px">' +
                                    escaparHTML(
                                        estudiante
                                            ? estudiante.nombre
                                            : "Estudiante eliminado"
                                    ) +
                                '</strong>' +

                                '<div style="margin-top:4px;color:#6b7280;font-size:11px">' +
                                    escaparHTML(
                                        a.motivo
                                    ) +
                                    " · " +
                                    escaparHTML(
                                        a.fecha
                                    ) +
                                '</div>' +

                            '</div>'

                        );

                    }).join("");

            }

        }


        /* Próximos seguimientos */

        var proximos =
            document.getElementById(
                "proximos-seguimientos"
            );


        if (proximos) {

            var proximosLista =
                atenciones
                    .filter(function (a) {

                        return (
                            a.seguimiento &&
                            a.seguimiento >= fechaActual()
                        );

                    })
                    .sort(function (a, b) {

                        return (
                            a.seguimiento || ""
                        ).localeCompare(
                            b.seguimiento || ""
                        );

                    })
                    .slice(0, 5);


            if (!proximosLista.length) {

                proximos.innerHTML =
                    '<div class="empty-state">' +
                        '<strong>Sin próximos seguimientos</strong>' +
                        '<p>No hay seguimientos pendientes.</p>' +
                    '</div>';

            } else {

                proximos.innerHTML =
                    proximosLista.map(function (a) {

                        var estudiante =
                            estudiantes.find(
                                function (e) {
                                    return e.id === a.estudianteId;
                                }
                            );


                        return (

                            '<div style="padding:15px 20px;border-bottom:1px solid var(--border)">' +

                                '<strong style="font-size:12px">' +
                                    escaparHTML(
                                        estudiante
                                            ? estudiante.nombre
                                            : "Estudiante eliminado"
                                    ) +
                                '</strong>' +

                                '<div style="margin-top:4px;color:#6b7280;font-size:11px">' +
                                    escaparHTML(
                                        a.seguimiento
                                    ) +
                                    " · " +
                                    escaparHTML(
                                        a.motivo
                                    ) +
                                '</div>' +

                            '</div>'

                        );

                    }).join("");

            }

        }

    }


    /* =========================================================
       FECHA
    ========================================================= */

    function actualizarFecha() {

        var elemento =
            document.getElementById("date");

        if (!elemento) return;


        var fecha =
            new Date();


        elemento.textContent =
            fecha.toLocaleDateString(
                "es-CO",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    /* =========================================================
       DATOS / LOCALSTORAGE
    ========================================================= */

    function cargarJSON(clave) {

        try {

            var datos =
                localStorage.getItem(clave);

            if (!datos) {
                return [];
            }

            var resultado =
                JSON.parse(datos);

            return Array.isArray(resultado)
                ? resultado
                : [];

        } catch (error) {

            console.error(
                "Error leyendo " + clave,
                error
            );

            return [];

        }

    }


    function guardarDatos() {

        try {

            localStorage.setItem(
                "estudiantes",
                JSON.stringify(estudiantes)
            );


            localStorage.setItem(
                "atenciones",
                JSON.stringify(atenciones)
            );


            localStorage.setItem(
                "notasConversacion",
                JSON.stringify(notas)
            );


            window.estudiantes =
                estudiantes;

            window.atenciones =
                atenciones;

        } catch (error) {

            console.error(
                "No se pudieron guardar los datos.",
                error
            );

            mostrarToast(
                "No se pudieron guardar los datos."
            );

        }

    }


    /* =========================================================
       UTILIDADES
    ========================================================= */

    function enlazar(id, funcion) {

        var elemento =
            document.getElementById(id);

        if (!elemento) return;

        elemento.addEventListener(
            "click",
            funcion
        );

    }


    function obtenerValor(id) {

        var elemento =
            document.getElementById(id);

        if (!elemento) {
            return "";
        }

        return elemento.value || "";

    }


    function ponerValor(id, valor) {

        var elemento =
            document.getElementById(id);

        if (!elemento) return;

        elemento.value =
            valor == null
                ? ""
                : valor;

    }


    function generarId() {

        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );

    }


    function fechaActual() {

        var fecha =
            new Date();


        var año =
            fecha.getFullYear();


        var mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0");


        var dia =
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


    function iniciales(nombre) {

        return (
            nombre || "?"
        )
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(function (palabra) {

                return palabra
                    .charAt(0);

            })
            .join("")
            .toUpperCase();

    }


    function escaparHTML(texto) {

        return String(
            texto == null
                ? ""
                : texto
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function contarNotas(id) {

        return notas.filter(
            function (nota) {

                return (
                    nota.estudianteId === id
                );

            }
        ).length;

    }


    function mostrarToast(texto) {

        var toast =
            document.getElementById(
                "toast"
            );

        if (!toast) return;


        toast.textContent =
            texto;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            window.__toastTimer
        );


        window.__toastTimer =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 2500);

    }

});
