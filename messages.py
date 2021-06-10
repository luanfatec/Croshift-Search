class MessagesLogs(object):
    def __init__(self):
        self.success_update_file_config = "Suas configurações foram salvas com sucesso."
        self.error_update_file_config = "Houve um erro ao salvar suas configurações, verifique os logs."
        self.error_update_file_config_email = "E-mail inválido, verifique e tente novamente."

        self.get_log_success = "Dados de log recuperados com sucesso."
        self.get_log_error = "Houve um erro ao recuperar os logs do arquivo:"

        self.search_error = "Houve um erro ao processar sua pesquisa, verifique os argumentos e tente novamente ou consulte os logs."
        self.search_error_sintax_one = "Houve um erro na sintax do arqumento para pesquisa, por favor, verifique o texto e tente novamente."
        self.search_error_sintax_two = "O campo de pesquisa está vazio, por favor, insira um parâmetro para pesquisa e tente novamente."
        self.search_error_empty = "Não foi localizado nenhum resultado com o parâmetro da sua pesquisa."
        self.search_error_get_ip = "Não foi localizado nenhum resultado com o parâmetro informado, por favor, tente novamente."
        self.search_error_excep_get_ip = "Houve um erro no processamento da aplicação, por favor, verifique os logs ou consulte os no arquivo de log."
