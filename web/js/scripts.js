const messagesPage = {
    error_application: "Houve um erro na aplicação. Tente reiniciar ou atualizar com 'F5', caso não resolva, consulte os logs da aplicação!",
    error_search_dns: "Não foi possível localizar o DNS informado, verifique a sintax e tente novamente.",
    search_error_empty: "O campo está vazio, por favor, insira o um valor para pesquisa."
}

// Carrega os logs da aplicação.
$("#loag_logs").click(() => {
    let type_log = document.getElementById("type_log")
    let limit_log = document.getElementById("limit-log")
    console.log(limit_log.options[limit_log.options.selectedIndex].value)

    // Recuperando os logs...
    try {
        eel.get_logs(type_log.options[type_log.options.selectedIndex].value)(d => {
            const data = JSON.parse(d)
            if (data.logs) {
                let content_logs = document.getElementById("content-logs")
                content_logs.innerHTML = ""
                let count_log = 0

                for (let log of data.logs.reverse()) {
                    let div = document.createElement("div")
                    div.innerText = log
                    content_logs.appendChild(div)
                    count_log += 1

                    if (parseInt(limit_log.options[limit_log.options.selectedIndex].value) === count_log) {
                        break
                    }
                }

            } else if (data.error) {
                $.notify(data.error, "error");
            }
        });
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception get_logs Client")() // Salvando o log de erro...
    }
})

// Update profile

document.getElementById("save-settings").addEventListener("click", (event) => {
    event.preventDefault();

    // Get form settings
    let form_settings = document.getElementById("form-settings").children
    const data_form = {}

    // Config values form settings
    data_form["NAME_PROJECT"] = form_settings[0].children[1].value;
    data_form["NAME"] = form_settings[1].children[1].value;
    data_form["EMAIL"] = form_settings[2].children[1].children[1].value;
    data_form["USERNAME"] = form_settings[3].children[1].value;
    data_form["SHODAN"] = form_settings[4].children[1].value;
    data_form["SHODAN_API_LINK"] = form_settings[5].children[1].value;
    data_form["LINK_PROFILE"] = form_settings[6].children[1].value;
    data_form["API_KEY"] = form_settings[7].children[1].value;

    // Salva as configurações novas
    try {
        eel.update_settings_user(data_form)((response) => {
            let resp = JSON.parse(response) // ..

            if (resp.success) {
                $.notify(resp.success, "success");

            } else if (resp.error) {
                $.notify(resp.error, "error");
            }
        });
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception update_settings_user Client")() // Salvando o log de erro...
    }

})


// Rotas
$(window).ready(function () {

    // Route page home
    $("#home-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("home").style.display = "block";
    });

    // Route page panel
    $("#panel-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("panel").style.display = "block";

        try {
            eel.get_api_information()(function (dt) {
                var data_json = JSON.parse(dt)
                let main = document.getElementById("area-credits-shodan").children

                // Configuração da barra de progresso "monitored_ips"...
                let usage_monitored_ips_total = (((data_json.usage_limits.monitored_ips - data_json.monitored_ips) / data_json.usage_limits.monitored_ips) * 100);
                main[0].children[0].innerHTML = "Ips Monitorados";
                main[0].children[1].children[0].attributes[5].value = data_json.usage_limits.monitored_ips;
                main[0].children[1].children[0].innerText = `${parseInt(usage_monitored_ips_total)}%`;
                main[0].children[1].children[0].style = `width: ${parseInt(usage_monitored_ips_total)}%`;

                // Configuração da barra de progresso "query_credits"...
                let usage_query_credit_total = ((data_json.query_credits / data_json.usage_limits.query_credits) * 100);
                main[1].children[0].innerHTML = "Créditos de consulta";
                main[1].children[1].children[0].attributes[5].value = data_json.usage_limits.query_credits;
                main[1].children[1].children[0].innerText = `${parseInt(usage_query_credit_total)}%`;
                main[1].children[1].children[0].style = `width: ${parseInt(usage_query_credit_total)}%`;

                // Configuração da barra de progresso "scan_credits"...
                let usage_scan_credit_total = ((data_json.scan_credits / data_json.usage_limits.scan_credits) * 100);
                main[2].children[0].innerHTML = "Créditos de Varredura";
                main[2].children[1].children[0].attributes[5].value = data_json.usage_limits.scan_credits;
                main[2].children[1].children[0].innerText = `${parseInt(usage_scan_credit_total)}%`;
                main[2].children[1].children[0].style = `width: ${parseInt(usage_scan_credit_total)}%`;

                // Configurações do nome
                let profile = document.getElementsByTagName("edu");
                profile[0].innerText = (data_json.plan === "edu") ? "Estudante" : "Indefinido";

                try {
                    eel.load_config_user()(d => {
                        const data = JSON.parse(d);

                        // Configuração do box do perfil...
                        let main_profile = document.getElementById("info-profile-id");
                        main_profile.children[1].children[0].innerHTML = data.NAME;

                        // configuração da imagem do perfil...
                        main_profile.children[0].src = data.LINK_PROFILE
                    });
                } catch (e) {
                    $.notify(messagesPage.error_application, "error");
                    eel.save_logs(e.message,"errors", "Error Exception load_config_user Client")() // Salvando o log de erro...
                }

                // ...
            });
        }   catch (e) {
            $.notify(messagesPage.error_application, "error");
            eel.save_logs(e.message,"errors", "Error Exception get_api_information Client")() // Salvando o log de erro...
        }

    });

    // Route page settings
    $("#settings-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("settings").style.display = "block";

        try {
            eel.load_config_user()(d => {
                const data = JSON.parse(d);

                // Get form..
                let main_form = document.getElementById("form-settings").children

                // Config name project
                main_form[0].children[1].value = data.NAME_PROJECT;
                // Config name user
                main_form[1].children[1].value = data.NAME;
                // Config Email
                main_form[2].children[1].children[1].value = data.EMAIL;
                // Config username
                main_form[3].children[1].value = data.USERNAME;
                // Config url shodan
                main_form[4].children[1].value = data.SHODAN;
                // Config url api shodan
                main_form[5].children[1].value = data.SHODAN_API_LINK;
                // Config url avatar profile
                main_form[6].children[1].value = data.LINK_PROFILE;
                // Config api key shodan
                main_form[7].children[1].value = data.API_KEY;

            });
        } catch (e) {
            $.notify(messagesPage.error_application, "error");
            eel.save_logs(e.message,"errors", "Error Exception load_config_user Client")() // Salvando o log de erro...
        }

    });

    // Route page search cdir
    $("#search-cdir-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("search-cdir").style.display = "block";
    });

    // Route page search ip
    $("#search-ip-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("search-ip").style.display = "block";
    });

    // Route page reserver dns
    $("#reverse_dns-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("reverse_dns").style.display = "block";
    });

    // Route page reserver dns
    $("#resolve_dns-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("resolve_dns").style.display = "block";
    });

    // Route page search subdomains
    $("#get_subdomais-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("get_subdomais").style.display = "block";
    });
});

/*
* --------------------------------------------------------------------------------------
* Local onde está sendo tratada toda pesquisa relacionada a pádina de "Busca por CDIR"...
* --------------------------------------------------------------------------------------
* */

// Função declarada para aplicar um card na pádina com os valores de pesquisa.
function templateCardCdir(datas) {
    return `<div class="col">
              <div class="card shadow-sm">
                <div class="card-body">    
                  
                  <div>                    
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group"><h4>${datas.product}</h4></div>
                        <small style="font-weight: bold">${datas.country_code}</small>
                    </div>                    
                  </div>
                  <div><span style="font-weight: bold">Organização: </span><span>${datas.org}</span></div>
                  <hr/>
                  <div><span style="font-weight: bold">Nome do host: </span><span>${datas.hostnames}</span></div>
                  <div><span style="font-weight: bold">Domínio: </span><span>${datas.domains}</span></div>
                  <div><span style="font-weight: bold">IP: </span><span>${datas.ip_str}</span></div>
                  <div><span style="font-weight: bold">Servidor: </span><span>${datas.server}</span></div>
                  <hr />
                  <div>${datas.data.toString()}</div>
                  <hr />
                  <div><span style="font-weight: bold">Cidade: </span><span>${datas.city} </span><span style="font-weight: bold">País: </span><span>${datas.country_name}</span></div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group"></div>
                    <small><span style="font-weight: bold">ASN: </span><span style="">${datas.asn}</span></small>
                  </div>
    
                </div>
              </div>
            </div>`
}

// Função destinada a buscar por uma determinada rede pela página busca por CDIR...
$("#action-search-cdir").click(() => {
    document.getElementById("results_cdir_content").innerHTML = "" // Limpa o campo de resultados...
    document.getElementById("loader-progress").children[1].style.display = "none"; // Remove total se estiver visivel...
    let search_cdir = document.getElementById("search-net-api"); // Seleciona o elemento do input do search para recuperar os valores...
    document.getElementById("loader-progress").children[0].style.display = "block"; // Exibe o elemento de progress...

    let total_result_cdir = 0
    try {
        if (search_cdir.value === "") {
            $.notify(messagesPage.search_error_empty, "error")
            // Remove load feedback...
            document.getElementById("loader-progress").children[0].style.display = "none"; // Esconte o elemento de progresso...
            document.getElementById("loader-progress").children[1].style.display = "none"; // Exibe o elemento do total...
        } else {
            /// Realizando a busca pela rede...
            eel.get_net(search_cdir.value)(response => {
                //
                if (response.matches) {
                    for (let mat of response.matches) {
                        $("#results_cdir_content").append(templateCardCdir({
                            "asn": (!mat.asn || mat.asn === "") ? "Nulo" : mat.asn,
                            "org": (!mat.org || mat.org === "") ? "Nulo" : mat.org,
                            "product": (!mat.product || mat.product === "") ? "Não identificado" : mat.product,
                            "ip_str": (!mat.ip_str || mat.ip_str === "") ? "Nulo" : mat.ip_str,
                            "hostnames": (mat.hostnames.length === 0 || !mat.hostnames || mat.hostnames === "") ? "Nulo" : mat.hostnames,
                            "country_code": (!mat.location || !mat.location.country_code || mat.location.country_code === "") ? "Nulo" : mat.location.country_code,
                            "city": (!mat.location.city || mat.location.city === "") ? "Nulo" : mat.location.city,
                            "country_name": (!mat.location || !mat.location.country_name || mat.location.country_name === "") ? "Nulo" : mat.location.country_name,
                            "server": (!mat.http || !mat.http.server || mat.http.server === "") ? "Nulo" : mat.http.server,
                            "data": (!mat.data || mat.data === "") ? "Nulo" : mat.data,
                            "domains": (!mat.domains || mat.domains === "") ? "Nulo" : mat.domains,
                        }));
                        total_result_cdir += 1
                    }
                } else if (response.empty) {
                    $.notify(response.empty, "error")
                } else if (response.error) {
                    $.notify(response.error, "error");
                }

                // Remove load feedback...
                document.getElementById("loader-progress").children[0].style.display = "none"; // Esconte o elemento de progresso...
                document.getElementById("loader-progress").children[1].style.display = "block"; // Exibe o elemento do total...
                document.getElementById("loader-progress").children[1].children[0].children[1].innerHTML = total_result_cdir // Atualiza o total...
            });
        }
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception get_net Client")() // Salvando o log de erro...

        // Remove load feedback...
        document.getElementById("loader-progress").children[0].style.display = "none"; // Esconte o elemento de progresso...
        document.getElementById("loader-progress").children[1].style.display = "none"; // Exibe o elemento do total...
    }
});


/*
* --------------------------------------------------------------------------------------
* Local onde está sendo tratada toda pesquisa relacionada a pádina de "Busca por IP"...
* --------------------------------------------------------------------------------------
* */

function templateGetIp(datas){
    return `<div class="col">
            <div class="card shadow-sm">
              <div class="card-body">

                <div>
                  <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group"><h4>${datas.ip_str}</h4></div>
                      <small style="font-weight: bold">${datas.country_code}</small>
                  </div>
                </div>
                <div><span style="font-weight: bold">Organização: </span><span>${datas.org}</span></div>
                <hr/>
                <div><span style="font-weight: bold">Nome do host: </span><span>
                    ${(datas.hostnames === "Nulo")? "Não identificado ou não existe" : datas.hostnames.map((data, index) => " <span>"+data+"</span>")}
                </span></div>
                <div><span style="font-weight: bold">Domínio: </span><span>
                    ${(datas.domains === "Nulo")? "Não identificado ou não existe" : datas.domains.map((data, index) => " <span>"+data+"</span>")}
                </span></div>

                <div><span style="font-weight: bold">Portas abertas: </span><span>
                    ${(datas.ports === "Nulo")? "Não identificado ou não existe" : datas.ports.map((data, index) => " <span>"+data+"</span>")}
                </span></div>
                <hr />
                <div><span style="font-weight: bold">Cidade: </span><a href=${datas.location_map} target="_blank" style="color: blue;text-decoration: none;">${datas.city} </a><span style="font-weight: bold; margin-left: 5px;">País: </span><span>${datas.country_name}</span></div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group"></div>
                  <small><span style="font-weight: bold">ASN: </span><span style="">${datas.asn}</span></small>
                </div>

              </div>
             </div>
            </div>
           `
}

function templateGetIpInfoPorts(datas) {
    return `<div class="col">
              <div class="card shadow-sm">
                <div class="card-body">
                    
                  <div>                    
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group"><h4>${datas.product}</h4></div>                        
                        <span style="font-weight: bold"><span>Transporte: </span><span>${(!datas.transport || datas.transport === "Nulo")? "Não identificado ou não existe" : datas.transport}</span></span>
                        <span style="font-weight: bold"><h5>${(!datas.port || datas.port === "Nulo")? "Não identificado ou não existe" : datas.port}</h5></span>
                    </div>                    
                  </div>
                  <div><span style="font-weight: bold">Organização: </span><span>${datas.org}</span></div>
                  <hr/>
                  <div><span style="font-weight: bold">IP: </span><span>
                    ${
                        (datas.data.split(" ").filter(str => { return str.includes("HTTP") }).length === 0)
                            ? datas.ip_str 
                            : (datas.data.split(" ").filter(str => { return str.includes("OpenSSL") }).length === 0) 
                                ? "<a style='color: blue;text-decoration: none' href='http://"+datas.ip_str+":"+datas.port+"' target='_blank'>"+datas.ip_str+"</a>"
                                : "<a style='color: blue;text-decoration: none' href='https://"+datas.ip_str+":"+datas.port+"' target='_blank'>"+datas.ip_str+"</a>"
                    }
                  </a></div>
                  <div><span style="font-weight: bold">Servidor: </span><span>${(!datas.server || datas.server === "Nulo")? "Não identificado ou não existe" : datas.server}</span></div>
                  <hr />
                  <div>${datas.data.toString()}</div>
                  <hr />
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group"></div>
                    <small><span style="font-weight: bold">ASN: </span><span style="">${datas.asn}</span></small>
                  </div>
                 
                </div>
              </div>
            </div>`
}

$("#action-search-ip").click(() => {
    document.getElementById("results_ip_content").innerHTML = "" // Limpa o campo de resultados...
    let search_ip = document.getElementById("search-ip-api"); // Seleciona o elemento do input do search para recuperar os valores...
    document.getElementById("loader-progress-ip").children[0].style.display = "block"; // Exibe o elemento de progress...

    try {
        if (search_ip.value === "") {
            $.notify(messagesPage.search_error_empty, "error")
            document.getElementById("loader-progress-ip").children[0].style.display = "none"; // Esconte o elemento de progresso...
        } else {
            // Buscando pelo ip...
            eel.get_info_ip(search_ip.value)(response => {


                if (response.error) {
                    $.notify(response.error, "error");
                } else {
                    let mat = JSON.parse(response)
                    $("#results_ip_content").append(templateGetIp({
                        "asn": (!mat.asn || mat.asn === "") ? "Nulo" : mat.asn,
                        "org": (!mat.org || mat.org === "") ? "Nulo" : mat.org,
                        "product": (!mat.product || mat.product === "") ? "Não identificado" : mat.product,
                        "ip_str": (!mat.ip_str || mat.ip_str === "") ? "Nulo" : mat.ip_str,
                        "hostnames": (mat.hostnames.length === 0 || !mat.hostnames || mat.hostnames === "") ? "Nulo" : mat.hostnames,
                        "country_code": (!mat.country_code || mat.country_code === "") ? "Nulo" : mat.country_code,
                        "city": (!mat.city || mat.city === "") ? "Nulo" : mat.city,
                        "country_name": (!mat.country_name || mat.country_name === "") ? "Nulo" : mat.country_name,
                        "domains": (!mat.domains || mat.domains === "" || mat.domains.length === 0) ? "Nulo" : mat.domains,
                        "ports": (!mat.ports || mat.ports === "" || mat.ports.length === 0) ? "Nulo" : mat.ports,
                        "location_map": (!mat.latitude || !mat.longitude || mat.latitude === "" || mat.latitude.length === 0 || mat.longitude === "" || mat.longitude.length === 0) ? "" : `https://www.google.com.br/maps/@${mat.latitude},${mat.longitude}`,
                        "data_array": (!mat.data || mat.data.length === 0 || mat.data === "") ? "Nulo" : mat.data
                    }));

                    mat.data.forEach((data, index) => {
                        $("#results_ip_content").append(templateGetIpInfoPorts({
                            "asn": (!data.asn || data.asn === "") ? "Nulo" : data.asn,
                            "product": (!data.product || mat.product === "") ? "Não identificado" : data.product,
                            "data": (!data.data || data.data === "") ? "" : data.data,
                            "ip_str": (!data.ip_str || data.ip_str === "") ? "Nulo" : mat.ip_str,
                            "port": (!data.port || data.port === "") ? "Nulo" : data.port,
                            "transport": (!data.transport || data.transport === "") ? "Nulo" : data.transport,
                            "server": (!data.http || !data.http.server || data.http.server === "") ? "Nulo" : data.http.server,
                        }));
                    });
                }

                document.getElementById("loader-progress-ip").children[0].style.display = "none"; // Esconte o elemento de progresso...
            });
        }
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception get_info_ip Client")() // Salvando o log de erro...
        document.getElementById("loader-progress-ip").children[0].style.display = "none"; // Esconte o elemento de progresso...
    }
});

/*
* ----------------------------------------------------------------------------------------
* Local onde está sendo tratada toda pesquisa relacionada a pádina de "Reversão de DNS"...
* ----------------------------------------------------------------------------------------
* */

//
function templateReverseDNS(datas) {
    return `<div class="col">
             <div class="card shadow-sm">
              <div class="card-body">
                 <div><span style="font-weight: bold">Dominio: </span><span>${datas.host}</span><div>
                 <div><span style="font-weight: bold">DNS: </span><span>${datas.dns}</span><div>
              </div>
             </div>
           </div>`
}

$("#action-search-reverse_dns").click(() => {
    document.getElementById("results_reverse_dns_content").innerHTML = "" // Limpa o campo de resultados...
    let search_dns = document.getElementById("search-reverse_dns-api"); // Seleciona o elemento do input do search para recuperar os valores...
    document.getElementById("loader-progress-reverse_dns").children[0].style.display = "block"; // Exibe o elemento de progress...

    try {
        if (search_dns.value === "") {
            $.notify(messagesPage.search_error_empty, "error");
            document.getElementById("loader-progress-reverse_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
        } else {
            eel.reverse_dns(search_dns.value)(response => {
                let resp = JSON.parse(response)
                let index = ""
                let dns = ""

                if (resp.error) {
                    $.notify(messagesPage.error_search_dns, "error");
                    document.getElementById("loader-progress-reverse_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
                } else {
                    for (let idx in resp) {
                        index = idx
                        if (resp[index] === null || resp[index] === "") {
                            $.notify(messagesPage.error_search_dns, "error");
                            document.getElementById("loader-progress-reverse_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
                        } else {
                            for (let val of resp[index]) {
                                dns = val
                            }
                            $("#results_reverse_dns_content").append(templateReverseDNS({
                                "host": index,
                                "dns": dns
                            }));
                        }
                    }
                }

                document.getElementById("loader-progress-reverse_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
            });
        }
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception reverse_dns Client")() // Salvando o log de erro...
        document.getElementById("loader-progress-reverse_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
    }
});


/*
* ----------------------------------------------------------------------------------------
* Local onde está sendo tratada toda pesquisa relacionada a pádina de "Resolução de DNS"...
* ----------------------------------------------------------------------------------------
* */

//
function templateResolveDNS(datas) {
    return `<div class="col">
             <div class="card shadow-sm">
              <div class="card-body">
                 <div><span style="font-weight: bold">Dominio: </span><span>${datas.host}</span><div>
                 <div><span style="font-weight: bold">DNS: </span><span>${datas.dns}</span><div>
              </div>
             </div>
           </div>`
}

$("#action-search-resolve_dns").click(() => {
    document.getElementById("results_resolve_dns_content").innerHTML = "" // Limpa o campo de resultados...
    let search_dns_rev = document.getElementById("search-resolve_dns-api"); // Seleciona o elemento do input do search para recuperar os valores...
    document.getElementById("loader-progress-resolve_dns").children[0].style.display = "block"; // Exibe o elemento de progress...

    // Buscando por uma resolução do DNS...
    try {
        if (search_dns_rev.value === "") {
            $.notify(messagesPage.search_error_empty, "error");
            document.getElementById("loader-progress-resolve_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
        } else {
            eel.resolve_dns(search_dns_rev.value)(response => {
                let resp = JSON.parse(response)
                let index = ""
                let dns = ""

                if (resp.error) {
                    $.notify(messagesPage.error_search_dns, "error");
                    document.getElementById("loader-progress-resolve_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
                } else {
                    for (let idx in resp) {
                        index = idx
                        if (resp[index] === null || resp[index] === "") {
                            $.notify(messagesPage.error_search_dns, "error");
                            document.getElementById("loader-progress-resolve_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
                        } else {
                            $("#results_resolve_dns_content").append(templateResolveDNS({
                                "host": (!index || index === "") ? "Não encontrado" : index,
                                "dns": (!resp[index] || resp[index] === "") ? "Não encontrado" : resp[index]
                            }));
                        }
                    }
                }
                document.getElementById("loader-progress-resolve_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
            });
        }
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception resolve_dns Client")() // Salvando o log de erro...
        document.getElementById("loader-progress-reverse_dns").children[0].style.display = "none"; // Esconte o elemento de progresso...
    }
});

/*
* ----------------------------------------------------------------------------------------
* Local onde está sendo tratada toda pesquisa relacionada a pádina de "Buscas Subdominios"...
* ----------------------------------------------------------------------------------------
* */

function templateGetSubdomains(datas) {
    return `<div class="col">
           <div class="card shadow-sm">
            <div class="card-body">
                <div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group"><h5>${datas.subdomain}.${datas.domain_search}</h5></div>
                    <span><span style="font-weight: bold">Tipo: </span>${datas.type}</span>
                  </div>
                </div>
                <div><span style="font-weight: bold">IP: </span><span>${datas.ip}</span><div>
                <hr />                
                <span>
                    <span style="font-weight: bold">Portas: </span>
                    ${(datas.ports === "Nulo")? "Não identificado ou não existe" : datas.ports.map((data, index) => " <span>"+data+"</span>")}
                </span>
            </div>
           </div>
         </div>`
}

$("#action-search-get_subdomais").click(() => {
    document.getElementById("results_get_subdomais_content").innerHTML = "" // Limpa o campo de resultados...
    let search_subdomais = document.getElementById("search-get_subdomais-api"); // Seleciona o elemento do input do search para recuperar os valores...
    document.getElementById("loader-progress-get_subdomais").children[0].style.display = "block"; // Exibe o elemento de progress...

    // Buscando por subdominios...
    try {
        if (search_subdomais.value === "") {
            $.notify(messagesPage.search_error_empty, "error")
        } else {
            eel.get_subdomais(search_subdomais.value)(response => {
                let resp = JSON.parse(response)

                if (resp.error) {
                    $.notify(messagesPage.error_application, "error");
                    document.getElementById("loader-progress-get_subdomais").children[0].style.display = "none"; // Esconte o elemento de progresso...
                } else {
                    resp.data.forEach((datas_resp, index) => {
                        $("#results_get_subdomais_content").append(templateGetSubdomains({
                            "subdomain": (!datas_resp.subdomain || datas_resp.subdomain === "") ? "Nulo" : datas_resp.subdomain,
                            "type": (!datas_resp.type || datas_resp.type === "") ? "" : datas_resp.type,
                            "ip": (!datas_resp.value || datas_resp.value === "") ? "" : datas_resp.value,
                            "domain_search": search_subdomais.value,
                            "ports": (!datas_resp.ports || datas_resp.ports.length === 0 || datas_resp.ports === "") ? "Nulo" : datas_resp.ports
                        }));
                    });
                }

            });
        }

        document.getElementById("loader-progress-get_subdomais").children[0].style.display = "none"; // Esconte o elemento de progresso...
    } catch (e) {
        $.notify(messagesPage.error_application, "error");
        eel.save_logs(e.message,"errors", "Error Exception get_subdomais Client")() // Salvando o log de erro...
        document.getElementById("loader-progress-get_subdomais").children[0].style.display = "none"; // Esconte o elemento de progresso...
    }
});


function templateReport(child_result) {
    return `
        <html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
                <title>${child_result.title}</title>
            </head>
            <body style="background: #a8a8a8">
                <main>
                    <div class="container">
                        <div class="gap-3 mt-3" style="grid-template-columns: 1fr;">                
                            <div class="border rounded-3 p-3">
                                <div class="row row-cols-1 row-cols-sm-1 row-cols-md-1 g-3">
                                    ${child_result.content}
                                </div>
                            </div>                
                        </div>
                    </div>                
                </main>
                
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js" integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT" crossorigin="anonymous"></script>            
            </body>
        </html>
    `
}

function report_search(id, title) {
    let doc = document.getElementById(id).children[0].children[0].children[0].children[0].innerHTML;
    console.log(doc)

    let display = window.open(document.location.href, 'mywindow', 'status=1,width=1200,height=900')
    display.document.write(templateReport({
        "title": title,
        "content": doc
    }));

}
