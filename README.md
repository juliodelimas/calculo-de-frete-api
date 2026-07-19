# API de Calculo de Frete

Esta API foi criada para demonstrar **code review funcional com IA**. Ela possui defeitos funcionais intencionais, isto e, problemas que podem ser percebidos ao comparar o codigo com as regras de negocio, mesmo antes de executar testes funcionais.

## Como rodar

```bash
npm start
```

A API sobe por padrao em `http://localhost:3000`.

## Endpoint

`POST /fretes/cotacao`

Exemplo de requisicao:

```json
{
  "cepOrigem": "01311000",
  "cepDestino": "01310930",
  "pesoKg": 2.4,
  "valorDeclarado": 750,
  "modalidade": "ECONOMICO"
}
```

Exemplo de resposta esperada:

```json
{
  "valorFrete": 0,
  "prazoDias": 2,
  "modalidade": "ECONOMICO",
  "mensagem": "Frete calculado com sucesso"
}
```

## Material para o video

- [REGRAS_DE_NEGOCIO.md](./REGRAS_DE_NEGOCIO.md): contrato funcional que a API deveria respeitar.
- [PROMPT_CODE_REVIEW_FUNCIONAL.md](./PROMPT_CODE_REVIEW_FUNCIONAL.md): prompt para pedir a uma IA uma revisão funcional do codigo.
- [src/server.js](./src/server.js): implementacao com defeitos funcionais intencionais.

Use este projeto como se fosse uma Pull Request real: leia as regras de negocio, depois leia o codigo e procure inconsistencias funcionais.
