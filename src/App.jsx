import { useEffect, useState } from 'react'
import './App.css'

function App() {
const [times, setTimes] = useState([])
const [rodada, setRodada] = useState(null)
const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null)
const [carregando, setCarregando] = useState(true)
const [erro, setErro] = useState(null)

useEffect(() => {
  async function carregarTabela() {
    try {
      const resposta = await fetch('/api/v4/competitions/BSA/standings')

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar a tabela.')
      }

      const dados = await resposta.json()

      setTimes(dados.standings[0].table)
      setRodada(dados.season.currentMatchday)

      setUltimaAtualizacao(
        new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )

      setErro(null)
    } catch (erro) {
      setErro(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  carregarTabela()

  const intervalo = setInterval(carregarTabela, 5 * 60 * 1000)

  return () => clearInterval(intervalo)
}, [])

  if (carregando) {
    return (
      <main className="app">
        <header className="header">
          <div>
            <h1 className="titulo">Brasileirão</h1>
            <span className="subtitulo">
  Classificação
  {rodada && ` · Rodada ${rodada}`}
</span>
          </div>

          <div className="informacoes">
  <span className="ano">2026</span>

  {ultimaAtualizacao && (
    <span className="atualizacao">
      Atualizado às {ultimaAtualizacao}
    </span>
  )}
</div>
        </header>

        <div className="mensagem">
          Carregando tabela...
        </div>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="app">
        <header className="header">
          <div>
            <h1 className="titulo">Brasileirão</h1>
            <span className="subtitulo">Classificação</span>
          </div>

          <span className="ano">2026</span>
        </header>

        <div className="mensagem erro">
          {erro}
        </div>
      </main>
    )
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1 className="titulo">Brasileirão</h1>
          <span className="subtitulo">Classificação</span>
        </div>

        <span className="ano">2026</span>
      </header>

      <section className="tabela-container">
        <div className="tabela-scroll">
          <div className="tabela">

            <div className="cabecalho">
              <span>Pos.</span>
              <span>Time</span>
              <span>P</span>
              <span>J</span>
              <span>V</span>
              <span>E</span>
              <span>D</span>
              <span>GP</span>
              <span>GC</span>
              <span>SG</span>
            </div>

            {times.map((time) => {
              const saldo = time.goalDifference

              return (
                <div
                  className={`linha ${
                    time.position <= 4
                      ? 'libertadores'
                      : time.position >= 17
                        ? 'rebaixamento'
                        : ''
                  }`}
                  key={time.team.id}
                >
                  <span className="posicao">
                    {time.position}
                  </span>

                  <span className="time">
                    <img
                      src={time.team.crest}
                      alt=""
                      className="escudo"
                    />

                    {time.team.shortName}
                  </span>

                  <strong>{time.points}</strong>

                  <span>{time.playedGames}</span>
                  <span>{time.won}</span>
                  <span>{time.draw}</span>
                  <span>{time.lost}</span>
                  <span>{time.goalsFor}</span>
                  <span>{time.goalsAgainst}</span>
                  <span>
                    {saldo > 0 ? `+${saldo}` : saldo}
                  </span>
                </div>
              )
            })}

          </div>
        </div>

        <div className="legenda">
          <div>
            <span className="indicador verde"></span>
            Libertadores
          </div>

          <div>
            <span className="indicador vermelho"></span>
            Rebaixamento
          </div>
        </div>
      </section>
    </main>
  )
}

export default App