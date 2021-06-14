import eel
from sholib import *

eel.init('web')

@eel.expose
def get_api_information():
    return ManipuleShodan().get_api_information()

# Rota destinada a retornar um array em json de informações baseadas em uma rede...
@eel.expose
def get_net(rede):
    return ManipuleShodan().get_net(f"net:{rede}")

# Rota destinada a realizar uma busca mais avançada em um endereço ip.
@eel.expose
def get_info_ip(ip):
    return ManipuleShodan().get_info_ip(f"{ip}")

@eel.expose
def reverse_dns(apis):
    return ManipuleShodan().reverse_dns(f"{apis}")

@eel.expose
def resolve_dns(hostname):
    return ManipuleShodan().resolve_dns(f"{hostname}")

@eel.expose
def get_subdomais(hostname):
    return ManipuleShodan().get_subdomais(f"{hostname}")

# Routa para carregamento das informações de usuário.
@eel.expose
def load_config_user():
    return ManipuleShodan().run_variables()

# Rota de atualização de configurações.
@eel.expose
def update_settings_user(data_config):
    return ManipuleShodan().update_file_config({
        "config": [
            data_config
        ]
    })

# Rota de recuperação de log.
@eel.expose
def get_logs(type_log):
    return ManipuleShodan().get_logs(type_log)

# Rota especifica para salvar os logs do lado cliente.
@eel.expose
def save_logs(message, file, type_error):
    ManipuleShodan().save_logs(message, file, type_error)

try:
    eel.start('index.html', port=0)   #python will select free ephemeral ports.
except (SystemExit, MemoryError, KeyboardInterrupt):
    print ("Program Exit, Save Logs if Needed")
