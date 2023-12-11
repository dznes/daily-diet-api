Configurando o KNEX:

criar o arquivo src\database.ts

Na configuração do knex tem duas opções que são obrigatórias:
- Client (qual banco de dados estamos usando)
- Connection (precisa das informações da conexão com o banco de dados).
No SQLite que estamos utilizando neste projeto, precisa informar apenas "filename" que é o nome do arquivo que vamos salvar o banco de dados. Exemplo: './tmp/app.db' ("./" porque o caminho é sempre relativo da posição onde estamos executando o código, então sempre vai partir da pasta raiz. A nomenclatura "tmp" significa temporário, já que não vamos utilizar o SQLite em produção, ou seja, apenas em desenvolvimento.)
Existe uma tabela universal 'sqlite_schema', criada automaticamente em todos os bancos de dados. Que contém informações das outras tabelas.

Para o knex consiga conhecer as configurações do banco de dados, existe uma convenção de criar um arquivo na raiz "knexfile.ts".

Comando para criar um arquivo de migration. Em que você precisa configurar o UP(criação da tabela) ou o DOWN(apagar a tabela)
npm run knex -- migrate:make create-documents

Comando para executar a migration:


As tabelas nativas do SQLite com o KNEX "knex_migrations" e a "knex_migrations_lock" são responsáveis por registrar no banco de dados quais migrations já foram executadas.
A partir do momento em que uma migration foi enviada para produção ou para o time, ela NUNCA mais pode ser EDITADA. Vai ser necessário criar uma nova migration para alterar qualquer configuração que precisa ser alterada da migration já em produção.
Porque uma vez que uma outra pessoa do time já executou a migration, se você editar a migration ela nunca vai receber a edição, porque no banco de dados daquela pessoa já vai estar anotado que ela executou aquela migration, pelas duas tabelas citadas anteriormente.

Mas caso a migration ainda não tenha sido ido para produção ou para os colaboradores você pode editar. Primeiro precisa para a aplicação e rodar o comando:
npm run knex --migrate:rollback
E então realizar as alterações necessárias no arquivo da migration.



