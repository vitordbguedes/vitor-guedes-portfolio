# Vitor Guedes — Portfólio

Este pacote contém o site completo do seu portfólio, pronto para publicar. Não precisa instalar nada, não precisa saber programar — é só seguir um dos dois caminhos abaixo.

**O que tem aqui dentro:**

```
vitor-guedes-portfolio/
├── index.html                   ← a página principal do site
├── Vitor-Guedes-Portfolio.pdf   ← o portfólio em PDF, para anexar ao currículo
├── README.md                    ← este guia
├── .nojekyll                    ← arquivo técnico, não mexa nele
└── assets/
    ├── css/styles.css           ← todo o visual do site (cores, fontes, layout)
    ├── img/                     ← as fotos usadas nos cases
    └── js/
        ├── i18n.js              ← todos os textos, em português, inglês e espanhol
        └── app.js               ← as animações e os gráficos interativos
```

Você não vai editar nada disso agora — está tudo pronto. Este README existe só para o dia em que você quiser trocar um texto ou uma foto.

---

## Antes de publicar: qual caminho escolher

Você tem dois caminhos bons. Escolha pelo que importa mais pra você agora:

| Se você quer... | Use |
|---|---|
| Ver o site no ar **hoje, em menos de 2 minutos**, sem criar conta | **Netlify Drop** |
| Um endereço **permanente e profissional** para colocar no LinkedIn e currículo, e poder editar depois | **GitHub Pages** |

Não tem problema nenhum em fazer os dois. Muita gente sobe rápido no Netlify pra testar, e depois faz o definitivo no GitHub. Nenhum interfere no outro.

---

## Caminho 1 — Netlify Drop (o mais rápido)

Isso aqui é literalmente arrastar uma pasta e pronto. Sem criar login, sem configurar nada.

**Passo 1.** Abra o navegador e vá em **[app.netlify.com/drop](https://app.netlify.com/drop)**

**Passo 2.** Você vai ver uma área grande escrito algo como "Drag and drop your site output folder here" (arraste a pasta do seu site aqui).

**Passo 3.** Pegue a pasta **`vitor-guedes-portfolio`** inteira (a pasta, não só o `index.html` sozinho) e arraste ela para dentro dessa área. Se você baixou um `.zip`, descompacte primeiro — dá dois cliques nele ou clique direito e "Extrair" — e arraste a pasta que aparecer.

**Passo 4.** Espere uns 10 a 30 segundos. O Netlify sobe os arquivos e te dá um link tipo `nome-aleatorio-123.netlify.app`. É isso, o site já está no ar nesse endereço.

**Passo 5 (opcional, mas recomendado).** Esse nome aleatório fica feio pra colocar no currículo. Para trocar: clique em **"Site settings"** → **"Change site name"**, e escolha algo como `vitorguedes` — o endereço final fica `vitorguedes.netlify.app`.

> Detalhe importante: o link do Netlify Drop funciona sem conta, mas se você fechar o navegador sem criar uma conta gratuita, você perde a capacidade de atualizar esse site depois (ele continua no ar, só não dá pra editar). Se quiser poder atualizar depois, crie uma conta gratuita na hora — é rápido, só e-mail e senha.

---

## Caminho 2 — GitHub Pages (o definitivo)

Esse é o caminho para ter um endereço fixo, ligado ao seu nome, que você atualiza direto pelo navegador sempre que quiser — sem precisar arrastar pasta de novo.

### Parte A — Criar sua conta (pule se já tiver uma)

**Passo 1.** Vá em **[github.com](https://github.com)** e clique em **"Sign up"**.

**Passo 2.** Preencha e-mail, senha e um nome de usuário (esse nome vai aparecer no endereço do seu site, tipo `github.com/SEUNOME`, então escolha algo profissional — pode ser seu nome mesmo, tipo `vitorguedes` ou `vguedes`).

**Passo 3.** Confirme o e-mail que o GitHub te manda.

### Parte B — Criar o repositório (a "pasta" do seu projeto no GitHub)

**Passo 4.** Logado no GitHub, clique no **sinal de "+"** no canto superior direito da tela → **"New repository"**.

**Passo 5.** No campo **"Repository name"**, digite: `vitor-guedes-portfolio`

**Passo 6.** Deixe marcado **"Public"** (precisa ser público para o site funcionar de graça).

**Passo 7.** **Não marque nenhuma das caixinhas** que aparecem embaixo ("Add a README file", etc.) — o pacote que você já tem já vem com tudo.

**Passo 8.** Clique no botão verde **"Create repository"**.

### Parte C — Subir os arquivos

**Passo 9.** Na tela que abre, procure o link **"uploading an existing file"** (geralmente aparece escrito em azul no meio de uma frase) e clique nele.

**Passo 10.** Agora você vai arrastar os arquivos. Abra a pasta `vitor-guedes-portfolio` no seu computador e selecione **tudo que está dentro dela**: `index.html`, `README.md`, `Vitor-Guedes-Portfolio.pdf`, `.nojekyll` e a **pasta `assets` inteira**. Arraste tudo de uma vez para a área de upload do GitHub.

> **Se o navegador recusar arrastar a pasta `assets`:** alguns navegadores não aceitam pastas inteiras no arrasta-e-solta, só arquivos soltos. Se isso acontecer, veja a seção **"Se a pasta assets não subir"** mais abaixo — é rápido de resolver.

**Passo 11.** Espere o upload terminar (a barra de progresso aparece embaixo de cada arquivo).

**Passo 12.** Desça a página, escreva algo tipo `primeira versão do site` na caixinha de mensagem, e clique no botão verde **"Commit changes"**.

### Parte D — Ligar o GitHub Pages

**Passo 13.** No topo do repositório, clique na aba **"Settings"** (ícone de engrenagem).

**Passo 14.** No menu da esquerda, clique em **"Pages"**.

**Passo 15.** Onde estiver escrito **"Source"**, selecione **"Deploy from a branch"**.

**Passo 16.** Logo abaixo, em **"Branch"**, troque de "None" para **"main"**, e ao lado escolha a pasta **"/ (root)"**. Clique em **"Save"**.

**Passo 17.** Espere de 1 a 3 minutos (o GitHub mostra uma bolinha girando enquanto publica). Recarregue a página de **Settings → Pages** depois desse tempo.

**Passo 18.** Vai aparecer uma faixa verde no topo com o endereço do seu site, algo como:

```
https://SEUNOME.github.io/vitor-guedes-portfolio/
```

Esse é o link definitivo. Coloque ele no LinkedIn (seção "Site" do perfil), no topo do currículo e na assinatura de e-mail.

### Se a pasta `assets` não subir

Alguns navegadores só aceitam arquivos soltos no arrasta-e-solta, não pastas. Se isso acontecer com você, faça assim:

1. Suba primeiro só o `index.html`, o `README.md`, o PDF e o `.nojekyll` (os que não estão dentro de pasta).
2. Depois, no repositório, clique em **"Add file"** → **"Create new file"**.
3. No campo do nome do arquivo, digite exatamente: `assets/css/styles.css` — ao digitar a barra `/`, o GitHub cria a pasta sozinho.
4. Abra o arquivo `styles.css` no seu computador com o Bloco de Notas (Windows) ou TextEdit (Mac), copie todo o conteúdo, e cole na caixa de texto grande do GitHub.
5. Clique em **"Commit changes"**.
6. Repita os passos 2 a 5 para os outros dois arquivos: `assets/js/i18n.js` e `assets/js/app.js`.
7. Para as fotos dentro de `assets/img/`, use o mesmo caminho: **"Add file" → "Upload files"**, e arraste as fotos ali dentro (fotos soltas costumam subir sem problema, mesmo quando pastas inteiras não sobem).

### Atualizando o site depois

Sempre que quiser mudar algo:

1. No repositório, clique no arquivo que quer editar (por exemplo `assets/js/i18n.js` para mudar um texto).
2. Clique no ícone de **lápis** (editar) no canto superior direito do arquivo.
3. Faça a alteração.
4. Desça a página e clique em **"Commit changes"**.
5. Em cerca de 1 minuto o site atualiza sozinho no ar — não precisa fazer mais nada.

---

## E se eu quiser um domínio próprio, tipo vitorguedes.com.br?

Isso é um passo a mais, opcional, e pode ser feito bem depois — o site já funciona perfeitamente nos endereços gratuitos acima.

1. Compre o domínio em um registrador — no Brasil, o mais comum é o **[registro.br](https://registro.br)** (para `.com.br`) ou o **[Namecheap](https://namecheap.com)** (para `.com`).
2. Se você publicou no **GitHub Pages**: vá em Settings → Pages → **"Custom domain"**, digite seu domínio, e siga as instruções de DNS que o GitHub mostra (você vai precisar cadastrar alguns registros no painel do registrador — o próprio GitHub explica quais).
3. Se você publicou no **Netlify**: vá em **"Domain settings"** → **"Add a domain"**, e siga o mesmo tipo de instrução.

Se chegar nessa etapa e travar em algum ponto do DNS, me chame de volta que eu te ajudo com o passo exato.

---

## Checklist final antes de divulgar

- [ ] Abrir o link publicado no computador e no celular
- [ ] Testar os três idiomas no seletor do topo (PT · EN · ES)
- [ ] Testar o botão de WhatsApp e o de ligação no celular
- [ ] Testar o botão de e-mail (deve abrir seu app de e-mail com o assunto já preenchido)
- [ ] Passar o mouse e clicar nas três demonstrações do Projeto ANT
- [ ] Conferir se as fotos do Prêmio Prisma e da Smart Fit carregaram
- [ ] Adicionar o link do site no LinkedIn e no cabeçalho do currículo
- [ ] Anexar o `Vitor-Guedes-Portfolio.pdf` junto com o currículo nas candidaturas

---

## Alguma coisa não funcionou?

- **O site abriu mas sem estilo nenhum, tudo em texto puro:** a pasta `assets` não subiu completa. Veja a seção "Se a pasta assets não subir" acima.
- **As fotos não aparecem:** confira se a pasta `assets/img/` tem os 6 arquivos de imagem. Se faltar algum, o espaço da foto simplesmente some sozinho — não quebra o layout, mas a foto não aparece.
- **O GitHub Pages mostra uma página em branco ou erro 404:** espere mais alguns minutos (às vezes demora até 5 min na primeira publicação) e recarregue. Se persistir, confira em Settings → Pages se a branch está mesmo em "main" e a pasta em "/ (root)".
- **Qualquer outra coisa:** me manda print da tela onde travou que eu te digo exatamente o próximo clique.

---

© Vitor Mateus de Britto Guedes · 2026
