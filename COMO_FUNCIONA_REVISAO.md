# 📚 Como Funciona o Sistema de Revisão Espaçada

## 🎯 Objetivo do Sistema

O sistema de revisão espaçada ajuda você a memorizar conteúdo de longo prazo, revisando no momento certo - nem muito cedo (desperdiçando tempo) nem muito tarde (esquecendo o conteúdo).

## 🔢 Componentes Principais

### 1. **Review Count (Contagem de Revisões)**
- Quantas vezes você já revisou este assunto
- Começa em 0 e aumenta +1 a cada revisão
- **IMPORTANTE**: Se sua acurácia cair abaixo de 40%, volta para 1 (recomeça o processo)

### 2. **Acurácia Acumulada**
- Porcentagem de acertos em TODAS as sessões deste assunto
- Exemplo: 55 acertos de 100 questões = 55% de acurácia
- Usado para calcular o quão bem você domina o conteúdo

### 3. **Intervalo Base**
- Calculado pela fórmula: `1.7^(reviewCount - 1)`
- Cresce exponencialmente conforme você revisa mais
- **Limitado a 180 dias** (6 meses) no máximo

### 4. **Multiplicador de Dificuldade**
- Ajusta o intervalo baseado na sua performance
- Fórmula: `0.6 + (acurácia³ × 1.4)`
- Recompensa alta performance com intervalos maiores

## 🔄 Fluxo do Sistema - Passo a Passo

### Quando Você Termina uma Sessão:

```
1️⃣ Sistema calcula sua acurácia acumulada
   Exemplo: 55 acertos / 100 questões = 55%

2️⃣ Verifica se acurácia < 40%
   SIM → Review count volta para 1 (precisa reaprender)
   NÃO → Review count aumenta +1 (progredindo bem)

3️⃣ Calcula intervalo base
   Exemplo: reviewCount = 5
   → 1.7^(5-1) = 1.7^4 = 8.35 → 8 dias

4️⃣ Calcula multiplicador de dificuldade
   Exemplo: 55% acurácia
   → 0.6 + (0.55³ × 1.4) = 0.6 + 0.234 = 0.83

5️⃣ Calcula intervalo final
   → 8 dias × 0.83 = 6.64 → 7 dias
   → Aplicando limites: min(180, max(1, 7)) = 7 dias

6️⃣ Agenda próxima revisão
   → Hoje + 7 dias = próxima revisão
```

## 📊 Exemplos Práticos

### Exemplo 1: João Aprendendo (Baixa Acurácia)

**Sessão 1**: 1/10 acertos → 10% acurácia
- Review count: 1 (abaixo de 40%)
- Intervalo base: 1 dia
- Multiplicador: 0.60 (baixa acurácia)
- **Próxima revisão**: 1 dia

**Sessão 2**: 2/10 acertos → 15% acurácia acumulada
- Review count: 1 (ainda abaixo de 40%)
- Intervalo base: 1 dia
- Multiplicador: 0.60
- **Próxima revisão**: 1 dia

**Sessão 7**: 7/10 acertos → 40% acurácia acumulada 🎉
- Review count: 2 (passou de 40%!)
- Intervalo base: 2 dias
- Multiplicador: 0.69
- **Próxima revisão**: 1 dia (2 × 0.69 = 1.38 → 1 dia)

### Exemplo 2: João Dominando (Alta Acurácia)

**Sessão 10**: 10/10 acertos → 55% acurácia acumulada
- Review count: 5
- Intervalo base: 8 dias
- Multiplicador: 0.83
- **Próxima revisão**: 7 dias

**Sessão 15**: 10/10 acertos → 69% acurácia acumulada
- Review count: 10
- Intervalo base: 119 dias
- Multiplicador: 1.05 (acima de 1.0 pela primeira vez!)
- **Próxima revisão**: 125 dias

**Sessão 20**: 10/10 acertos → 76% acurácia acumulada
- Review count: 15
- Intervalo base: 180 dias (já atingiu o limite)
- Multiplicador: 1.21 (alta performance!)
- Cálculo: 180 × 1.21 = 218 dias
- **Próxima revisão**: 180 dias (aplicado o limite máximo!)

## 🎨 Visualização do Processo

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DE REVISÃO                          │
└─────────────────────────────────────────────────────────────┘

Estudo → Responde Questões → Calcula Acurácia
   ↓                              ↓
   └──────────────────────────────┘
                  ↓
        Acurácia < 40%?
                  ↓
         SIM ─────┴───── NÃO
          ↓              ↓
    Reset para     Aumenta Review
    Review = 1      Count (+1)
          ↓              ↓
          └──────┬───────┘
                 ↓
      Calcula Intervalo Base
         (crescimento exponencial)
                 ↓
      Multiplica por Dificuldade
         (baseado em acurácia)
                 ↓
       Aplica Limites (1-180 dias)
                 ↓
      📅 Agenda Próxima Revisão
```

## 💡 Por Que Este Sistema Funciona?

### 1. **Proteção para Iniciantes** (< 40% acurácia)
- Mantém revisões diárias até você melhorar
- Previne que você avance rápido demais sem dominar o básico

### 2. **Crescimento Exponencial** (≥ 40% acurácia)
- Intervalos aumentam rapidamente conforme você melhora
- Base 1.7 significa aproximadamente 70% de aumento a cada revisão

### 3. **Multiplicador de Dificuldade**
- Acurácia baixa (40%): multiplica por 0.69 (intervalos menores)
- Acurácia média (55%): multiplica por 0.83 (balanceado)
- Acurácia alta (76%): multiplica por 1.21 (intervalos maiores)

### 4. **Limite Máximo de 180 Dias**
- Mesmo conteúdo muito bem dominado precisa ser revisado
- 6 meses é o máximo cientificamente recomendado

## 📈 Progressão Típica

| Fase | Review Count | Acurácia | Intervalo Típico |
|------|--------------|----------|------------------|
| **Aprendendo** | 1-2 | 10-40% | 1 dia (revisões diárias) |
| **Consolidando** | 3-7 | 40-65% | 2-22 dias (semanalmente) |
| **Dominando** | 8-12 | 65-75% | 40-180 dias (mensalmente) |
| **Mantendo** | 13+ | 75%+ | 180 dias (semestralmente) |

## 🔧 O Que Foi Corrigido (Bug Fix)

### Antes (BUG):
```typescript
const intervalDays = Math.max(1, Math.round(baseInterval * difficultyMult));
// ❌ Problema: Com alta acurácia (multiplier > 1.0), 
// intervalos podiam exceder 180 dias
// Exemplo: 180 × 1.21 = 218 dias
```

### Depois (CORRIGIDO):
```typescript
const intervalDays = Math.max(1, Math.min(180, Math.round(baseInterval * difficultyMult)));
// ✅ Solução: Limite de 180 dias aplicado DEPOIS do multiplicador
// Exemplo: min(180, 180 × 1.21) = 180 dias
```

## 🎯 Resumo em Uma Frase

**"O sistema agenda revisões mais frequentes quando você está aprendendo e mais espaçadas quando você já domina, mas nunca mais que 6 meses."**

---

## 📊 Testando o Sistema

Para ver o sistema em ação, execute os testes:

```bash
# Aprendizado inicial (10 sessões)
npm run test:joao

# Revisões futuras após domínio (20 sessões)
npm run test:joao-future
```

Os testes mostram como João progride de 1/10 acertos até domínio completo, e como os intervalos de revisão se ajustam automaticamente!
