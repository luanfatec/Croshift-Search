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
});
