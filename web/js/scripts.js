function myforeach(data, idx, err) {
    console.log(data)
}

$("#loag_logs").click(() => {
    let type_log = document.getElementById("type_log")
    let limit_log = document.getElementById("limit-log")
    console.log(limit_log.options[limit_log.options.selectedIndex].value)

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
    eel.update_settings_user(data_form)((response) => {
        let resp = JSON.parse(response) // ..

        if (resp.success) {
            $.notify(resp.success, "success");

        } else if (resp.error) {
            $.notify(resp.error, "error");
        }

    })
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

        eel.get_api_information()(function (dt) {
            var data_json = JSON.parse(dt)
            let main = document.getElementById("area-credits-shodan").children

            // Configuração da barra de progresso "monitored_ips"...
            let usage_monitored_ips_total = (((data_json.usage_limits.monitored_ips - data_json.monitored_ips)/data_json.usage_limits.monitored_ips)*100);
            main[0].children[0].innerHTML = "Ips Monitorados";
            main[0].children[1].children[0].attributes[5].value = data_json.usage_limits.monitored_ips;
            main[0].children[1].children[0].innerText = `${parseInt(usage_monitored_ips_total)}%`;
            main[0].children[1].children[0].style = `width: ${parseInt(usage_monitored_ips_total)}%`;

            // Configuração da barra de progresso "query_credits"...
            let usage_query_credit_total = ((data_json.query_credits/data_json.usage_limits.query_credits)*100);
            main[1].children[0].innerHTML = "Créditos de consulta";
            main[1].children[1].children[0].attributes[5].value = data_json.usage_limits.query_credits;
            main[1].children[1].children[0].innerText = `${parseInt(usage_query_credit_total)}%`;
            main[1].children[1].children[0].style = `width: ${parseInt(usage_query_credit_total)}%`;

            // Configuração da barra de progresso "scan_credits"...
            let usage_scan_credit_total = ((data_json.scan_credits/data_json.usage_limits.scan_credits)*100);
            main[2].children[0].innerHTML = "Créditos de Varredura";
            main[2].children[1].children[0].attributes[5].value = data_json.usage_limits.scan_credits;
            main[2].children[1].children[0].innerText = `${parseInt(usage_scan_credit_total)}%`;
            main[2].children[1].children[0].style = `width: ${parseInt(usage_scan_credit_total)}%`;

            // Configurações do nome
            let profile = document.getElementsByTagName("edu");
            profile[0].innerText = (data_json.plan === "edu") ? "Estudante" : "Indefinido";

            eel.load_config_user()(d => {
                const data = JSON.parse(d);

                // Configuração do box do perfil...
                let main_profile = document.getElementById("info-profile-id");
                main_profile.children[1].children[0].innerHTML = data.NAME;

                // configuração da imagem do perfil...
                main_profile.children[0].src = data.LINK_PROFILE
            });

            // ...
        });

    });

    // Route page settings
    $("#settings-lk").click(() => {
        for (let idx = 0; idx < document.getElementsByTagName("main")[0].children.length; idx++) {
            document.getElementsByTagName("main")[0].children[idx].style.display = "none";
        }
        document.getElementById("settings").style.display = "block";

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
    /// Realizando a busca pela rede...
    eel.get_net(search_cdir.value)(response => {
        //
        if (response.matches) {
            for (let mat of response.matches) {
                $("#results_cdir_content").append(templateCardCdir({
                    "asn": (!mat.asn || mat.asn === "")? "Nulo" : mat.asn,
                    "org": (!mat.org || mat.org === "")? "Nulo" : mat.org,
                    "product": (!mat.product || mat.product === "")? "Não identificado" : mat.product,
                    "ip_str": (!mat.ip_str || mat.ip_str === "")? "Nulo" : mat.ip_str,
                    "hostnames": (mat.hostnames.length === 0 || !mat.hostnames || mat.hostnames === "")? "Nulo" : mat.hostnames,
                    "country_code": (!mat.location || !mat.location.country_code || mat.location.country_code === "")? "Nulo" : mat.location.country_code,
                    "city": (!mat.location.city || mat.location.city === "")? "Nulo" : mat.location.city,
                    "country_name": (!mat.location || !mat.location.country_name || mat.location.country_name === "")? "Nulo" : mat.location.country_name,
                    "server": (!mat.http || !mat.http.server || mat.http.server === "")? "Nulo" : mat.http.server,
                    "data": (!mat.data || mat.data === "")? "Nulo" : mat.data,
                    "domains": (!mat.domains || mat.domains === "")? "Nulo" : mat.domains,
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
});


// get_info_ip
/*
* --------------------------------------------------------------------------------------
* Local onde está sendo tratada toda pesquisa relacionada a pádina de "Busca por CDIR"...
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
    document.getElementById("results_ip_content").innerHTML = "" // Limpa o campo de resultados... 78.39.46.1
    let search_ip = document.getElementById("search-ip-api"); // Seleciona o elemento do input do search para recuperar os valores...
    document.getElementById("loader-progress-ip").children[0].style.display = "block"; // Exibe o elemento de progress...

    // Buscando pelo ip...
    eel.get_info_ip(search_ip.value)(response => {


        if (response.error) {
            $.notify(response.error, "error");
        } else {
            let mat = JSON.parse(response)
            $("#results_ip_content").append(templateGetIp({
                "asn": (!mat.asn || mat.asn === "")? "Nulo" : mat.asn,
                "org": (!mat.org || mat.org === "")? "Nulo" : mat.org,
                "product": (!mat.product || mat.product === "")? "Não identificado" : mat.product,
                "ip_str": (!mat.ip_str || mat.ip_str === "")? "Nulo" : mat.ip_str,
                "hostnames": (mat.hostnames.length === 0 || !mat.hostnames || mat.hostnames === "")? "Nulo" : mat.hostnames,
                "country_code": (!mat.country_code || mat.country_code === "")? "Nulo" : mat.country_code,
                "city": (!mat.city || mat.city === "")? "Nulo" : mat.city,
                "country_name": (!mat.country_name || mat.country_name === "")? "Nulo" : mat.country_name,
                "domains": (!mat.domains || mat.domains === "" || mat.domains.length === 0)? "Nulo" : mat.domains,
                "ports": (!mat.ports || mat.ports === "" || mat.ports.length === 0)? "Nulo" : mat.ports,
                "location_map": (!mat.latitude || !mat.longitude || mat.latitude === "" || mat.latitude.length === 0 || mat.longitude === "" || mat.longitude.length === 0)? "" : `https://www.google.com.br/maps/@${mat.latitude},${mat.longitude}`,
                "data_array": (!mat.data || mat.data.length === 0 || mat.data === "")? "Nulo" : mat.data
            }));

            mat.data.forEach((data, index) => {
                $("#results_ip_content").append(templateGetIpInfoPorts({
                    "asn": (!data.asn || data.asn === "")? "Nulo" : data.asn,
                    "product": (!data.product || mat.product === "")? "Não identificado" : data.product,
                    "data": (!data.data || data.data === "")? "" : data.data,
                    "ip_str": (!data.ip_str || data.ip_str === "")? "Nulo" : mat.ip_str,
                    "port": (!data.port || data.port === "")? "Nulo" : data.port,
                    "transport": (!data.transport || data.transport === "")? "Nulo" : data.transport,
                    "server": (!data.http || !data.http.server || data.http.server === "")? "Nulo" : data.http.server,
                }));
            });
        }

        document.getElementById("loader-progress-ip").children[0].style.display = "none"; // Esconte o elemento de progresso...
    });
})