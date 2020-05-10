![CS Cases Bot](https://i.imgur.com/SUvdwFA.png)
# CS-Cases Bot 🇧🇷 🇺🇸

### Sobre / About
🇧🇷

Um bot que simula abertura de caixas de CS-GO em um canal do discord. Com ele você pode: pesquisar caixas no mercado da steam, ver conteúdo de caixas, verificar preços e simular aberturas de caixa, adicionando-as ao seu 'inventário'.

**Atenção:** Esse projeto foi feito inteiramente por diversão, então otimização de código não foi a prioridade, é bem possível que você estranhe coisas que eu fiz nesse código, eu mesmo fico meio incomodado com algumas coisas, mas como eu fiz só pra brincar não acho que faça mal. 

Esse projeto foi possível apenas graças à api da equipe da [Hexa.One](https://hexa.one) e a api incrível para busca de preços no mercado da steam, e ao pessoal do [discord.js](https://discord.js.org/#/), que diminuiu bastante meu trabalho com uma biblioteca extremamente simples de usar. Sem essas duas equipes provavelmente o meu trabalho teria se extendido por algumas semanas ou até meses.

Esse bot **NÃO ABRE CAIXAS NA STEAM**, apenas simula dentro de um servidor do discord **PARA DIVERSÃO**. A única aplicação 'séria' desse bot seria para pesquisar alguns preços ou skins ou conteúdo de caixas, já que todas as informações são reais, fora isso esse bot é apenas para **DIVERSÃO**.

🇺🇸

A bot that simulates CSGO cases opening on a text channel. With this you can: search boxes on steam marketplace, see box contents, check prices (skins/cases) and simulated case opening, adding them to your inventory.

**Disclaimer:** This project was entirely made for fun, so code optimization was not my main objective, you'll probably cringe with some stuff here in this code, I do too, but since it was made entirely for fun, I guess that's not a problem for me at all. 

This project was only possible thanks to [Hexa.One](https://hexa.one) guys (if any of you guys are reading this, I tried paying for unlimited access but none of my payment methods were accepted, probably because I live in Brazil and I think the main payment is somewhere near Russia or something, I hope this little cache won't bother you <3, you can always contact me if any problem) and their AMAZING api for searching steam market prices/items, and [discord.js](https://discord.js.org/#/) team, which their easy library is so fun and easy to use that I had barely no trouble at all. Without their code this project could easily be extended to weeks, maybe months.

This bot **WON'T OPEN CASES REAL CASES**, it will only simulate opening it inside a discord bot **FOR FUN**. You can use it to search skins, case contents and some average prices directly from discord, besides that, this bot is just for **FUN**.


### Requisitos / Requirements

- NodeJs v12.16.2
- MongoDB
- Discord application
- Hexa One API Key


### Discord Application
🇧🇷

Criar uma aplicação no discord é bem fácil, acessa o [link](https://discord.com/developers/docs/intro) e segue a documentação na sessão 'Bots and Apps'. Depois de criar um a aplicação, no menu da direita entre na sessão bot e adicione um bot, a sua aplicação. A única coisa que vc vai precisar é o token do seu bot e o id da sua aplicação. Clique em Copy e coloca em algum lugar seguro aí.

🇺🇸

Making a discord application is pretty easy, just follow this [tutorial](https://discord.com/developers/docs/intro) on the 'Bots and Apps' section. After creating an application, on the left menu click on 'Bot' and add a new bot. The only think you'll need it's the bot's token and your application's id.

![Discord Application Id](https://i.imgur.com/1ZgIwEF.png)
![Discord Bot Token](https://i.imgur.com/qsW4apv.png)


### Hexa One
🇧🇷

É necessário ter uma chave de api no [Hexa One](https://hexa.one). Linka a sua conta da Steam e pega a chave da api no seu perfil.

🇺🇸

You need a [Hexa One](https://hexa.one). Link your steam account and grab your api key on your profile.


![img](https://i.imgur.com/TBK17iT.png)


### Variáveis de ambiente / Environment Variables
🇧🇷

Quando terminar de pegar todas as chaves, configure suas variáveis de ambiente em um .env como no exemplo:

(target text channel ===> O canal que o bot deve ouvir os comandos)

🇺🇸

After getting everything together, set your environment variables inside a .env:

(target text channel ===> Channel that this bot should listen for commands)

```
SERVER_PORT=8000
CLIENT_ID=<discord application id>
BOT_TOKEN=<discord bot token>

TARGET_CHANNEL_NAME=<target text channel>
HEXAONE_API_KEY=<hexaone api key>

MONGO_HOST='mongodb://localhost/<your mongodb collection>'
```

### Rodando / Running
🇧🇷

Após tudo configurado, execute o bot como qualquer aplicação Node.

--repopulate => popula o banco com dados do hexa.one

--update-currency => atualiza os preços com o valor atual do dólar

🇺🇸

After everything is set up, just execute as a normal node application.

--repopulate => populate db with hexa.one data

--update-currency => update prices in Real (brazilian currency) with current dolar price


```
$ yarn install

$ node app

$ node app --repopulate
$ node app --update-currency
```

### Adicionando o bot ao servidor / Adding bot to your server
🇧🇷

Assim que o bot estiver configurado e rodando, você deve adicionar o bot no seu servidor. Na documentação do discord fica meio difícil de achar o link, mas é o link abaixo. Substitua client_id pelo seu client id da sua aplicação (não seu bot, sua aplicação!). Em permissions você coloca o número gerado com a permissões do seu bot (no fim da página do seu bot no painel do discord). Eu coloquei 8 (admin) porque fiquei com preguiça de calcular os direitos certos.
 
🇺🇸

Finally when the bot is up and running, you need to add it to your discord server. It's kinda tricky to find how to do it on the official discord docs, but the link's is down below. You need to change the <client_id> with the client id of your application (not your bot's, your application's!). You can calculate your permission number on your bot's page on discord panel, I just put 8 (admin) because I was too lazy to calculate it.

```
https://discord.com/oauth2/authorize?client_id=<client_id>&scope=bot&permissions=8
```

🇧🇷

Depois de tudo isso, seu bot está funcionando! A lista de comandos pode ser acessada com o comando ```cs_help```. Lembre-se que o bot só vai ouvir comandos que sejam enviados no canal que você configurou como 'targetChannel' no seu .env. Espero que tenha ajudado!


🇺🇸

Now that the bot is up, running and in your server, everything must be working just fine! The command list can be accessed through the command ```cs_help```. Remember that the bot will only listen to commands sent on the channel you set as 'targetChannel' on your .env file. I hope this has helped you in some way!
