# UrnaMaster v0.1

Simulador didático de urna eletrônica com frontend em HTML/CSS/JavaScript e backend em PHP + MySQL.

## Recursos

- Teclado numérico estilo urna.
- Candidatos:
  - 13000 — LulaTron
  - 14000 — Renan Tigrinho
  - 22000 — CyberNaro
- Voto em branco.
- Botões BRANCO, CORRIGE e CONFIRMA.
- Tela de resultados reais.
- Tela separada de simulação didática de manipulação.
- A simulação nunca altera os votos salvos no banco.
- Propaganda fictícia do LulaTron: "Bio Picanha — a carne artificial do futuro".

## Requisitos

- PHP 8.0+
- MySQL/MariaDB
- Apache (XAMPP, WAMP, Laragon ou equivalente)

## Instalação rápida com XAMPP

1. Copie a pasta `UrnaMaster_v0.1` para:
   `C:\xampp\htdocs\UrnaMaster`

2. Inicie Apache e MySQL no XAMPP.

3. Abra o phpMyAdmin:
   `http://localhost/phpmyadmin`

4. Importe:
   `database/urna_master.sql`

5. Confira as credenciais em:
   `backend/config/database.php`

   Padrão:
   - host: localhost
   - banco: urna_master
   - usuário: root
   - senha: vazia

6. Abra:
   `http://localhost/UrnaMaster/frontend/`

## Resultado

A página `resultado.html` mostra:

### Apuração real
Contabiliza exatamente os votos registrados.

### Simulação didática
Demonstra, de forma visível, como uma apuração adulterada poderia alterar o resultado:
- LulaTron recebe valor simulado equivalente a 120% dos votos do CyberNaro quando isso for necessário para superá-lo.
- Renan Tigrinho é artificialmente limitado a ficar abaixo dos votos em branco quando houver votos em branco.

Essas regras existem apenas no endpoint `simulacao.php` e NÃO alteram o banco de dados.

## API

- `GET backend/api/candidatos.php`
- `POST backend/api/votar.php`
- `GET backend/api/resultado.php`
- `GET backend/api/simulacao.php`
- `POST backend/api/resetar.php`

## Exemplo de voto

```json
{
  "numero": "13000",
  "branco": false
}
```

Voto em branco:

```json
{
  "numero": null,
  "branco": true
}
```
