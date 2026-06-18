# Minha Saúde Hoje

> “Cada passo é um verso, cada batida um poema: seu bem-estar em forma de dashboard.”  
> Bem-vindo ao protótipo do app **Minha Saúde Hoje**, um painel móvel que celebra dados simulados de saúde de forma leve, intuitiva e cheia de estilo.

---

## Índice

- [Visão Geral](#visão-geral)  
- [Demonstração](#demonstração)  
- [Funcionalidades](#funcionalidades)  
- [Pré-requisitos](#pré-requisitos)  
- [Instalação e Execução](#instalação-e-execução)  
- [Estrutura de Pastas](#estrutura-de-pastas)  
- [Como Funciona por Dentro](#como-funciona-por-dentro)  
- [Customização de Dados Simulados](#customização-de-dados-simulados)  
- [Design e Estilização](#design-e-estilização)  
- [Link Externo & Linking](#link-externo--linking)  
- [Contribuindo e Próximos Passos](#contribuindo-e-próximos-passos)  
- [Autor / Contato](#autor--contato)  
- [Licença](#licença)

---

## Visão Geral

Em um mundo que vibra a cada batida do coração e conta cada passo do dia, **Minha Saúde Hoje** é um protótipo que revive a ideia de monitorar o bem-estar de forma simples e visual.  
Aqui, não há necessidade de bancões de dados ou autenticação complexa: a magia acontece com dados estáticos ou gerados aleatoriamente em tempo de execução (useEffect), só para que você sinta o gostinho de como seria ter seu próprio dashboard de saúde móvel.

Este projeto foi desenvolvido em **React Native** com **Expo**, seguindo boas práticas de organização, estilização com shadow trees (cartões com sombra, bordas arredondadas, hierarquia visual) e hooks (`useState`, `useEffect`) para gerenciar estado e simular carregamento de dados.

---

## Demonstração

> **Link para demo no Expo Snack ou QR Code no Expo Go**:  
> - Expo Snack (placeholder): https://snack.expo.dev/@seu-usuario/minha-saude-hoje (substitua pelo link real)  
> - Ou escaneie o QR Code a partir do `expo start` para rodar no seu dispositivo com Expo Go.

*(Coloque aqui a imagem ou GIF do app em funcionamento, se desejar)*

---

## Funcionalidades

1. **Indicadores Pessoais**:  
   - Quantidade de passos dados no dia.  
   - Horas de sono registradas.  
   - Nível de hidratação (em litros).  
   - Frequência cardíaca média.  
   Cada indicador é exibido num **card estilizado**, com sombra e ícones ou ilustrações (em `assets/icons`).

2. **Dados Simulados Dinâmicos**:  
   - Ao abrir a tela, via `useEffect`, são gerados ou carregados valores aleatórios ou estáticos predefinidos.  
   - Estado controlado com `useState`, permitindo futuras expansões (por exemplo, atualizar dados periodicamente).

3. **Visual Claro e Intuitivo**:  
   - Componentes organizados em `components/` e telas em `screens/`.  
   - Uso de estilos com sombra e hierarquia visual (“shadow tree”) para dar profundidade aos cards e seções.

4. **Link “Ver mais informações”**:  
   - Botão que, ao ser clicado, chama `Linking.openURL()` para abrir uma página externa (por exemplo, um site sobre saúde).  
   - Demonstra como integrar linking nativo em React Native.

5. **Conceito de Bundle & Empacotamento**:  
   - Projeto pronto para ser empacotado com Expo, garantindo que todos os recursos (componentes, estilos, imagens e navegação) estejam integrados e funcionem de forma unificada.

---

## Pré-requisitos

- Node.js (versão LTS recomendada)  
- npm ou Yarn  
- Expo CLI instalado globalmente (opcional, mas facilita):  
  ```bash
  npm install -g expo-cli
