export default async function handler(req, res) {
  try {
    const resposta = await fetch(
      'https://api.football-data.org/v4/competitions/BSA/standings',
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN,
        },
      }
    )

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        erro: 'Erro ao consultar a API do futebol.',
      })
    }

    const dados = await resposta.json()

    res.status(200).json(dados)
  } catch (erro) {
    res.status(500).json({
      erro: 'Erro interno ao carregar a tabela.',
    })
  }
}