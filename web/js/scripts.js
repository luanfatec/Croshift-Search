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
            console.log(count_log)
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
